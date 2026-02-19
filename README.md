# 練習・学習トラッカー

ピアノ練習または学習の実績を可視化するWebアプリ。記録した分数を日付ごとに登録し、月間カレンダーとGitHub風ヒートマップで振り返ることができます。

## 機能

- **2モード切り替え** - ヘッダーのトグルでピアノ練習モードと学習履歴モードを切り替え。データはモードごとに独立して管理
- **モード別カラーテーマ** - ピアノ練習はグリーン系、学習履歴はパープル系に自動切り替え
- **月間カレンダー** - 日ごとの記録時間を一覧表示。日付クリックで入力フォームに反映
- **年間ヒートマップ** - GitHub風の53週×7日グリッドで記録量を色の濃淡で表示
- **記録の登録・削除** - 日付と時間（分）を入力して保存
- **統計表示** - 記録日数・合計時間・平均時間
- **ブラウザ通知** - 当日の記録がない場合、指定した時刻にブラウザ通知（タブが開いている場合のみ）
- **データ永続化** - localStorage（オフライン）+ Supabase（ログイン時にクラウド同期）

## 技術スタック

- React 19 + Vite
- Plain CSS（外部UIライブラリなし）
- localStorage / Supabase によるデータ管理
- Web Notifications API

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
├── App.jsx                           # 状態管理・コンポーネント統合
├── App.css                           # CSS変数・テーマ定義（モード別）
├── index.css                         # リセットCSS
├── hooks/
│   ├── usePracticeData.js            # データ読み書きフック（モード対応）
│   └── useNotification.js            # ブラウザ通知フック
├── utils/
│   ├── date.js                       # 日付ヘルパー関数
│   └── color.js                      # ヒートマップ色スケール
└── components/
    ├── Header.jsx                    # タイトル + モード切替 + ビュー切替タブ
    ├── PracticeForm.jsx              # 日付・分数入力フォーム
    ├── MonthlyCalendar.jsx           # 月間カレンダーグリッド
    ├── MonthNavigator.jsx            # 月ナビゲーション
    ├── YearlyHeatmap.jsx             # 年間ヒートマップ
    ├── YearNavigator.jsx             # 年ナビゲーション
    ├── Stats.jsx                     # 統計
    ├── NotificationSettings.jsx      # 通知設定モーダル
    └── AuthButton.jsx                # Google ログイン/ログアウト
```

## モード切り替えについて

ヘッダーの「ピアノ練習 / 学習履歴」トグルでモードを切り替えられます。

- **ピアノ練習モード**: グリーン系テーマ。localStorage キー `practice-data-piano`
- **学習履歴モード**: パープル系テーマ。localStorage キー `practice-data-study`

モードはページリロード後も保持されます。データはモードごとに完全に独立しています。

Supabase 利用時は `tracker_type` カラムでモードごとにデータを分離します。

## 通知機能

ヘッダー右上の「通知」ボタンから設定できます。

1. 「通知を許可する」でブラウザの通知権限を付与
2. トグルで通知を有効化し、通知時刻を設定
3. 当日の記録がない場合、設定した時刻にブラウザ通知が届く

> タブが開いている場合のみ動作します（Service Worker 未使用）。

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

- localStorage は端末・ブラウザごとに独立しているため、データは端末間で共有されません（Supabase ログイン時を除く）

## データ形式

### localStorage

モードごとに別キーで保存されます。

| キー | 内容 |
|-----|------|
| `practice-data-piano` | ピアノ練習の記録 |
| `practice-data-study` | 学習履歴の記録 |
| `tracker-mode` | 現在のモード (`piano` / `study`) |
| `notification-settings` | 通知設定 |

```json
{
  "2026-02-01": { "minutes": 30, "comment": "ソナタ練習" },
  "2026-02-03": { "minutes": 45, "comment": "" }
}
```

### Supabase テーブル (`practice_entries`)

| カラム | 型 | 説明 |
|-------|-----|------|
| `user_id` | UUID | ユーザーID |
| `practice_date` | DATE | 記録日 |
| `minutes` | SMALLINT | 記録時間（分） |
| `comment` | TEXT | コメント |
| `tracker_type` | TEXT | モード (`piano` / `study`) |

UNIQUE 制約: `(user_id, practice_date, tracker_type)`
