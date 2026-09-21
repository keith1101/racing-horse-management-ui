import { useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  selectedKey?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  empty?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectedKey,
  onRowClick,
  loading = false,
  empty,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);

  const sorted = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  })();

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }

  return (
    <div className="scroll-slim overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[var(--color-surface-subtle)]">
          <tr className="border-b border-[var(--color-border)]">
            {columns.map((col) => {
              const sortable = !!col.sortValue;
              const activeSort = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center gap-1 outline-none hover:text-[var(--color-text-primary)] focus-visible:text-[var(--color-text-primary)] ${
                        col.align === 'right' ? 'flex-row-reverse' : ''
                      } ${activeSort ? 'text-[var(--color-text-primary)]' : ''}`}
                    >
                      {col.header}
                      <Icon
                        name="chevron-down"
                        size={12}
                        className={`transition-transform ${
                          activeSort && sort?.dir === 'asc' ? 'rotate-180' : ''
                        } ${activeSort ? 'opacity-100' : 'opacity-30'}`}
                      />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--color-border)]">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-3">
                    <div className="h-3.5 w-full max-w-[120px] animate-pulse rounded bg-[var(--color-surface-muted)]" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          )}

          {!loading &&
            sorted.map((row) => {
              const key = rowKey(row);
              const selected = key === selectedKey;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  className={
                    'border-b border-[var(--color-border)] outline-none transition-colors ' +
                    (onRowClick ? 'cursor-pointer ' : '') +
                    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)] ' +
                    (selected
                      ? 'bg-[var(--color-primary-subtle)]'
                      : 'hover:bg-[var(--color-surface-subtle)]')
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 align-middle text-[13px] text-[var(--color-text-primary)] ${
                        col.align === 'right' ? 'text-right' : ''
                      } ${col.className ?? ''}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
