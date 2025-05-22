import { useEffect, useState } from 'react';
import { type UrlFormProps } from '@/lib/types';
import useMetaData from '@/hooks/useGetMetaData';

export const UrlForm = ({ onSubmit }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGetRequest, setIsGetRequest] = useState(false); // 
  const [showLoading, setShowLoading] = useState(false);

  const { refetch, error, isLoading, isFetching } = useMetaData(isGetRequest ? url : ''); // URLが空の場合はリクエストしない

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      setErrorMessage('有効なURLを入力してください');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsGetRequest(true);
  };


  const handlePaste = async () => {
    try {
      setErrorMessage('');
      const text = await navigator.clipboard.readText();
      if (!validateUrl(text)) {
        // validateUrl内でエラーメッセージがセットされる
        return;
      }
      setUrl(text);
      setIsGetRequest(true);
    } catch (err) {
      console.error('クリップボードからの読み取りに失敗しました:', err);
      setErrorMessage('クリップボードからの読み取りに失敗しました');
    }
  };

  // URLのメタデータ所得用useEffect
  useEffect(() => {
    if (!isGetRequest) return;

    const fetchMeta = async () => {
      // jsonデータを受け取ってからrefetchより下の処理を実行
      const { data: fetchedData } = await refetch();

      const trimmedUrl = url.trim();
      if (trimmedUrl && validateUrl(trimmedUrl)) {
        onSubmit({ url: trimmedUrl }, fetchedData?.title || null);
        setUrl('');
      }
      setIsGetRequest(false);
    };

    fetchMeta();
  }, [url, isGetRequest]);

  // 1秒以上ロードが続いた場合のみローディング表示
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLoading || isFetching) {
      timer = setTimeout(() => setShowLoading(true), 2000);
    } else {
      setShowLoading(false);
      if (timer) clearTimeout(timer);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, isFetching]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setErrorMessage('');
              }}
              placeholder="URLを入力してください"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 ${
                errorMessage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="クリップボードから貼り付けて追加"
            >
              <ClipboardIcon />
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <PlusIcon />
            追加
          </button>
        </div>
        <div className="min-h-[28px] flex items-center gap-2 text-sm">
          {showLoading ? (
            <>
              <SpinnerIcon />
              <span className="text-blue-500">HTMLのメタデータ取得中...</span>
            </>
          ) : error || errorMessage ? (
            <span className="text-red-500">
              {error ? 'メタデータの取得に失敗しました' : errorMessage}
            </span>
          ) : (
            // 空の要素で高さを維持
            <span>&nbsp;</span>
          )}
        </div>
      </div>
    </form>
  );
};

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M4 12h16" />
    <path d="M12 4v16" />
  </svg>
);