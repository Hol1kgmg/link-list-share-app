import Image from 'next/image';

export const Header = () => {
  return (
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
  );
}; 