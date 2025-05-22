interface MarkdownDisplayProps {
  isEmpty: boolean;
  urls: { id: string; url: string }[];
  onDelete: (id: string) => void;
}

export const MarkdownDisplay = ({ isEmpty, urls, onDelete }: MarkdownDisplayProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">マークダウン</h3>
      <div className="overflow-x-auto">
        {isEmpty ? (
          <p className="text-gray-500 dark:text-gray-400">登録されたURLはありません</p>
        ) : (
          <div className="space-y-2">
            {urls.map((url) => (
              <div key={url.id} className="flex items-center gap-2 group relative pr-8">
                <pre className="whitespace-pre-wrap break-all font-mono text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {`[${url.url}](${url.url})`}
                </pre>
                <button
                  onClick={() => onDelete(url.id)}
                  className="absolute right-0 hover:bg-red-100 dark:hover:bg-red-900 rounded p-1.5 transition-colors duration-200"
                  title="削除"
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DeleteIcon = () => (
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
    className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
); 