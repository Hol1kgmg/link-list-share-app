import { useQuery } from '@tanstack/react-query';
import { OutputUrlData } from '@/lib/types';

const useMetaData = (url: string) => {
  const { data, error, refetch, isLoading, isFetching } = useQuery<OutputUrlData>({
    queryKey: ['meta', url],
    queryFn: async () => {
      const result = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
      const json = await result.json();
      if (!result.ok) {
        // サーバーからのエラーメッセージがあればそれを投げる
        throw new Error(json.error || 'Failed to fetch meta data');
      }
      return json;
    },
    enabled: !!url,
  });

  return { data, error, refetch, isLoading, isFetching };
}; 

export default useMetaData;