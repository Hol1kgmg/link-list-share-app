'use client';

import { useState } from 'react';
import Image from "next/image";
import { type InputUrlData, type OutputUrlData } from '@/lib/types';
import { UrlForm } from '@/components/toppage/url-form';
import { UrlList } from '@/components/toppage/url-list';

export default function TopPage() {
  const [urls, setUrls] = useState<OutputUrlData[]>([]);

  const handleSubmit = (data: InputUrlData) => {
    const newUrl: OutputUrlData = {
      id: crypto.randomUUID(),
      url: data.url,
      title: null, // 将来的にメタデータから取得予定
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
          <Image
            className="dark:invert mb-8"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            URL共有アプリ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            URLを登録して、マークダウン形式で管理しましょう
          </p>
        </header>

        <main className="flex flex-col items-center">
          <UrlForm onSubmit={handleSubmit} />
          <UrlList
            urls={urls}
            onReset={handleReset}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
} 