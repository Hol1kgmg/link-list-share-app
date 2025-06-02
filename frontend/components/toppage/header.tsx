export const Header = () => {
  return (
    <header className="flex flex-col items-center mb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          LLShare
        </h1>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Link List Share - URLマークダウン共有アプリ
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center">
        URLを登録して、マークダウン形式で管理しましょう
      </p>
    </header>
  );
}; 