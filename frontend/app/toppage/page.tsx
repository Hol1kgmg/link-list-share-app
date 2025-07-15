'use client';

import { useState } from 'react';
import { type InputUrlData, type OutputUrlData } from '@/lib/types';
import { UrlForm } from '@/components/toppage/url-form';
import { UrlList } from '@/components/toppage/url-list';

export default function TopPage() {
  const [urls, setUrls] = useState<OutputUrlData[]>([]);

  const handleSubmit = (data: InputUrlData, title:string | null) => {
    console.log('URL submitted:', data);
    const newUrl: OutputUrlData = {
      id: crypto.randomUUID(),
      url: data.url,
      title: (title === null) ? data.url : title,
    };
    setUrls([...urls, newUrl]);
  };

  const handleReset = () => {
    setUrls([]);
  };

  const handleDelete = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col items-center mb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              LLShare
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            LLShare(Link List Share) - URLマークダウン共有アプリ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            URLを登録して、マークダウン形式で管理しましょう
          </p>
        </header>

        <main className="flex flex-col items-center">
          <UrlForm onSubmit={handleSubmit} />
          <UrlList
            urls={urls}
            setUrls={setUrls}
            onReset={handleReset}
            onDelete={handleDelete}
          />
        </main>
        </div>
    </div>
  );
} 