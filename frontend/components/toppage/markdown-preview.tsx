import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  markdownText: string;
  isEmpty: boolean;
}

export const MarkdownPreview = ({ markdownText, isEmpty }: MarkdownPreviewProps) => {
  const previewContent = isEmpty ? (
    <p className="text-gray-500 dark:text-gray-400">登録されたURLはありません</p>
  ) : (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          />
        ),
      }}
    >
      {markdownText}
    </ReactMarkdown>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">プレビュー</h3>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {previewContent}
      </div>
    </div>
  );
}; 