# Splatoon UI

一个基于 Splatoon 视觉风格的 React 组件库，为同人创作者提供开箱即用的 UI 工具。

> **本项目与 Nintendo 无任何关联。** Splatoon 是 Nintendo 的注册商标。本项目是粉丝创作（fan-made），仅供非商业的同人社区使用。如涉及侵权，请联系我们，我们将立即处理。

**[English Version](./README_EN.md)**

## 这是什么

Splatoon UI 是一套完整的 React 组件库，复刻了 [splatoon.nintendo.com](https://splatoon.nintendo.com) 的视觉语言。你可以用它快速搭建 Splatoon 风格的同人网站、Wiki、锦标赛页面、粉丝社区等。

**核心特色：**

- 墨水滴落（drip）动画按钮
- 撕纸、胶带、钉书针风格的卡片系统
- WebGL 墨水飞溅过渡效果
- 基于物理摆锤模型的卡片堆叠轮播
- 12 种墨水飞溅装饰组件
- 15 种迷彩/图案背景纹理（支持 Retina）
- 完整的可访问性支持（`prefers-reduced-motion`、WCAG AA 对比度）

## 快速开始

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

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| UI 基座 | shadcn/ui + Base UI |
| 样式 | Tailwind CSS v4 |
| 动画 | framer-motion + CSS transitions/keyframes |
| WebGL | 自定义墨水飞溅着色器 |
| 图标 | lucide-react |
| 语言 | TypeScript (strict mode) |
| 包管理 | pnpm |

## 组件清单

### 核心组件

| 组件 | 说明 |
|------|------|
| `Button` | 6 色变体 + drip 动画 + 墨水飞溅装饰 |
| `Card` | 4 种变体：paper（撕纸）、staple（钉书针 + 胶带）、rugged（悬挂标签）、torn（手撕边） |
| `PhotoFrame` | 统一相纸容器：撕边 SVG + 胶带/贴纸装饰、mask-image 裁切、响应式 |
| `Dialog` | Base UI 封装，WaveButton 关闭按钮 + 全屏墨水飞溅模式 |
| `Tabs` | 墨水飞溅 hover + 颜色下划线标签页（default / line 两种变体） |
| `Input / Select / Checkbox / Radio` | 表单控件 |
| `Badge` | 7 色倾斜标签 + 贴纸变体 |
| `Navigation` | 固定头部（滚动折叠）+ 导航对话框 |

### 装饰组件

| 组件 | 说明 |
|------|------|
| `Tape Title` | 红 / 黄 / 黑背景 + SVG 胶带装饰标题 |
| `Banner Divider` | 波浪形分区过渡 |
| `Marquee` | 无限滚动内容条（default / tape / warning 变体，支持任意内容） |
| `Ink Splat` | 12 种墨水飞溅装饰组件 + 交互式墨水生成器 |
| `Sticker` | 装饰性贴纸 |
| `Background Patterns` | 15 种迷彩 / 图案纹理（支持 Retina） |

### 高级组件

| 组件 | 说明 |
|------|------|
| `Video Dialog` | YouTube 模态 + WebGL 墨水飞溅过渡 |
| `Ink Splash Canvas` | WebGL 着色器驱动的墨水过渡效果 |
| `Card Stack Carousel` | 基于物理摆锤模型的卡片轮播 |
| `Gallery System` | 统一轮播（Marquee / Weapons / Shops）+ 鱿鱼图标分页 |
| `InView` | IntersectionObserver 滚动触发动画 |
| `Page Transition` | WebGL 墨水飞溅页面过渡 |
| `Wave Canvas` | 交互式波浪画布 |

## 设计系统

### 颜色

| 名称 | 色值 | 用途 |
|------|------|------|
| Neon Yellow | `#EAFF3D` | 主品牌色、CTA |
| Ink Blue | `#603BFF` | 副品牌色、hover |
| Ink Purple | `#AF50FF` | 强调色 |
| Ink Green | `#6AF7CE` | 播放 / 特殊控件 |
| Ink Orange | `#FF9750` | 暖色操作 |
| Ink Red | `#FF505E` | 破坏性操作 |
| Chaos Black | `#0D0D0D` | 文本、阴影 |
| Desert Sand | `#F5F0E8` | 背景 |

### 字体

| 角色 | 字体 | 用途 |
|------|------|------|
| Display / Heading | fooregular | 英雄标题、章节标题 |
| Alt | obviously-narrow | 按钮、分类 |
| Body | Montserrat | 正文 |

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

## 项目结构

```
src/
  app/                    # Next.js 页面
  components/ui/          # 86 个组件 + 32 个 CSS Module
    splats/               # 12 种墨水飞溅装饰组件（TSX）
    stickers/             # 装饰贴纸
  config/                 # 导航配置等
  lib/
    utils.ts              # 工具函数（cn 等）
    wobble-math.ts        # 摆锤物理数学
    drip-math.ts          # 滴落动画数学
    ink-particle.ts       # 墨水粒子系统
    physics/              # 卡片堆叠物理引擎
    shaders/              # WebGL 着色器
  hooks/                  # 自定义 Hooks（useDripAnimation 等）
public/
  _images/                # 背景、胶带素材、截图
    tape-assets/          # 胶带/贴纸 PNG 素材（含 @2x）
  fonts/                  # 字体文件（fooregular、Montserrat 自托管）
  images/svg/             # 装饰 SVG 素材（撕边背景等）
  svgs/                   # 通用 SVG 资源（纸张撕裂、波浪等）
  official/               # 官方素材（gallery、navi、news 等）
```

## 开发命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm start            # 启动生产服务器
npx tsc --noEmit      # 类型检查
```

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

*由 Splatoon 同人社区爱好者制作，献给所有热爱 Splatoon 的玩家。*
