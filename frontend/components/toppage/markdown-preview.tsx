import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  markdownText: string;
  isEmpty: boolean;
}

export const MarkdownPreview = ({ markdownText, isEmpty }: MarkdownPreviewProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">プレビュー</h3>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {isEmpty ? (
          <p className="text-gray-500 dark:text-gray-400">登録されたURLはありません</p>
        ) : (
          <ReactMarkdown>{markdownText}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}; 