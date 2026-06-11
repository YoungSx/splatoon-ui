# Splatoon UI

一个基于 Splatoon 视觉风格的 React 组件库，为同人创作者提供开箱即用的 UI 工具。

> **本项目与 Nintendo 无任何关联。** Splatoon 是 Nintendo 的注册商标。本项目是粉丝创作（fan-made），仅供非商业的同人社区使用。如果本项目侵犯了您的权益，请联系我们，我们会立即处理。

## 这是什么

Splatoon UI 是一套完整的 React 组件库，复刻了 [splatoon.nintendo.com](https://splatoon.nintendo.com) 的视觉语言。你可以用它快速搭建 Splatoon 风格的同人网站、Wiki、锦标赛页面、粉丝社区等。

**核心特色：**

- 液态墨水 drip 动画按钮
- 撕纸 / 胶带 / 钉书针 风格的卡片系统
- WebGL 墨水飞溅过渡效果
- 物理引擎驱动的卡片堆叠轮播
- 12 种墨水飞溅 SVG 装饰
- 13 种迷彩 / 图案背景纹理
- 完整的无障碍支持（`prefers-reduced-motion`、WCAG AA 对比度）

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

打开 http://localhost:3000 查看效果。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router + Turbopack) |
| UI 基座 | shadcn/ui + Base UI |
| 样式 | Tailwind CSS v4 |
| 动画 | CSS transitions + keyframes, requestAnimationFrame |
| WebGL | 自定义墨水飞溅着色器 |
| 语言 | TypeScript (strict mode) |
| 包管理 | pnpm |

## 组件清单

### 核心组件

| 组件 | 说明 |
|------|------|
| `Button` | 6 色变体 + drip 动画 + blob close 按钮 |
| `Card` | 3 种变体：news（撕纸 + 钉书针 + 胶带）、tag（悬挂标签）、plain |
| `Dialog` | Base UI 封装，morph blob 关闭按钮 |
| `Splatoon Modal` | CSS 自定义属性驱动的模态框系统 |
| `Tabs` | 平行四边形标签页 |
| `Input / Select / Checkbox / Radio` | 表单控件 |
| `Badge` | 贴纸风格标签 |
| `Navigation` | 粘性头部 + 全屏覆盖菜单 |

### 装饰组件

| 组件 | 说明 |
|------|------|
| `Tape Title` | 红 / 黄 / 黑背景 + SVG 胶带装饰标题 |
| `Banner Divider` | 波浪形分区过渡 |
| `Marquee` | 无限滚动文本条 |
| `Ink Splat` | 12 种内联 SVG 墨水飞溅 + 交互生成器 |
| `Sticker` | 装饰性贴纸 |
| `Background Patterns` | 13 种迷彩 / 图案纹理（支持 Retina） |

### 高级组件

| 组件 | 说明 |
|------|------|
| `Trailer Video` | YouTube 模态 + WebGL 墨水飞溅过渡 |
| `Ink Splash Canvas` | WebGL 着色器驱动的墨水过渡效果 |
| `Card Stack Carousel` | 基于物理摆锤模型的卡片轮播 |
| `Gallery System` | 统一轮播 + 鱿鱼图标分页 |
| `InView` | IntersectionObserver 滚动触发动画 |
| `Page Transition` | WebGL 墨水飞溅页面过渡 |
| `Character Showcase` | 3D 角色展示 + 墨水效果 |
| `Wave Canvas` | 交互式波浪画布 |

## 设计系统

### 颜色

| 名称 | 色值 | 用途 |
|------|------|------|
| Neon Yellow | `#EAFF3D` | 主品牌色、CTA |
| Ink Blue | `#603BFF` | 副品牌色、hover |
| Ink Purple | `#A51EE1` | 强调色 |
| Neon Cyan | `#00C8B4` | 播放 / 特殊控件 |
| Ink Orange | `#FA5A00` | 暖色操作 |
| Ink Red | `#FF585E` | 破坏性操作 |
| Chaos Black | `#0D0D0D` | 文本、阴影 |
| Desert Sand | `#F5F0E8` | 背景 |

### 字体

| 角色 | 字体 | 用途 |
|------|------|------|
| Display | social-gothic-rough | 英雄标题 |
| Heading | fooregular | 章节标题 |
| Alt | obviously-narrow | 按钮、分类 |
| Body | Montserrat | 正文 |

### 阴影

所有阴影使用硬偏移实色（`shadow-solid`），不用模糊阴影：

```
shadow-solid-sm   →  2px 2px 0px
shadow-solid      →  4px 4px 0px
shadow-solid-lg   →  6px 6px 0px
```

## 项目结构

```
src/
  app/                    # Next.js 页面
  components/ui/          # 90+ 组件文件
    splats/               # 12 种墨水飞溅 SVG
    stickers/             # 装饰贴纸
  lib/                    # 工具函数（cn、wobble-math、drip-math 等）
  hooks/                  # 自定义 Hooks（useDripAnimation 等）
public/
  _images/                # 背景、胶带素材、截图
  fonts/                  # 自托管字体文件
  images/svg/             # 装饰 SVG 素材
```

## 开发命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
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

**如果 Nintendo 或其授权代表认为本项目存在侵权问题，请通过 GitHub Issues 联系我们，我们会在收到通知后立即处理。**

---

*本项目由 Splatoon 同人社区爱好者制作，献给所有热爱 Splatoon 的玩家。*
