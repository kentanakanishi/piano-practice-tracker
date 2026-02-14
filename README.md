# ピアノ練習トラッカー

ピアノの練習実績を可視化するWebアプリ。練習した分数を日付ごとに登録し、月間カレンダーとGitHub風ヒートマップで振り返ることができます。

## 機能

- **月間カレンダー** - 日ごとの練習時間を一覧表示。日付クリックで入力フォームに反映
- **年間ヒートマップ** - GitHub風の53週×7日グリッドで練習量を色の濃淡で表示
- **練習記録の登録・削除** - 日付と練習時間（分）を入力して保存
- **統計表示** - 練習日数・合計時間・平均練習時間
- **データ永続化** - ブラウザのlocalStorageに保存（バックエンド不要）

## 技術スタック

- React 19 + Vite
- Plain CSS（外部UIライブラリなし）
- localStorage によるデータ管理

## セットアップ

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます。

## プロジェクト構成

```
src/
├── App.jsx                    # 状態管理・コンポーネント統合
├── App.css                    # CSS変数・テーマ定義
├── index.css                  # リセットCSS
├── hooks/
│   └── usePracticeData.js     # localStorage読み書きフック
├── utils/
│   ├── date.js                # 日付ヘルパー関数
│   └── color.js               # ヒートマップ色スケール
└── components/
    ├── Header.jsx             # タイトル + ビュー切替タブ
    ├── PracticeForm.jsx       # 日付・分数入力フォーム
    ├── MonthlyCalendar.jsx    # 月間カレンダーグリッド
    ├── MonthNavigator.jsx     # 月ナビゲーション
    ├── YearlyHeatmap.jsx      # 年間ヒートマップ
    ├── YearNavigator.jsx      # 年ナビゲーション
    └── Stats.jsx              # 練習統計
```

## GitHub Pages へのデプロイ

このアプリは GitHub Pages で公開できます。以下はゼロから公開するまでの手順です。

### 1. Vite のベースパス設定

GitHub Pages の URL は `https://<ユーザー名>.github.io/<リポジトリ名>/` になるため、`vite.config.js` に `base` を追加してパスを合わせる必要があります。

```js
export default defineConfig({
  plugins: [react()],
  base: '/<リポジトリ名>/',
})
```

### 2. GitHub Actions ワークフローの作成

`.github/workflows/deploy.yml` を作成します。main ブランチに push すると自動でビルド→デプロイが実行されます。

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 3. リポジトリを Public にする

無料プランでは Private リポジトリで GitHub Pages は使えないため、Public に変更します。

```bash
gh repo edit <ユーザー名>/<リポジトリ名> --visibility public
```

### 4. GitHub Pages を有効化する

GitHub Pages の配信元を GitHub Actions に設定します。

```bash
gh api -X POST repos/<ユーザー名>/<リポジトリ名>/pages \
  -f "build_type=workflow" \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

> GitHub の Web UI からも設定可能です: リポジトリの Settings → Pages → Source を「GitHub Actions」に変更。

### 5. push して自動デプロイ

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

push 後、GitHub Actions が自動実行され、数十秒でサイトが公開されます。以降はコードを修正して push するだけで自動更新されます。

### 注意事項

- localStorage は端末・ブラウザごとに独立しているため、練習データは端末間で共有されません

## データ形式

localStorageの `piano-practice-data` キーにJSON形式で保存されます。

```json
{
  "2026-02-01": 30,
  "2026-02-03": 45,
  "2026-02-10": 60
}
```
