import type { AnatomicalRegion } from "./medicalData"

export type RegionShape = "box" | "ellipsoid"

export interface RegionHitArea {
  region: AnatomicalRegion
  shape: RegionShape
  /** Normalized GLB coordinates: +Y is up and the horse's head faces +Z. */
  position: [number, number, number]
  scale: [number, number, number]
}

export const HORSE_MODEL_URL = "/models/horse-visual.glb"

/**
 * Selection volumes calibrated to horse-visual.glb after its 6.4-unit normalization.
 * The source asset is 1.0 unit long (Z), 0.898 unit tall (Y), and 0.296 unit wide (X).
 */
export const REGION_HIT_AREAS: RegionHitArea[] = [
  {
    region: "Head",
    shape: "ellipsoid",
    position: [0, 4.9, 2.9],
    scale: [0.78, 0.92, 0.92],
  },
  {
    region: "Neck",
    shape: "ellipsoid",
    position: [0, 4.2, 2.02],
    scale: [0.86, 1.55, 1.18],
  },
  {
    region: "Shoulder",
    shape: "ellipsoid",
    position: [0, 3.42, 1.12],
    scale: [1.02, 1.55, 0.9],
  },
  {
    region: "Chest",
    shape: "ellipsoid",
    position: [0, 2.83, 1.28],
    scale: [1.12, 1.25, 0.86],
  },
  {
    region: "Back",
    shape: "box",
    position: [0, 4.08, -0.12],
    scale: [1.1, 0.66, 2.7],
  },
  {
    region: "Abdomen",
    shape: "ellipsoid",
    position: [0, 2.62, -0.32],
    scale: [1.16, 1.45, 2.68],
  },
  {
    region: "Left Front Leg",
    shape: "box",
    position: [-0.43, 1.62, 1.18],
    scale: [0.36, 3.12, 0.44],
  },
  {
    region: "Right Front Leg",
    shape: "box",
    position: [0.43, 1.62, 1.18],
    scale: [0.36, 3.12, 0.44],
  },
  {
    region: "Left Hind Leg",
    shape: "box",
    position: [-0.46, 1.52, -1.72],
    scale: [0.4, 3, 0.5],
  },
  {
    region: "Right Hind Leg",
    shape: "box",
    position: [0.46, 1.52, -1.72],
    scale: [0.4, 3, 0.5],
  },
  {
    region: "Left Front Hoof",
    shape: "ellipsoid",
    position: [-0.43, 0.22, 1.28],
    scale: [0.48, 0.4, 0.7],
  },
  {
    region: "Right Front Hoof",
    shape: "ellipsoid",
    position: [0.43, 0.22, 1.28],
    scale: [0.48, 0.4, 0.7],
  },
  {
    region: "Left Hind Hoof",
    shape: "ellipsoid",
    position: [-0.46, 0.22, -1.84],
    scale: [0.5, 0.4, 0.74],
  },
  {
    region: "Right Hind Hoof",
    shape: "ellipsoid",
    position: [0.46, 0.22, -1.84],
    scale: [0.5, 0.4, 0.74],
  },
]
