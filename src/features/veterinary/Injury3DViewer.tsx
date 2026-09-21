import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Button } from '../../components/Button';
import { FieldLabel } from '../../components/Panel';
import { Icon } from '../../components/Icon';
import {
  ANATOMICAL_REGIONS,
  type AnatomicalRegion,
  type InjurySeverity,
} from './medicalData';

type CameraView = 'Left' | 'Front' | 'Right' | 'Rear';

interface Injury3DViewerProps {
  selectedRegion: AnatomicalRegion;
  onRegionChange: (region: AnatomicalRegion) => void;
  injuryType: string;
  onInjuryTypeChange: (value: string) => void;
  severity: InjurySeverity;
  onSeverityChange: (severity: InjurySeverity) => void;
  applyRestriction: boolean;
  onRestrictionChange: (value: boolean) => void;
}

const CAMERA_ROTATIONS: Record<CameraView, number> = {
  Left: -10,
  Front: -78,
  Right: 168,
  Rear: 82,
};

const INJURY_TYPES = [
  'Soft tissue / lameness',
  'Tendon inflammation',
  'Joint swelling',
  'Wound / skin lesion',
  'Fracture concern',
  'Other',
];

const SEVERITIES: InjurySeverity[] = ['Mild', 'Moderate', 'Severe'];

export function Injury3DViewer({
  selectedRegion,
  onRegionChange,
  injuryType,
  onInjuryTypeChange,
  severity,
  onSeverityChange,
  applyRestriction,
  onRestrictionChange,
}: Injury3DViewerProps) {
  const [cameraView, setCameraView] = useState<CameraView>('Left');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(CAMERA_ROTATIONS.Left);
  const dragStart = useRef<{ x: number; rotation: number } | null>(null);

  function setView(view: CameraView) {
    setCameraView(view);
    setRotation(CAMERA_ROTATIONS[view]);
  }

  function resetView() {
    setCameraView('Left');
    setZoom(1);
    setRotation(CAMERA_ROTATIONS.Left);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, rotation };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    const nextRotation = dragStart.current.rotation + (event.clientX - dragStart.current.x) * 0.45;
    setRotation(Math.max(-180, Math.min(180, nextRotation)));
    setCameraView('Left');
  }

  function stopDragging() {
    dragStart.current = null;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(250px,0.75fr)]">
      <div className="min-w-0">
        <div
          className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onPointerLeave={stopDragging}
          style={{ touchAction: 'none', cursor: dragStart.current ? 'grabbing' : 'grab' }}
        >
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[var(--color-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] shadow-sm">
            <Icon name="rotate" size={12} />
            Drag to rotate
          </div>
          <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-[var(--color-surface)]/90 px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)] shadow-sm">
            {cameraView} view
          </div>
          <div
            className="flex min-h-[300px] items-center justify-center p-5 transition-transform duration-150"
            style={{ transform: `perspective(900px) rotateX(2deg) rotateY(${rotation}deg) scale(${zoom})` }}
          >
            <HorseModel selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {(['Left', 'Front', 'Right', 'Rear'] as CameraView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={(event) => { event.stopPropagation(); setView(view); }}
                  className={`rounded-[var(--radius-xs)] px-2 py-1 text-[10px] font-medium transition-colors ${cameraView === view ? 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]' : 'bg-[var(--color-surface)]/90 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                >
                  {view}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" icon="minus" aria-label="Zoom out" onClick={(event) => { event.stopPropagation(); setZoom((value) => Math.max(0.8, Number((value - 0.1).toFixed(1)))); }} />
              <Button variant="secondary" size="sm" icon="plus" aria-label="Zoom in" onClick={(event) => { event.stopPropagation(); setZoom((value) => Math.min(1.35, Number((value + 0.1).toFixed(1)))); }} />
              <Button variant="secondary" size="sm" icon="refresh" aria-label="Reset view" onClick={(event) => { event.stopPropagation(); resetView(); }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FieldLabel>Selected anatomical region</FieldLabel>
          <select
            value={selectedRegion}
            onChange={(event) => onRegionChange(event.target.value as AnatomicalRegion)}
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            aria-label="Selected anatomical region"
          >
            {ANATOMICAL_REGIONS.map((region) => <option key={region}>{region}</option>)}
          </select>
        </div>

        <div>
          <FieldLabel>Injury type</FieldLabel>
          <select
            value={injuryType}
            onChange={(event) => onInjuryTypeChange(event.target.value)}
            className="mt-1 h-9 w-full rounded-[var(--radius-xs)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2.5 text-[13px] text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/30"
            aria-label="Injury type"
          >
            {INJURY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <FieldLabel>Severity</FieldLabel>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {SEVERITIES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onSeverityChange(value)}
                className={`rounded-[var(--radius-xs)] border px-2 py-2 text-[12px] font-medium transition-colors ${severity === value ? value === 'Severe' ? 'border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]' : value === 'Moderate' ? 'border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]' : 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <input
            type="checkbox"
            checked={applyRestriction}
            onChange={(event) => onRestrictionChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-primary)]"><Icon name="lock" size={13} />Apply training restriction</span>
            <span className="mt-1 block text-[11px] leading-relaxed text-[var(--color-text-secondary)]">Blocks training scheduling until the next veterinary review.</span>
          </span>
        </label>

        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
          <FieldLabel>Recorded location</FieldLabel>
          <p className="mt-1 text-[14px] font-semibold text-[var(--color-text-primary)]">{selectedRegion}</p>
        </div>
      </div>
    </div>
  );
}

function HorseModel({ selectedRegion, onRegionChange }: Pick<Injury3DViewerProps, 'selectedRegion' | 'onRegionChange'>) {
  return (
    <svg viewBox="0 0 620 300" className="h-auto w-full max-w-[720px] overflow-visible" role="img" aria-label="Interactive 3D horse injury viewer">
      <defs>
        <linearGradient id="horse-body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d9d4e7" />
          <stop offset="0.5" stopColor="#aaa2c6" />
          <stop offset="1" stopColor="#756c99" />
        </linearGradient>
        <linearGradient id="horse-highlight" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#a99cf0" />
          <stop offset="1" stopColor="#7061cf" />
        </linearGradient>
        <filter id="horse-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#312a4a" floodOpacity="0.16" />
        </filter>
      </defs>
      <ellipse cx="310" cy="260" rx="245" ry="14" fill="var(--color-border)" opacity="0.45" />
      <g filter="url(#horse-shadow)">
        <path d="M116 151c13-36 42-56 84-56h167c42 0 72 12 92 38l45 18c18 7 31 18 35 34l-14 9-47-11-37 23H183c-44 0-72-17-67-55Z" fill="url(#horse-body)" stroke="#6d658d" strokeWidth="2" />
        <path d="M445 129c24-4 47 3 62 17l31 9c17 5 27 14 29 25l-20 7-39-10-38 14-22-28Z" fill="url(#horse-body)" stroke="#6d658d" strokeWidth="2" />
        <path d="M514 155c16-13 30-31 35-50l14 4-2 18 18 8-18 13 17 12-22 8Z" fill="url(#horse-body)" stroke="#6d658d" strokeWidth="2" />
        <path d="M548 107 563 95l12 11-8 13" fill="none" stroke="#6d658d" strokeWidth="3" strokeLinecap="round" />
        <path d="M166 185 153 250h18l22-61M220 187l-4 66h18l17-66M393 185l-4 68h18l16-69M440 181l15 68h18l-3-75" fill="url(#horse-body)" stroke="#6d658d" strokeWidth="2" />
        <path d="M150 250h23l-2 9h-28c-3-3 1-7 7-9ZM216 253h20l3 7h-29c-2-3 0-6 6-7ZM389 253h19l3 7h-29c-2-3 1-6 7-7ZM454 249h20l7 9h-29c-2-3-1-6 2-9Z" fill="#595276" />
        <path d="M148 101c-14-21-9-44 7-58l14 8c-3 14 2 25 17 35l-3 19Z" fill="url(#horse-body)" stroke="#6d658d" strokeWidth="2" />
        <path d="M137 59 121 46l4 25 17 4M157 50l-3-22 15 18" fill="#8e86ad" stroke="#6d658d" strokeWidth="2" />
        <path d="M191 96c30-29 73-33 113-17" fill="none" stroke="#f0edf8" strokeOpacity="0.5" strokeWidth="5" />
        <circle cx="535" cy="112" r="3" fill="#312a4a" />
      </g>

      <Area region="Head" selectedRegion={selectedRegion} onSelect={onRegionChange}><ellipse cx="545" cy="111" rx="30" ry="25" /></Area>
      <Area region="Neck" selectedRegion={selectedRegion} onSelect={onRegionChange}><path d="M435 123c25-5 49 6 72 30l-21 27-43-13-21-28Z" /></Area>
      <Area region="Shoulder" selectedRegion={selectedRegion} onSelect={onRegionChange}><ellipse cx="206" cy="139" rx="43" ry="44" /></Area>
      <Area region="Chest" selectedRegion={selectedRegion} onSelect={onRegionChange}><ellipse cx="300" cy="139" rx="43" ry="41" /></Area>
      <Area region="Back" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="244" y="102" width="138" height="38" rx="17" /></Area>
      <Area region="Abdomen" selectedRegion={selectedRegion} onSelect={onRegionChange}><ellipse cx="325" cy="168" rx="72" ry="29" /></Area>
      <Area region="Left Front Leg" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="151" y="180" width="30" height="71" rx="12" /></Area>
      <Area region="Right Front Leg" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="215" y="182" width="28" height="72" rx="12" /></Area>
      <Area region="Left Hind Leg" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="388" y="180" width="30" height="73" rx="12" /></Area>
      <Area region="Right Hind Leg" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="438" y="178" width="31" height="75" rx="12" /></Area>
      <Area region="Left Front Hoof" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="143" y="246" width="34" height="18" rx="7" /></Area>
      <Area region="Right Front Hoof" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="211" y="249" width="35" height="17" rx="7" /></Area>
      <Area region="Left Hind Hoof" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="380" y="249" width="35" height="17" rx="7" /></Area>
      <Area region="Right Hind Hoof" selectedRegion={selectedRegion} onSelect={onRegionChange}><rect x="450" y="246" width="36" height="18" rx="7" /></Area>
    </svg>
  );
}

function Area({ region, selectedRegion, onSelect, children }: { region: AnatomicalRegion; selectedRegion: AnatomicalRegion; onSelect: (region: AnatomicalRegion) => void; children: ReactNode }) {
  const selected = region === selectedRegion;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Select ${region}`}
      aria-pressed={selected}
      onClick={() => onSelect(region)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(region);
        }
      }}
      fill={selected ? 'url(#horse-highlight)' : '#c2bbdb'}
      fillOpacity={selected ? 0.85 : 0.18}
      stroke={selected ? '#5f52bf' : '#8f87b1'}
      strokeWidth={selected ? 2.5 : 1}
      className="cursor-pointer transition-opacity hover:opacity-90 focus:outline-none"
    >
      {children}
    </g>
  );
}
