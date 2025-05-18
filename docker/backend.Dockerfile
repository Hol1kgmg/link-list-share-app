FROM golang:1.21-alpine

WORKDIR /app

# 必要なパッケージのインストール
RUN apk add --no-cache git

# 依存関係のコピーとダウンロード
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# ソースコードのコピー
COPY backend/ .

# アプリケーションのビルドと実行権限の設定
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main main.go && \
    chmod +x /app/main && \
    ls -la /app/main

EXPOSE 8080

# 実行
ENTRYPOINT ["/app/main"] 