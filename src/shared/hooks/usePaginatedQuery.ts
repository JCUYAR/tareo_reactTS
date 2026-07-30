import { useState, useEffect } from 'react';
import type { PaginatedResponse, TableState } from '../../presentation/table/table.types';

interface UsePaginatedQueryOptions<T> {
  fetcher: (state: TableState) => Promise<PaginatedResponse<T>>;
  initialState?: Partial<TableState>;
}

export function usePaginatedQuery<T>({
  fetcher,
  initialState,
}: UsePaginatedQueryOptions<T>) {
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    limit: 10,
    ...initialState,
  });

  const [response, setResponse] = useState<PaginatedResponse<T>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetcher(tableState)
      .then(setResponse)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [tableState]);

  return { response, isLoading, error, tableState, setTableState };
}