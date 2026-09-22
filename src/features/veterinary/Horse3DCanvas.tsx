import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { Html, OrbitControls, useGLTF } from "@react-three/drei"
import { Box3, Group, Mesh, Vector3 } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { Button } from "../../components/Button"
import { Icon } from "../../components/Icon"
import {
  HORSE_MODEL_URL,
  REGION_HIT_AREAS,
  type RegionHitArea,
} from "./anatomyRegions"
import type { AnatomicalRegion } from "./medicalData"

type CameraView = "Left" | "Front" | "Right" | "Rear"

interface Horse3DCanvasProps {
  selectedRegion: AnatomicalRegion
  onRegionChange: (region: AnatomicalRegion) => void
}

const CAMERA_PRESETS: Record<CameraView, [number, number, number]> = {
  // The supplied GLB runs head-to-tail along Z. Side presets look across X.
  Left: [-9, 3.05, 0],
  Front: [0, 3.05, 9],
  Right: [9, 3.05, 0],
  Rear: [0, 3.05, -9],
}

export function Horse3DCanvas({
  selectedRegion,
  onRegionChange,
}: Horse3DCanvasProps) {
  const [cameraView, setCameraView] = useState<CameraView>("Left")
  const [resetKey, setResetKey] = useState(0)
  const supportsWebGL = useMemo(isWebGLAvailable, [])

  if (!supportsWebGL)
    return (
      <CanvasUnavailable message="3D viewing is unavailable in this browser. Select the anatomical region from the list." />
    )

  return (
    <ModelErrorBoundary
      fallback={
        <CanvasUnavailable message="The 3D horse model is unavailable. Select the anatomical region from the list." />
      }
    >
      <div className="relative h-[300px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[var(--color-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] shadow-sm">
          <Icon name="rotate" size={12} /> Drag to rotate · Scroll to zoom
        </div>
        <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-[var(--color-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] shadow-sm">
          {cameraView} view
        </div>

        <Canvas
          className="h-full w-full"
          camera={{ position: CAMERA_PRESETS.Left, fov: 38 }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#f7f5fb"]} />
          <hemisphereLight
            intensity={1.15}
            color="#ffffff"
            groundColor="#d8d1e8"
          />
          <directionalLight position={[-5, 8, 6]} intensity={1.75} />
          <directionalLight position={[5, 3, -4]} intensity={0.45} />
          <Suspense fallback={<CanvasLoading />}>
            <CameraController view={cameraView} resetKey={resetKey} />
            <HorseModel
              selectedRegion={selectedRegion}
              onRegionChange={onRegionChange}
            />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {(Object.keys(CAMERA_PRESETS) as CameraView[]).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setCameraView(view)}
                className={`rounded-[var(--radius-xs)] px-2 py-1 text-[10px] font-medium transition-colors ${
                  cameraView === view
                    ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                    : "bg-[var(--color-surface)]/90 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon="refresh"
            aria-label="Reset 3D view"
            onClick={() => {
              setCameraView("Left")
              setResetKey((value) => value + 1)
            }}
          />
        </div>
      </div>
    </ModelErrorBoundary>
  )
}

function HorseModel({ selectedRegion, onRegionChange }: Horse3DCanvasProps) {
  const { scene } = useGLTF(HORSE_MODEL_URL)
  const model = useMemo(() => scene.clone(true), [scene])
  const transform = useMemo(() => getNormalizedTransform(model), [model])

  useEffect(() => {
    model.traverse((node) => {
      if (node instanceof Mesh) node.raycast = () => undefined
    })
  }, [model])

  return (
    <group>
      <group position={transform.position} scale={transform.scale}>
        <primitive object={model} />
      </group>
      {REGION_HIT_AREAS.map((area) => (
        <RegionProxy
          key={area.region}
          area={area}
          selected={area.region === selectedRegion}
          onSelect={onRegionChange}
        />
      ))}
    </group>
  )
}

function RegionProxy({
  area,
  selected,
  onSelect,
}: {
  area: RegionHitArea
  selected: boolean
  onSelect: (region: AnatomicalRegion) => void
}) {
  return (
    <mesh
      position={area.position}
      scale={area.scale}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(area.region)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto"
      }}
    >
      {area.shape === "box" ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <sphereGeometry args={[1, 20, 16]} />
      )}
      <meshBasicMaterial
        color={selected ? "#dc2626" : "#000000"}
        transparent
        opacity={selected ? 0.34 : 0}
        depthWrite={false}
      />
    </mesh>
  )
}

function CameraController({
  view,
  resetKey,
}: {
  view: CameraView
  resetKey: number
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  useEffect(() => {
    const [x, y, z] = CAMERA_PRESETS[view]
    camera.position.set(x, y, z)
    controls.current?.target.set(0, 3, 0)
    controls.current?.update()
  }, [camera, resetKey, view])
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={4.2}
      maxDistance={13}
      minPolarAngle={0.45}
      maxPolarAngle={2.25}
    />
  )
}

function CanvasLoading() {
  return (
    <Html center>
      <div className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
        Loading 3D horse…
      </div>
    </Html>
  )
}

function CanvasUnavailable({ message }: { message: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-6 text-center">
      <Icon
        name="target"
        size={22}
        className="text-[var(--color-text-muted)]"
      />
      <p className="mt-2 text-[13px] font-medium text-[var(--color-text-primary)]">
        3D model unavailable
      </p>
      <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
        {message}
      </p>
    </div>
  )
}

class ModelErrorBoundary extends Component<{
  children: ReactNode
  fallback: ReactNode
}, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* Text fallback stays available outside Canvas. */
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function getNormalizedTransform(model: Group) {
  const bounds = new Box3().setFromObject(model)
  const size = bounds.getSize(new Vector3())
  const center = bounds.getCenter(new Vector3())
  const scale = 6.4 / (Math.max(size.x, size.y, size.z) || 1)
  return {
    scale,
    position: [
      -center.x * scale,
      -bounds.min.y * scale,
      -center.z * scale,
    ] as [number, number, number],
  }
}

function isWebGLAvailable() {
  if (typeof document === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    )
  } catch {
    return false
  }
}

useGLTF.preload(HORSE_MODEL_URL)
