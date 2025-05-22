// 入力用のデータ型（フォームからAPIへのリクエスト用）
export interface InputUrlData {
  url: string;
}

// 出力用のデータ型（APIからのレスポンス用）
export interface OutputUrlData {
  id: string;        // APIで生成される一意のID
  url: string;       // 入力されたURL
  title: string | null;
}

// コンポーネントのProps型
export interface UrlListProps {
  urls: OutputUrlData[];  // 表示用のデータはOutputUrlData
  onReset: () => void;
  onDelete: (id: string) => void;
}

export interface MarkdownDisplayProps {
  isEmpty: boolean;
  urls: OutputUrlData[];
  onDelete: (id: string) => void;
}

export interface MarkdownPreviewProps {
  markdownText: string;
  isEmpty: boolean;
}

export type UrlFormProps = {
  onSubmit: (data: InputUrlData, title: string | null) => void;  // フォームの入力はInputUrlData
}; 

