# Splatoon UI

一个基于 Splatoon 视觉风格的 React 组件库，为同人创作者提供开箱即用的 UI 工具。

> **本项目与 Nintendo 无任何关联。** Splatoon 是 Nintendo 的注册商标。本项目是粉丝创作（fan-made），仅供非商业的同人社区使用。如涉及侵权，请联系我们，我们将立即处理。

**[English Version](./README.md) | [日本語版](./README_JA.md)**

## 这是什么

Splatoon UI 是一套完整的 React 组件库，基于 Splatoon 系列鲜艳、高对比、墨水感的视觉语言做了前端组件化整理。你可以用它快速搭建 Splatoon 风格的同人网站、Wiki、锦标赛页面、粉丝社区等。

**核心特色：**

- 墨水滴落（drip）动画按钮
- 撕纸、胶带、钉书针风格的卡片系统
- WebGL 墨水飞溅过渡效果
- 基于物理摆锤模型的卡片堆叠轮播
- 12 种墨水飞溅装饰组件
- 15 种迷彩/图案背景纹理（支持 Retina）
- 完整的可访问性支持（`prefers-reduced-motion`、WCAG AA 对比度）

## 快速开始

### 使用 npm 包

```bash
npm install splatoon-ui tailwindcss@^4 tw-animate-css@^1.4
```

在应用入口导入一次全局样式：

```tsx
import 'splatoon-ui/styles.css'
```

默认入口只导出 server-safe 的 stable 组件；交互组件按组件子路径导入：

```tsx
import { Alert, Badge, Input } from 'splatoon-ui'
import { Button } from 'splatoon-ui/button'
import { Dialog } from 'splatoon-ui/dialog'
```

文档站：https://dev-ui.s8p.io/zh/docs。

Splatoon UI 的样式会引用 `/_images`、`/fonts`、`/svgs` 下的静态资源。部署前，把包内的 `public/_images`、`public/fonts`、`public/svgs` 复制到你的应用 public 根目录。

`styles.css` 是 Tailwind CSS v4 入口文件；消费方应用需要具备能处理 npm 包 CSS imports 的 Tailwind v4/PostCSS 流程。

如需按组件加载 CSS，请只导入一次共享主题，再导入实际使用的组件样式。不要与聚合的 `styles.css` 同时使用。

```tsx
import 'splatoon-ui/theme.css'
import 'splatoon-ui/styles/button.css'
import 'splatoon-ui/styles/dialog.css'
```

### 本地运行 demo

```bash
# 克隆项目
git clone https://github.com/YoungSx/splatoon-ui.git
cd splatoon-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

打开 http://localhost:4317 查看效果。

## 技术栈

| 层级    | 技术                                      |
| ------- | ----------------------------------------- |
| 框架    | Next.js 16 (App Router + Turbopack)       |
| UI 基座 | shadcn/ui + Base UI                       |
| 样式    | Tailwind CSS v4                           |
| 动画    | framer-motion + CSS transitions/keyframes |
| WebGL   | 自定义墨水飞溅着色器                      |
| 图标    | lucide-react                              |
| 语言    | TypeScript (strict mode)                  |
| 包管理  | pnpm                                      |

## 公共 API

下面每个公开组件都有 package 子路径、生成 API 参考和文档示例。根入口 `splatoon-ui` 保持 server-safe；客户端组件和更完整的 API 请使用子路径导入。

| 导入路径                        | 主要导出                                                                | 用途                                            |
| ------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `splatoon-ui/alert`             | `Alert`                                                                 | 撕纸风格状态与反馈表面。                        |
| `splatoon-ui/badge`             | `Badge`                                                                 | 带固定配色的倾斜标签徽章。                      |
| `splatoon-ui/button`            | `Button`                                                                | 墨水风格操作按钮，包含 drip 和 arrow 处理。     |
| `splatoon-ui/button-group`      | `ButtonGroup`, `ButtonGroupItem`                                        | 紧凑操作按钮组。                                |
| `splatoon-ui/icon-button`       | `IconButton`                                                            | 圆形纯图标控件和轮播箭头。                      |
| `splatoon-ui/wave-button`       | `WaveButton`                                                            | blob 图形触发器，保留原生线条图形。             |
| `splatoon-ui/card`              | `Card`                                                                  | 通用卡片表面基础件。                            |
| `splatoon-ui/staple-card`       | `StapleCard`                                                            | 带钉书针纸边和媒体区的信息流卡片。              |
| `splatoon-ui/torn-card`         | `TornCard`                                                              | 撕纸风格内容卡片。                              |
| `splatoon-ui/rugged-card`       | `RuggedCard`                                                            | 粗粝悬挂标签卡片。                              |
| `splatoon-ui/carousel`          | `Carousel`, `FeedCarousel`, `MarqueeCarousel`, `WeaponsGalleryCarousel` | 轮播基础件和生产级 gallery 预设。               |
| `splatoon-ui/checkbox`          | `Checkbox`                                                              | 墨水风格复选框。                                |
| `splatoon-ui/dialog`            | `Dialog`                                                                | 基于 Base UI 的对话框封装。                     |
| `splatoon-ui/input`             | `Input`                                                                 | 文本输入基础件。                                |
| `splatoon-ui/label`             | `Label`                                                                 | 表单标签基础件。                                |
| `splatoon-ui/loader`            | `Loader`                                                                | squid 和 morph 加载指示器。                     |
| `splatoon-ui/radio-group`       | `RadioGroup`, `RadioGroupItem`                                          | 单选组控件。                                    |
| `splatoon-ui/progress`          | `Progress`                                                              | 墨水风格进度条。                                |
| `splatoon-ui/select`            | `Select`                                                                | 选择器 trigger、content、item 和 value 基础件。 |
| `splatoon-ui/segmented-control` | `SegmentedControl`                                                      | 分段切换控件。                                  |
| `splatoon-ui/popover`           | `Popover`                                                               | 浮层内容和触发器基础件。                        |
| `splatoon-ui/sheet`             | `Sheet`                                                                 | 侧边 sheet 弹层和触发器基础件。                 |
| `splatoon-ui/switch`            | `Switch`                                                                | 二元开关控件。                                  |
| `splatoon-ui/tabs`              | `Tabs`                                                                  | 带墨水风格激活态的标签页导航。                  |
| `splatoon-ui/list`              | `List`, `ListItem`                                                      | 列表展示基础件。                                |
| `splatoon-ui/section`           | `Section`                                                               | 带图案背景的区块容器。                          |
| `splatoon-ui/banner-divider`    | `BannerDivider`                                                         | 多层 banner 分割装饰。                          |
| `splatoon-ui/dotted-divider`    | `DottedDivider`                                                         | 横向或纵向点状分割线。                          |
| `splatoon-ui/splatoon-title`    | `SplatoonTitle`                                                         | 展示型标题处理。                                |
| `splatoon-ui/heading-tape`      | `HeadingTape`                                                           | 胶带背景标题处理。                              |
| `splatoon-ui/tape-title`        | `TapeTitle`                                                             | 紧凑胶带标题基础件。                            |
| `splatoon-ui/tape`              | `Tape`, `Staple`                                                        | 可定位胶带和钉书针装饰资产。                    |
| `splatoon-ui/wave-canvas`       | `WaveCanvas`                                                            | 用于区块边界的动画 canvas 波形。                |

## 设计系统

### 颜色

| 名称        | 色值      | 用途            |
| ----------- | --------- | --------------- |
| Neon Yellow | `#EAFF3D` | 主品牌色、CTA   |
| Ink Blue    | `#603BFF` | 副品牌色、hover |
| Ink Purple  | `#AF50FF` | 强调色          |
| Ink Green   | `#6AF7CE` | 播放 / 特殊控件 |
| Ink Orange  | `#FF9750` | 暖色操作        |
| Ink Red     | `#FF505E` | 破坏性操作      |
| Chaos Black | `#0D0D0D` | 文本、阴影      |
| Desert Sand | `#F5F0E8` | 背景            |

### 字体

| 角色              | 字体             | 用途               |
| ----------------- | ---------------- | ------------------ |
| Display / Heading | fooregular       | 英雄标题、章节标题 |
| Alt               | obviously-narrow | 按钮、分类         |
| Body              | Montserrat       | 正文               |

### 阴影

主阴影使用柔和模糊（soft blur），用于 UI 元素的层次感；硬偏移实色（hard offset）仅用于特殊剪贴画风格元素：

```
# 柔和模糊（主用）
shadow-soft-splat-sm  →  0 4px 10px rgba(0,0,0,0.14)
shadow-soft-splat-md  →  0 8px 18px rgba(0,0,0,0.16)
shadow-soft-splat-lg  →  0 14px 30px rgba(0,0,0,0.18)

# 硬偏移（legacy / 特殊场景）
shadow-solid-sm  →  2px 2px 0px
shadow-solid     →  4px 4px 0px
shadow-solid-lg  →  6px 6px 0px
shadow-solid-xl  →  8px 8px 0px
```

## 仓库结构

```
apps/docs/                 # Next.js 文档和 demo 站点
packages/ui/
  src/components/ui/       # public 组件、内部 helper 和 CSS Modules
  public/_images/          # 可发布图片资产
  public/fonts/            # 自托管字体
  public/svgs/             # 共享 SVG 资产
  scripts/                 # 包构建和 docs registry helper
tests/                     # 回归和发布就绪检查
```

## 开发命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm start            # 启动生产服务器
npx tsc --noEmit      # 类型检查
pnpm reference:crawl  # 从 sitemap 生成官网参考资源 manifest（输出到 scratch/）
pnpm reference:crawl:all  # 抓取英文 locale 的全部 sitemap 页面
pnpm reference:crawl:all-locales  # 抓取 sitemap 中全部 locale 页面（独立输出目录）
pnpm reference:analyze    # 将 manifest 映射为组件资产候选清单
pnpm reference:analyze:all-locales # 分析全部 locale 的 manifest
pnpm reference:analyze:videos # 去重并归档官方远程 mp4 候选
```

如需下载 manifest 中的参考资源，使用 `pnpm reference:crawl:download`。下载结果仍在
`scratch/`，需要人工筛选、重命名和确认用途后再迁入可发布资源目录。
全 locale 抓取会写入 `scratch/splatoon-reference-all-locales/`，避免覆盖默认英文参考报告。
视频分析只输出远程候选清单到 scratch，不会把 mp4 二进制复制到可发布目录。

## 发布 npm 包

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

发布前必须看 `pnpm pack:dry-run` 输出，确认 tarball 只包含 `dist`、`public/_images`、`public/fonts`、`public/svgs`、README 文件、LICENSE、NOTICE 和 package metadata。

## 许可证

MIT

## 版权声明

本项目是 **粉丝创作（fan-made）**，与 Nintendo Co., Ltd. 没有任何关联、授权或背书关系。

- **Splatoon** 是 Nintendo 的注册商标
- 本项目中所有 Splatoon 相关的视觉风格、设计语言和美术元素的版权归 Nintendo 所有
- 本项目仅使用了公开可访问的网页设计作为视觉参考，不包含任何游戏代码、资源文件或未公开素材
- 本项目仅供非商业的同人社区使用

**如本项目涉及侵权，请通过 GitHub Issues 联系我们，我们将立即处理。**

---

---

查看 [CREDITS.md](./CREDITS.md) 了解完整素材和工具鸣谢。

_由 Splatoon 同人社区爱好者制作，献给所有热爱 Splatoon 的玩家。_
