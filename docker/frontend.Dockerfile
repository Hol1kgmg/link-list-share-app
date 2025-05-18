FROM node:20-alpine

WORKDIR /app

# 依存関係のインストール
COPY frontend/package*.json ./
RUN npm install

# ソースコードのコピー
COPY frontend/ .

# 開発サーバーの起動
EXPOSE 3000
CMD ["npm", "run", "dev"] 