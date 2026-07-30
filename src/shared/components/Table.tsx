import React from 'react';
import type { ColumnDef, PaginatedResponse, TableState } from '../../presentation/table/table.types';

interface DataTableProps<T extends object> {
  columns: ColumnDef<T>[];
  response: PaginatedResponse<T> | undefined;
  isLoading?: boolean;
  tableState: TableState;
  onTableStateChange: (state: TableState) => void;
}

export function TableComponent<T extends object>({
  columns,
  response,
  isLoading,
  tableState,
  onTableStateChange,
}: DataTableProps<T>) {
  const { page, limit, sortBy, sortOrder } = tableState;
  const totalPages = response?.totalPages ?? 1;

  const handleSort = (key: string) => {
    onTableStateChange({
      ...tableState,
      sortBy: key,
      sortOrder: sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    });
  };

  const handlePage = (newPage: number) => {
    onTableStateChange({ ...tableState, page: newPage });
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && handleSort(String(col.key))}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.header}
                {col.sortable && (
                  <span>
                    {sortBy === String(col.key)
                      ? sortOrder === 'asc' ? ' ↑' : ' ↓'
                      : ' ↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length}>Cargando...</td>
            </tr>
          ) : response?.data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>Sin resultados</td>
            </tr>
          ) : (
            response?.data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <span>
          {response
            ? `Mostrando ${(page - 1) * limit + 1}–${Math.min(page * limit, response.total)} de ${response.total}`
            : ''}
        </span>
        <div>
          <button onClick={() => handlePage(page - 1)} disabled={page <= 1}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={p === page ? 'active' : ''}
            >
              {p}
            </button>
          ))}
          <button onClick={() => handlePage(page + 1)} disabled={page >= totalPages}>›</button>
        </div>
      </div>
    </div>
  );
}