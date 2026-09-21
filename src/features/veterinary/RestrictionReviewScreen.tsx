import { useState } from 'react';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { MetricCard } from '../../components/MetricCard';
import { Panel, SectionTitle, FieldLabel } from '../../components/Panel';
import { DataTable, type Column } from '../../components/DataTable';
import { Pill } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { TrainingLockBanner } from '../../components/TrainingLockBanner';
import { EmptyState } from '../../components/states';
import { Icon } from '../../components/Icon';
import { HorseAvatar } from '../horses/HorseAvatar';
import { useRtms } from '../../app/RtmsContext';

interface RestrictionRow {
  id: string;
  name: string;
  image?: string;
  reason: string;
  reviewDate: string;
  veterinarian?: string;
}

/** Near date used to flag restrictions that are due for review. */
const REVIEW_HORIZON = '27 Sep 2026';

export function RestrictionReviewScreen() {
  const { horses, navigate, isLocked, getLock, unlockTraining, toast, can } = useRtms();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [confirmLift, setConfirmLift] = useState<string | undefined>();

  const rows: RestrictionRow[] = horses
    .filter((h) => isLocked(h.id))
    .map((h) => {
      const lock = getLock(h.id);
      return {
        id: h.id,
        name: h.name,
        image: h.image,
        reason: lock?.reason ?? 'Veterinary restriction',
        reviewDate: lock?.reviewDate ?? '—',
        veterinarian: lock?.veterinarian,
      };
    });

  const dueForReview = rows.filter((r) => r.reviewDate <= REVIEW_HORIZON).length;

  const selected = rows.find((r) => r.id === selectedId);

  const columns: Column<RestrictionRow>[] = [
    {
      key: 'horse',
      header: 'Horse',
      width: '220px',
      sortValue: (r) => r.name,
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('horses', { horseId: r.id });
          }}
          className="flex items-center gap-2.5 text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
        >
          <HorseAvatar name={r.name} image={r.image} size={30} />
          <span className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">{r.name}</span>
        </button>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      sortValue: (r) => r.reason,
      render: (r) => <span className="text-[13px] text-[var(--color-text-secondary)]">{r.reason}</span>,
    },
    {
      key: 'review',
      header: 'Review date',
      width: '140px',
      sortValue: (r) => r.reviewDate,
      render: (r) => <span className="font-metric text-[12px] text-[var(--color-text-secondary)]">{r.reviewDate}</span>,
    },
    {
      key: 'vet',
      header: 'Veterinarian',
      width: '160px',
      sortValue: (r) => r.veterinarian ?? '',
      render: (r) => <span className="text-[12px] text-[var(--color-text-muted)]">{r.veterinarian ?? 'Unassigned'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '160px',
      render: () => (
        <Pill tone="danger" size="sm" icon="lock">
          Active restriction
        </Pill>
      ),
    },
  ];

  return (
    <Screen
      title="Restriction review"
      context={
        <button onClick={() => navigate('veterinary')} className="inline-flex items-center gap-1 hover:underline">
          <Icon name="arrow-left" size={13} /> Back to stable health
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricCard label="Active restrictions" value={rows.length} unit="horses" icon="lock" tone={rows.length ? 'danger' : 'default'} />
        <MetricCard label="Due for review" value={dueForReview} unit="horses" icon="clock" tone={dueForReview ? 'warning' : 'default'} />
        <MetricCard label="Cleared" value={horses.length - rows.length} unit="horses" icon="check" tone="success" />
      </div>

      {rows.length === 0 ? (
        <Panel className="mt-4 p-0">
          <EmptyState
            icon="check"
            title="No active restrictions"
            description="Every horse is cleared for training. Restrictions applied from a medical record will appear here for review."
          />
        </Panel>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            selectedKey={selectedId}
            onRowClick={(r) => setSelectedId(r.id)}
          />

          <Panel padded className="self-start">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HorseAvatar name={selected.name} image={selected.image} size={44} rounded="md" />
                  <div className="min-w-0">
                    <button
                      onClick={() => navigate('horses', { horseId: selected.id })}
                      className="truncate text-[15px] font-semibold text-[var(--color-text-primary)] hover:underline"
                    >
                      {selected.name}
                    </button>
                    <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">Training restriction in force</p>
                  </div>
                </div>

                <TrainingLockBanner
                  reason={selected.reason}
                  reviewDate={selected.reviewDate}
                  veterinarian={selected.veterinarian}
                />

                <div className="space-y-2">
                  <div>
                    <FieldLabel>Reason</FieldLabel>
                    <p className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{selected.reason}</p>
                  </div>
                  <div>
                    <FieldLabel>Review date</FieldLabel>
                    <p className="font-metric mt-0.5 text-[13px] text-[var(--color-text-primary)]">{selected.reviewDate}</p>
                  </div>
                  <div>
                    <FieldLabel>Veterinarian</FieldLabel>
                    <p className="mt-0.5 text-[13px] text-[var(--color-text-primary)]">{selected.veterinarian ?? 'Unassigned'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="file-text"
                    onClick={() => navigate('veterinary', { view: 'record', horseId: selected.id })}
                  >
                    View medical record
                  </Button>
                  {can('medical.lock_training') && (
                    <Button variant="destructive" size="sm" icon="lock" onClick={() => setConfirmLift(selected.id)}>
                      Lift restriction
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6">
                <SectionTitle>Restriction detail</SectionTitle>
                <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">
                  Select a horse from the list to review its training restriction and take action.
                </p>
              </div>
            )}
          </Panel>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmLift}
        tone="danger"
        title="Lift training restriction?"
        description="This removes the training lock and allows scheduling to resume. The change propagates to the horse profile, training dashboard and plan immediately."
        confirmLabel="Lift restriction"
        onCancel={() => setConfirmLift(undefined)}
        onConfirm={() => {
          const id = confirmLift!;
          const name = horses.find((h) => h.id === id)?.name ?? 'Horse';
          unlockTraining(id);
          setConfirmLift(undefined);
          if (id === selectedId) setSelectedId(undefined);
          toast(`Training restriction lifted for ${name}`, 'success');
        }}
      />
    </Screen>
  );
}
