# 🦑 DESIGN.md: Splatoon 3 Official Website Design System

## 1. 核心设计理念 (Design Philosophy)

本网站的视觉语言深度绑定《斯普拉遁 3》的世界观设定，核心关键词为：**“混沌 (Chaos)”、“街头涂鸦 (Street Punk)”、“废土烈日 (Sun-scorched Desert)”**。

- 
- **反极简主义 (Anti-Minimalism)**：拒绝横平竖直和留白。采用大量的重叠图层、不对称的几何图形和粗糙的边缘材质。
- **拼贴画与手账风 (Scrapbook Aesthetic)**：UI 元素模仿现实中的封箱胶带、撕裂的纸张、不干胶贴纸以及街头喷漆。
- **高能与立体感 (High Energy & 3D Depth)**：游戏内的 3D 渲染角色必须打破容器的二维边界（破框而出），营造极强的空间纵深与视觉冲击力。
- **无障碍优先 (Accessibility First)**：在追求极致动效的同时，严格遵守 A11y 标准，将“减少动态 (Reduced motion)”置于全局最高优先级。

------



## 2. 设计令牌 (Design Tokens)

### 2.1 色彩系统 (Color Palette)

配色方案基于“蛮颓镇”的沙漠废土环境以及标志性的高饱和对战墨水色。



| Token Name          | Hex Value      | 用途说明 (Usage)                                             |
| ------------------- | -------------- | ------------------------------------------------------------ |
| --color-neon-yellow | #E3FF00 (近似) | **主品牌色**。核心 CTA 按钮（如 Buy Now）、重要文本高亮背景。 |
| --color-ink-blue    | #4100FF (近似) | **主品牌对比色**。用于背景分割块、与黄色形成极致的视觉碰撞。 |
| --color-desert-sand | #EAD6B8 (近似) | **页面主背景色**。模拟荒芜炎热的沙漠（Splatlands）质感。     |
| --color-chaos-black | #181818        | **主文本色 & 阴影色**。不使用纯黑，带有极低的灰度。          |
| --color-tape-white  | #F4F4F4        | **卡片/胶带背景色**。带有些微做旧感的冷白色。                |

### 2.2 排版与字体 (Typography)

排版上舍弃了传统的端正对齐，大量使用**倾斜 (Skew)** 和**加粗 (Black/Heavy)** 来表达街头叛逆感。

- 
- **Headings (标题字体)**:**Font-family**: 专属定制无衬线粗体 (Custom Sans-Serif Block) / Splatoon 风格字体。**Styling**: 大量应用 transform: skewX(-5deg) rotate(-2deg);，文本常常带有实心偏移阴影（Solid Drop-Shadow）。**Text-transform**: 统一使用 UPPERCASE（大写）。
- **Body (正文字体)**:**Font-family**: 标准无衬线字体 (如 Roboto, Helvetica Neue, 或系统默认 sans-serif)，确保长篇阅读的清晰度。**Color**: --color-chaos-black，在暗色背景下使用白色。

------



## 3. 布局与栅格系统 (Layout & Grid)

### 3.1 破局布局 (The "Broken" Grid)

网站不使用传统的 12 列网格严格对齐。各个 Section 采用**模块化但不规则**的堆叠方式。

- 
- **元素重叠 (Overlapping)**: 图片、文字框和装饰性贴纸在 Z 轴上互相交叠（Negative Margins & Z-index）。
- **非水平分割线 (Slanted Dividers)**: 区块之间的过渡通常是锯齿状（Zig-zag）或倾斜的墨水波浪，而非笔直的水平线。

### 3.2 Z轴空间层级 (Z-Index Architecture)

codeText



```
Z-Index 999: 导航栏 (Sticky Nav) & 减少动态按钮 (Reduced Motion Toggle)
Z-Index 100: 破框而出的 3D 角色渲染图 (Inklings/Octolings)
Z-Index 50:  文本内容与 CTA 按钮
Z-Index 10:  卡片容器 (撕裂纸张材质 / 胶带边框)
Z-Index 1:   背景飞溅墨点 (Ink Splatters) & 涂鸦贴纸
Z-Index 0:   底层页面背景色 / 滚动视差背景
```

------



## 4. UI 组件规范 (UI Components)

### 4.1 墨滴按钮 (Drip Button)

《斯普拉遁 3》最具代表性的交互元素为 **Drip Button（墨滴按钮）**。它摒弃了硬编码的多边形裁剪，改用动态贝塞尔曲线、双层颜色渲染遮罩以及拟真机械按键触感来实现极致交互。

#### 4.1.1 动态墨滴曲线插值 (Dynamic Wave Math)
按钮在加载或 `resize` 时，根据其实际宽度在客户端动态生成波滴控制点并缓存在 React State 中。
- **波段步长**: 固定的水平跨度 `stepSize = 30px`。
- **最大振幅**: 垂直最大流动深度 `maxAmplitude = 80px`。
- **贝塞尔控制点**: 遍历控制点 $o$，生成随机 Y 轴进入/退去波幅以及带有 $\pm 6\text{px}$ 轻微水平抖动（$xOffset$）的控制点数组。使用 **三次贝塞尔曲线 (C 指令)** 闭合路径：
  $$\text{Curve} = C(a+6, \ r+offset) \ \ (a+24, \ r+offset) \ \ (a+30, \ r)$$
- 确保进入（Drip Enter）和退去（Drip Leave）的 SVG 指令数和控制点结构 100% 对称，以满足现代 GPU 渲染器对 `clip-path: path(...)` 变形插值要求。

#### 4.1.2 极致拟真动效与透视学 (Replication Mechanics)
- **不对称过渡延迟 (Asymmetric Transition)**: 
  - **Hover In (移入)**: 墨水以极速淡入 (`transition: opacity 0.05s`)，伴随 quartic 曲线 `cubic-bezier(0.77, 0, 0.175, 1)` 滴落，描边内阴影颜色延迟 `0.6s`（流淌完全覆满后）才平滑发生过渡，达成完美的视觉流畅感。
  - **Mouse Leave (移出)**: 墨水以相同的缓动向上回缩淡出，`opacity` 过渡拉长至 `0.4s` 以展示液体回弹退去动效。
- **随机涂鸦倾角 (Random Spray Can Tilt)**: 
  - 每个按钮在挂载时随机计算一个向左或向右的倾角 `1.5deg ~ 2.5deg` 注入 `--hover-rotate` 变量。
  - 在 `:active`（按下）时，通过 `active:rotate-[var(--hover-rotate)]` **维持**该倾斜角度，防止回弹时发生生硬的角度偏转。
- **3D 机械下沉与投影坍缩 (3D Press Easing)**: 
  - 默认及 Hover 态下按钮有 `4px` 或 `6px` 的实心高对比度偏移阴影。
  - 按下时，按钮发生向右下的物理位移：`active:translate-x-[3px] active:translate-y-[3px]`，同时实心投影等量坍缩至 `1px`。
  - 在透视空间上，阴影的绝对渲染坐标保持不动（位移与坍缩刚好抵消），逼真地还原了物理按键被按到底部的坍缩反馈。

#### 4.1.3 通用语义与 A11y 规范 (Polymorphism & A11y)
- **Slot 多态渲染**: 支持标准 `asChild` 模式。当 `asChild` 为 `true` 时，外层标签自动转为 Radix UI 的 `<Slot>` 组件，能无缝将 variants 和 CSS 变量向下传递到 Next.js `<Link>` 或者是自定义链接标签中，使得 HTML 标签完全符合应用语义。
- **ARIA 无障碍屏读**: 双层重合文本层中，绝对定位的悬停遮罩层（Hover Content Layer）显式赋予 `aria-hidden="true"` 标记，防止屏幕阅读器双重宣读。
- **React 生命周期保护 (Hybrid Drip)**:
  - 若 `children` 为纯文本，渲染双文字层以激活 1:1 的液体覆盖字色“剪裁割裂”效果。
  - 若 `children` 为复杂 React 节点，自动降级为单节点渲染（置于顶层 `z-30`，只被 mount 一次以保护内部生命周期和 Effect 副作用安全），遮罩层退化为纯背景层进行 clip-path 裁剪。

### 4.2 卡片容器 (Cards / News Items)

- 
- **边缘处理**: 经常使用 SVG 遮罩（Masks）实现边缘被撕裂（Ripped paper）或墨水晕染的轮廓。
- **阴影 (Shadows)**: 不使用柔和的 box-shadow，而是使用高对比度的实心阴影。*示例*: filter: drop-shadow(8px 8px 0px var(--color-chaos-black));

### 4.3 装饰元素 (Decorative Elements)

- 
- **警示带 / 跑马灯 (Marquee Tapes)**: 贯穿页面的横向或斜向无限滚动文本带。
- **墨迹 (Ink Splats)**: 随机分布在空白处的矢量墨迹点缀，部分墨迹会响应鼠标的 hover 或滚动事件。

------



## 5. 动效与交互 (Motion & Interactions)

- 
- **视差滚动 (Parallax Scrolling)**:背景材质、中景卡片与前景的角色 3D 模型以不同的滚动速率移动，营造立体空间感。
- **微交互 (Micro-interactions)**:鼠标悬停在新闻卡片（如 "Beginner Basics" 系列文章[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]）上时，触发轻微的放大（Scale up），同时卡片底部的墨迹矢量图可能会出现“喷溅”动画（Scale & Opacity 变化）。
- **页面加载 (Load-in)**:元素入场多采用从下往上的弹跳动画（Spring/Bouncy easing），结合倾斜角度的复原。

------



## 6. 无障碍设计 (Accessibility - a11y)

作为任天堂的官方站点，本页面在极其狂野的视觉下，保持了顶级的无障碍关怀：

1. 
2. **Reduced Motion (减少动态)**[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]:**位置**: 在页面 DOM 结构的第一顺位（Skip to main content 旁边），确保键盘导航（Tab 键）用户第一时间可以触发。**功能**: 点击后，通过向 <body> 注入特定 class，或配合 CSS 的 @media (prefers-reduced-motion: reduce)，**全局关闭**所有视差滚动、背景循环动画和剧烈的弹跳悬停特效。
3. **高对比度支持**: 所有关键文本（黑色配黄色、白色配深蓝）均符合 WCAG AA 级对比度标准。
4. **ARIA 标签**: 所有图形化按钮和弹出窗口（如 "Opens in a dialog window"[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]）均配有完整的屏幕阅读器描述。

------



## 7. 页面信息架构 (Information Architecture)

页面采用单页长卷轴（Long-scroll）加弹窗（Dialog）的结构。DOM 结构及内容块自上而下顺位如下：

1. 
2. **全局控制 / Nav**: Reduced motion 切换开关，跳至主内容，Hamburger 菜单[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。
3. **Hero Section (首屏)**: Splatoon 3 主视觉，大型 "Buy now" 及 "Expansion Pass" 转化入口，预告片播放按钮[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。
4. **World-building (世界观设定)**:*Ink up the Splatlands*: 沙漠废土背景介绍[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。*Welcome to Splatsville*: 混沌之城介绍[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。
5. **Gameplay (玩法介绍)**:*Dive in*: 占地对战模式介绍[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。*Fit check*: 武器与装备 (Weapons and gear) 系统介绍[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。
6. **News Feed (新闻动态)**: 网格化布局的官方资讯卡片（包含新手指南、偶像采访、版本更新等），点击后打开 Dialog 弹窗阅读[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。
7. **Footer (硬件与合规)**: 强调 Nintendo Switch 独占属性，社群媒体矩阵链接，ESRB 评级，隐私政策及 Cookie 偏好设置管理中心 (Powered by Onetrust)[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fsplatoon.nintendo.com%2F)]。

------