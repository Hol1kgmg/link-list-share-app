import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type OutputUrlData } from '@/lib/types';

interface MarkdownDisplayProps {
  isEmpty: boolean;
  urls: OutputUrlData[];
  onDelete: (id: string) => void;
}

interface SortableItemProps {
  id: string;
  url: OutputUrlData;
  onDelete: (id: string) => void;
}

const SortableItem = ({ id, url, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform && {
      ...transform,
      x: 0, // X軸の移動を0に固定して横方向の動きを制限
    }),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 group relative pr-8"
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        {...attributes}
        {...listeners}
      >
        <DragIcon />
      </button>
      <pre className="whitespace-pre-wrap break-all font-mono text-sm text-gray-700 dark:text-gray-300 flex-1">
        {`[${url.title}](${url.url})`}
      </pre>
      <button
        onClick={() => onDelete(url.id)}
        className="absolute right-0 hover:bg-red-100 dark:hover:bg-red-900 rounded p-1.5 transition-colors duration-200"
        title="削除"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

export const MarkdownDisplay = ({ isEmpty, urls, onDelete }: MarkdownDisplayProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">マークダウン</h3>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        {isEmpty ? (
          <p className="text-gray-500 dark:text-gray-400">登録されたURLはありません</p>
        ) : (
          <div className="space-y-2 relative">
            {urls.map((url) => (
              <SortableItem
                key={url.id}
                id={url.id}
                url={url}
                onDelete={onDelete}
              />
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

const DragIcon = () => (
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
    className="text-gray-400"
  >
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
); 