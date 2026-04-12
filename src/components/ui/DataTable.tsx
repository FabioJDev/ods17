import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Inbox } from 'lucide-react';

interface Column<T> { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode; sortable?: boolean; }
interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

export default function DataTable<T extends { id: string }>({ columns, data, pageSize = 10 }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as any)[sortKey], bv = (b as any)[sortKey];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const rows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(0);
  };

  return (
    <div>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  style={{
                    padding: '14px 18px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: col.sortable ? 'none' : 'auto',
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px 18px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Inbox size={36} style={{ color: '#d1d5db' }} />
                    <p style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>No se encontraron resultados</p>
                  </div>
                </td>
              </tr>
            ) : rows.map((row, idx) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f7ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafbfc'; }}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} style={{
                    padding: '14px 18px',
                    color: '#374151',
                    whiteSpace: 'nowrap',
                  }}>
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          padding: '0 4px',
        }}>
          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} de {sorted.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.1s',
              }}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} color="#6b7280" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages - 1 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.1s',
              }}
              aria-label="Página siguiente"
            >
              <ChevronRight size={16} color="#6b7280" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
