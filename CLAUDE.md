# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LLShare (Link List Share)** - URLマークダウン共有アプリ

LLShareは、URLを簡単に登録・管理し、マークダウン形式で共有できるWebアプリケーションです。

### Key Features
- **高度なメタデータ取得**：複数のエンコーディングと動画プラットフォームに対応
  - 日本語サイト対応（Shift_JIS、UTF-8自動検出）
  - YouTube oEmbed API統合（動的タイトル取得）
  - 標準HTMLメタタグ（og:title、twitter:title、title）
- **ドラッグ&ドロップ**：リスト並び替え機能
- **マークダウンエクスポート**：構造化されたマークダウン形式
- **レスポンシブデザイン**：デスクトップ・モバイル対応
- **リアルタイムプレビュー**：即座にタイトル表示

## Development Commands

### Frontend (Next.js)
```bash
# Development
cd frontend && npm run dev     # Start development server on port 3000
cd frontend && npm run build   # Build for production
cd frontend && npm run start   # Start production server
cd frontend && npm run lint    # Run ESLint

# Docker development
docker-compose up -d           # Start both frontend and backend containers
docker-compose logs -f         # View logs
docker-compose down           # Stop containers
```

### Backend (Go/Gin)
```bash
# Development (from backend directory)
go run main.go                # Start server on port 8080
go mod download              # Install dependencies
go build                     # Build binary
```

## Architecture Overview

### Frontend Architecture
- **Next.js 15.3.2** with App Router pattern
- **Client-side state management** using React hooks (useState)
- **Edge runtime API route** at `/api/meta` for metadata fetching
- **React Query** for API data fetching with caching
- **TypeScript** with strict type definitions in `lib/types.ts`

Key patterns:
- URL metadata fetching is handled through Next.js API route, not the Go backend
- Component structure follows container/presentation pattern
- All URL data is stored in React state (no persistence)
- Markdown conversion happens client-side

### Backend Architecture
- **Go 1.21** with **Gin** framework
- Currently minimal implementation (only ping endpoint)
- Scaffolded MVC structure ready for expansion:
  - `controllers/` - Request handlers
  - `models/` - Data structures
  - `routers/` - Route definitions
  - `views/` - Response formatting

### Data Flow
1. User inputs URL → Frontend validates → Calls `/api/meta` 
2. API route determines URL type:
   - **YouTube URLs**: Uses oEmbed API for dynamic title fetching
   - **Other URLs**: Fetches HTML with encoding detection
3. Title extraction with appropriate method
4. Frontend stores URL+title in React state
5. User can export as Markdown or delete entries

### Advanced Metadata Extraction System

#### Multi-Platform Support
- **YouTube Integration**: oEmbed API for accurate video titles
  - Supports: youtube.com, youtu.be, m.youtube.com, music.youtube.com
  - Handles: Standard URLs, short URLs, share parameters
  - Fallback: "YouTube Video" for invalid/private videos
- **Japanese Site Support**: Encoding detection for proper title display
  - Auto-detects: Shift_JIS, UTF-8 from Content-Type headers
  - Site-specific mapping: ITmedia, Nikkei, Sankei, Mainichi, Yomiuri, Asahi
  - Fallback: UTF-8 decoding for unknown encodings

#### Standard HTML Processing
- **Priority order**: og:title → twitter:title → page title
- **Bot protection**: Detects "Attention Required!" responses
- **Error handling**: Graceful degradation with URL as fallback
- **Performance**: 5-second timeout for all requests

#### Technical Implementation
- **Edge Runtime**: Next.js Edge Runtime for global performance
- **Caching**: 1-hour cache with stale-while-revalidate
- **TextDecoder**: Proper character encoding handling
- **AbortSignal**: Request timeout management

## Environment Configuration
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8080`
- Docker sets `NEXT_PUBLIC_API_URL=http://backend:8080` (not currently used)
- Vercel deployment configured with security headers

## Important Notes
- Backend is containerized but not integrated with frontend functionality
- All features currently work without the Go backend running
- No data persistence - refreshing the page clears all URLs
- The app is designed for future backend integration for data storage

## Git Branch Naming Convention

Branch names should follow this format:

`<type>/#<issue-number>_<description>`

### Branch Types
- `feat/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions or modifications
- `chore/` - Build process or tooling changes

### Examples
- `feat/#6_sort_link-list` - Issue #6: Add link-list sorting functionality
- `fix/#7_markdown_preview_title` - Issue #7: Fix markdown preview title display
- `refactor/#10_optimize_api_calls` - Issue #10: Optimize API calls
- `chore/#15_update_dependencies` - Issue #15: Update project dependencies

### Guidelines
- Use lowercase letters only
- Separate words with hyphens (_)
- Always include issue number when available
- Keep descriptions concise and meaningful

## Pull Request (PR) Guidelines

### Issue Number Format in PR Descriptions
When referencing issues in PR descriptions, use the following format:

**Correct format**: `issue #<number> <description>`
- ✅ `issue #12 の対応として、ITmediaなどの日本語サイトでメタタイトルが文字化けする問題を解決`
- ✅ `issue #8 の対応として、アプリ名をLLShareに変更`

**Incorrect format**: `issue#<number>` (missing space)
- ❌ `issue#12の対応として...`
- ❌ `issue#8の対応として...`

### PR Description Template
```markdown
## Summary
- issue #<number> の対応として、[問題の説明]
- [実装した機能や変更の概要]

## 実装内容
- [変更点1]
- [変更点2]
- [変更点3]

## テスト結果
- ✅ [テストケース1]: [結果]
- ✅ [テストケース2]: [結果]

## Test plan
- [ ] [テスト項目1]
- [ ] [テスト項目2]
```

### Important Notes
- Always include the issue number with a space after the hash symbol
- Use Japanese for descriptions when appropriate
- Include test results and test plans
- Reference specific technical changes made