// @ts-expect-error
import { useQuery } from '@tanstack/react-query';
import { OutputUrlData } from '@/lib/types';

export const useMetaData = (url: string) => {
  return useQuery<OutputUrlData>({
    queryKey: ['meta', url],
    queryFn: async () => {
      const response = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meta data');
      }
      return response.json();
    },
    enabled: !!url,
  });
}; 