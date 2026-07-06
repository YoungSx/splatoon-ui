# Splatoon UI

Splatoon のビジュアル言語に着想を得た React コンポーネントライブラリです。ファン制作のサイトやコミュニティページで使いやすい UI パーツを提供します。

> **本プロジェクトは Nintendo とは一切関係ありません。** Splatoon は Nintendo の登録商標です。本プロジェクトはファンメイドであり、非営利のファンコミュニティ用途を想定しています。権利上の問題がある場合はご連絡ください。速やかに対応します。

**[中文版 (Chinese Version)](./README_ZH.md) | [English Version](./README.md)**

## 概要

Splatoon UI は、Splatoon シリーズらしい鮮やかな配色、高いコントラスト、インク感のある表現を React コンポーネントとして整理した UI ライブラリです。ファンサイト、Wiki、大会ページ、コミュニティ向けページなどを、Splatoon 風のトーンで素早く組み立てられます。

**主な特徴:**

- インクが垂れるようなアニメーション付きボタン
- 破れ紙、テープ、ホチキス留め風のカードシステム
- WebGL によるインクスプラッシュ遷移
- 振り子モデルを使った物理ベースのカードスタックカルーセル
- 12 種類のインクスプラット装飾コンポーネント
- Retina 対応の迷彩・パターン背景テクスチャ
- `prefers-reduced-motion` と WCAG AA コントラストを意識したアクセシビリティ対応

## クイックスタート

### npm パッケージとして使う

```bash
npm install splatoon-ui
```

アプリのエントリーポイントでグローバルスタイルを一度だけ読み込みます。

```tsx
import 'splatoon-ui/styles.css'
```

サーバーセーフな基本コンポーネントはデフォルトエントリーから、公開 API 全体はコンポーネントごとのサブパスから読み込みます。

```tsx
import { Alert, Badge, Input } from 'splatoon-ui'
import { Button } from 'splatoon-ui/button'
import { Dialog } from 'splatoon-ui/dialog'
```

ドキュメント: https://dev-ui.s8p.io/ja/docs。

Splatoon UI のスタイルは `/_images`、`/fonts`、`/svgs` 配下の静的アセットを参照します。デプロイ前に、パッケージ内の `public/_images`、`public/fonts`、`public/svgs` をアプリ側の public ルートへコピーしてください。

`styles.css` は Tailwind CSS v4 のエントリーファイルです。利用側のアプリには、npm パッケージ内の CSS import を処理できる通常の Tailwind v4/PostCSS 環境が必要です。

### デモをローカルで動かす

```bash
# リポジトリを取得
git clone https://github.com/YoungSx/splatoon-ui.git
cd splatoon-ui

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

http://localhost:4317 を開くとデモを確認できます。

## 技術スタック

| レイヤー             | 技術                                      |
| -------------------- | ----------------------------------------- |
| フレームワーク       | Next.js 16 (App Router + Turbopack)       |
| UI 基盤              | shadcn/ui + Base UI                       |
| スタイリング         | Tailwind CSS v4                           |
| アニメーション       | framer-motion + CSS transitions/keyframes |
| WebGL                | カスタムのインクスプラッシュシェーダー    |
| アイコン             | lucide-react                              |
| 言語                 | TypeScript (strict mode)                  |
| パッケージマネージャ | pnpm                                      |

## 公開 API

以下の公開コンポーネントは、それぞれ package subpath、生成 API リファレンス、ドキュメント例を持ちます。ルート `splatoon-ui` エントリーは server-safe に保ち、クライアントコンポーネントやより広い API は subpath import を使います。

| インポート                      | 主な export                                                             | 用途                                                       |
| ------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| `splatoon-ui/alert`             | `Alert`                                                                 | 破れ紙風のステータス・フィードバック面。                   |
| `splatoon-ui/badge`             | `Badge`                                                                 | 固定配色を持つ斜めラベルバッジ。                           |
| `splatoon-ui/button`            | `Button`                                                                | drip と arrow 表現を持つインク風アクションボタン。         |
| `splatoon-ui/button-group`      | `ButtonGroup`, `ButtonGroupItem`                                        | コンパクトなアクションボタングループ。                     |
| `splatoon-ui/icon-button`       | `IconButton`                                                            | 円形のアイコン専用操作とカルーセル矢印。                   |
| `splatoon-ui/wave-button`       | `WaveButton`                                                            | ネイティブなライン表示を持つ blob 型グラフィックトリガー。 |
| `splatoon-ui/card`              | `Card`                                                                  | 汎用カードサーフェス。                                     |
| `splatoon-ui/staple-card`       | `StapleCard`                                                            | ホチキス留め紙端とメディアを持つフィードカード。           |
| `splatoon-ui/torn-card`         | `TornCard`                                                              | 破れ紙風のコンテンツカード。                               |
| `splatoon-ui/rugged-card`       | `RuggedCard`                                                            | ラフな吊り下げラベル風カード。                             |
| `splatoon-ui/carousel`          | `Carousel`, `FeedCarousel`, `MarqueeCarousel`, `WeaponsGalleryCarousel` | カルーセル基礎部品と本番向け gallery プリセット。          |
| `splatoon-ui/checkbox`          | `Checkbox`                                                              | インク風チェックボックス。                                 |
| `splatoon-ui/dialog`            | `Dialog`                                                                | Base UI ベースのダイアログラッパー。                       |
| `splatoon-ui/input`             | `Input`                                                                 | テキスト入力プリミティブ。                                 |
| `splatoon-ui/label`             | `Label`                                                                 | フォームラベルプリミティブ。                               |
| `splatoon-ui/loader`            | `Loader`                                                                | squid と morph のローディング表示。                        |
| `splatoon-ui/radio-group`       | `RadioGroup`, `RadioGroupItem`                                          | ラジオ選択グループ。                                       |
| `splatoon-ui/progress`          | `Progress`                                                              | インク風の進捗インジケーター。                             |
| `splatoon-ui/select`            | `Select`                                                                | select の trigger、content、item、value 部品。             |
| `splatoon-ui/segmented-control` | `SegmentedControl`                                                      | セグメント切り替えコントロール。                           |
| `splatoon-ui/popover`           | `Popover`                                                               | フローティング内容とトリガー部品。                         |
| `splatoon-ui/sheet`             | `Sheet`                                                                 | サイド sheet オーバーレイとトリガー部品。                  |
| `splatoon-ui/switch`            | `Switch`                                                                | 二値スイッチ。                                             |
| `splatoon-ui/tabs`              | `Tabs`                                                                  | インク風のアクティブ状態を持つタブナビゲーション。         |
| `splatoon-ui/list`              | `List`, `ListItem`                                                      | リスト表示プリミティブ。                                   |
| `splatoon-ui/section`           | `Section`                                                               | パターン背景付きのセクションラッパー。                     |
| `splatoon-ui/banner-divider`    | `BannerDivider`                                                         | レイヤー化された banner 区切り装飾。                       |
| `splatoon-ui/dotted-divider`    | `DottedDivider`                                                         | 横・縦の点線区切り。                                       |
| `splatoon-ui/splatoon-title`    | `SplatoonTitle`                                                         | ディスプレイ用タイトル表現。                               |
| `splatoon-ui/heading-tape`      | `HeadingTape`                                                           | テープ背景付き見出し。                                     |
| `splatoon-ui/tape-title`        | `TapeTitle`                                                             | コンパクトなテープタイトル。                               |
| `splatoon-ui/tape`              | `Tape`, `Staple`                                                        | 配置可能なテープとホチキス留め装飾。                       |
| `splatoon-ui/wave-canvas`       | `WaveCanvas`                                                            | セクション境界向けのアニメーション canvas 波形。           |

## デザインシステム

### カラー

| 名前        | 値        | 用途                |
| ----------- | --------- | ------------------- |
| Neon Yellow | `#EAFF3D` | メインブランド、CTA |
| Ink Blue    | `#603BFF` | サブブランド、hover |
| Ink Purple  | `#AF50FF` | アクセント          |
| Ink Green   | `#6AF7CE` | 再生・特殊操作      |
| Ink Orange  | `#FF9750` | 暖色系の操作        |
| Ink Red     | `#FF505E` | 破壊的操作          |
| Chaos Black | `#0D0D0D` | テキスト、影        |
| Desert Sand | `#F5F0E8` | 背景                |

### タイポグラフィ

| 役割              | フォント         | 用途                       |
| ----------------- | ---------------- | -------------------------- |
| Display / Heading | fooregular       | ヒーロー、セクション見出し |
| Alt               | obviously-narrow | ボタン、カテゴリ           |
| Body              | Montserrat       | 本文                       |

### シャドウ

通常の UI 階層には柔らかい blur shadow を使い、硬いオフセットの影は紙を切り抜いたような特殊表現に限定しています。

```
# Soft blur
shadow-soft-splat-sm  ->  0 4px 10px rgba(0,0,0,0.14)
shadow-soft-splat-md  ->  0 8px 18px rgba(0,0,0,0.16)
shadow-soft-splat-lg  ->  0 14px 30px rgba(0,0,0,0.18)

# Hard offset
shadow-solid-sm  ->  2px 2px 0px
shadow-solid     ->  4px 4px 0px
shadow-solid-lg  ->  6px 6px 0px
shadow-solid-xl  ->  8px 8px 0px
```

## リポジトリ構成

```
apps/docs/                 # Next.js ドキュメントと demo サイト
packages/ui/
  src/components/ui/       # public コンポーネント、内部 helper、CSS Modules
  public/_images/          # 公開パッケージ用の画像アセット
  public/fonts/            # セルフホストフォント
  public/svgs/             # 共有 SVG アセット
  scripts/                 # パッケージビルドと docs registry helper
tests/                     # 回帰テストとリリース準備チェック
```

## 開発コマンド

```bash
pnpm dev              # 開発サーバーを起動
pnpm build            # 本番ビルド
pnpm start            # 本番サーバーを起動
npx tsc --noEmit      # 型チェック
pnpm reference:crawl  # sitemap から公式リファレンス素材の manifest を生成
pnpm reference:crawl:all  # 英語 locale の全 sitemap ページをクロール
pnpm reference:crawl:all-locales  # 全 locale の sitemap ページをクロール
pnpm reference:analyze    # manifest をコンポーネント素材候補へ整理
pnpm reference:analyze:all-locales # 全 locale の manifest を分析
pnpm reference:analyze:videos # 公式リモート mp4 候補を重複排除して整理
```

参照素材をダウンロードする場合は `pnpm reference:crawl:download` を実行します。出力先は `scratch/` です。公開可能な静的ディレクトリへ移す前に、必ず人の目で確認し、リネームと採用判断を行ってください。

## npm パッケージのリリース

```bash
pnpm install
pnpm typecheck
pnpm build:package
pnpm pack:dry-run
pnpm test:package-consumer
pnpm changeset
pnpm version
pnpm publish --access public
git push --follow-tags
```

公開前に `pnpm pack:dry-run` の出力を確認し、tarball に含まれるものが `dist`、`public/_images`、`public/fonts`、`public/svgs`、README ファイル、LICENSE、NOTICE、package metadata に限られていることを確認してください。

## ライセンス

MIT

## 著作権に関する注意

本プロジェクトは **ファンメイド** であり、Nintendo Co., Ltd. とは一切関係ありません。Nintendo からの承認、許諾、または推奨を受けたものではありません。

- **Splatoon** は Nintendo の登録商標です
- Splatoon に関連するビジュアルスタイル、デザイン言語、アートワークの権利は Nintendo に帰属します
- 本プロジェクトは公開されている Web デザインを視覚的な参考として使用しており、ゲームコード、ゲーム内アセット、未公開素材は含みません
- 本プロジェクトは非営利のファンコミュニティ用途を想定しています

**権利上の問題がある場合は GitHub Issues からご連絡ください。速やかに対応します。**

---

---

アセットおよびツールの完全な帰属表示は [CREDITS.md](./CREDITS.md) をご覧ください。

_Splatoon ファンによる、Splatoon ファンのための UI ライブラリです。_
