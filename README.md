# URL共有アプリ

URLをマークダウン形式で管理・共有できるWebアプリケーションです。

## 機能

- URLの追加・削除
- クリップボードからのURL直接追加
- マークダウン形式でのURL表示
- プレビュー機能
- マークダウンのクリップボードへのコピー
- ダークモード対応

## 技術スタック

- フロントエンド
  - Next.js
  - TypeScript
  - Tailwind CSS
  - React Markdown

- インフラ
  - Docker
  - Docker Compose

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd link-list-share-app
```

2. フロントエンドの依存関係のインストール
```bash
cd frontend
npm install
```

3. Dockerコンテナの起動
```bash
cd ..
docker-compose up -d
```

4. アプリケーションの起動
```bash
cd frontend
npm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## 開発環境

- Node.js 20.x
- npm 10.x
- Docker
- Docker Compose

## ディレクトリ構造

```
.
├── docker/
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── docker-compose.yml
└── README.md
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 