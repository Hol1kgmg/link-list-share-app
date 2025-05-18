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
  - Vercel (本番環境)

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

3. 開発サーバーの起動（以下のいずれかを選択）

### Dockerを使用する場合
```bash
cd ..
docker-compose up -d
```

### ローカルで直接起動する場合
```bash
cd frontend
npm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成し、ログインします。

2. 新しいプロジェクトを作成：
   - GitHubリポジトリを連携
   - `link-list-share-app`リポジトリを選択
   - フレームワークプリセットは`Next.js`を選択

3. 環境設定：
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. "Deploy"ボタンをクリックしてデプロイを開始

デプロイが完了すると、Vercelによって生成されたURLでアプリケーションにアクセスできます。

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
├── vercel.json
└── README.md
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 