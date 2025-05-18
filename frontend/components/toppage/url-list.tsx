import { type OutputUrlData, type UrlListProps } from '@/lib/types';
import { useState } from 'react';
import { MarkdownDisplay } from './markdown-display';
import { MarkdownPreview } from './markdown-preview';

export const UrlList = ({ urls, onReset, onDelete }: UrlListProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatUrlToMarkdown = (url: OutputUrlData) => {
    return `- [${url.url}](${url.url})`;
  };

  const markdownText = urls.map(formatUrlToMarkdown).join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">保存したURL</h2>
        {urls.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {copySuccess ? (
                <>
                  <CopyCheckIcon />
                  <span className="relative">
                    コピー完了
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <CopyIcon />
                  マークダウンをコピー
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <TrashIcon />
              リセット
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MarkdownDisplay
          isEmpty={urls.length === 0}
          urls={urls}
          onDelete={onDelete}
        />
        <MarkdownPreview
          markdownText={markdownText}
          isEmpty={urls.length === 0}
        />
      </div>
    </div>
  );
};

// コピーアイコンコンポーネント
const CopyIcon = () => (
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

// コピー完了アイコンコンポーネント
const CopyCheckIcon = () => (
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
    className="text-green-500"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const TrashIcon = () => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
); 