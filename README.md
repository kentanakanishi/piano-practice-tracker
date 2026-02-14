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

## データ形式

localStorageの `piano-practice-data` キーにJSON形式で保存されます。

```json
{
  "2026-02-01": 30,
  "2026-02-03": 45,
  "2026-02-10": 60
}
```
