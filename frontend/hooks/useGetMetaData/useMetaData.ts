import { useQuery } from '@tanstack/react-query';
import { OutputUrlData } from '@/lib/types';

const useMetaData = (url: string) => {
  const { data, error, refetch } = useQuery<OutputUrlData>({
    queryKey: ['meta', url],
    queryFn: async () => {
      const result = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
      if (!result.ok) {
        throw new Error('Failed to fetch meta data');
      }
      const json = await result.json();
      return json;
    },
    enabled: !!url,
  });

  return { data, error, refetch };
}; 

export default useMetaData;