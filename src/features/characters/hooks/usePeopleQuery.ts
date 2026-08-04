import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPeople } from '../../../api/people';

export function usePeopleQuery(page: number) {
  return useQuery({
    queryKey: ['people', page],
    queryFn: () => fetchPeople(page),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: 1,
  });
}
