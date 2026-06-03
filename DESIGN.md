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

### 4.2 卡片容器 (Cards / Official Card Variants)

《斯普拉遁 3》官方网页的核心承载体主要分为两种完全不同的卡片容器类型，用以展示新闻、活动与装备系统：

#### 4.2.1 拍立得手账新闻卡片 (Polaroid News Card / `news` variant)
拍立得手账新闻卡片是一比一复刻自官方网站新闻版块（News Feed）的核心组件，具有极高的废土手账拼贴感：
- **三层流式 DOM 架构**：
  1. **顶部撕纸 SVG (`cardTop`)**：带有人性化防亚像素缝隙位移（`margin-bottom: -2.5px`）的撕纸矢量路径。
  2. **内容区域 (`cardLayout`)**：包裹真实的背景色（支持通过 `cardBgColor` 自定义色调），具有 `0px` 圆角。内部使用 `grid-template-rows: auto 1fr` 区分图片区与正文区。
  3. **底部撕纸 SVG (`cardBottom`)**：带有防亚像素缝隙位移（`margin-top: -2.5px`）的收尾纸边矢量路径。
- **拟真物理挂件投影与旋转**：
  - **边缘矢量投影**：外层容器不使用矩形 `box-shadow`，而是使用 `filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5))`。这保证了阴影会沿着撕纸 SVG 的锯齿轮廓以及外部重叠挂件进行自然投影。
  - **金属订书针 (Staples)**：底部左右侧绝对定位 vector-rendered 金属订书针（`stapleLeft` / `stapleRight`），带有物理暗孔和反光高光，模拟将卡片钉在看板上的效果。
  - **封箱胶带 (Adhesive Tapes)**：顶部提供左倾 `-10deg` (`tapeNews` 胶带) 与右倾 `10deg` (`tapeEvent` 胶带) 位置选项，边缘通过 `tape-torn-edge` 裁剪实现手撕封箱胶带质感。
- **子组件旋转偏移 (`CardImage`)**：
  - 卡片内部的图片容器强行注入 `transform: rotate(-1deg)`，使照片在白色卡片底纸中略微歪斜，加强手账拼贴的非对称街头氛围。
  - **Hover 交互**：当悬停在卡片上时，卡片发生 `rotate(2deg) scale(1.025)` 的平滑弹性旋转变化，配合 3D 位移反馈。

#### 4.2.2 服饰吊牌挂牌卡片 (Hanging Tag Card / `tag` variant)
服饰吊牌卡片还原了官方网站玩法与装备版块的超大吊牌悬挂式布局：
- **矢量吊牌轮廓 (`tagBgSvg`)**：
  - 卡片底层由一段高解析度矢量吊牌背景 SVG（带有挂绳吊环与挂孔剪切）构成。
  - 通过 `fill="currentColor"` 绑定父级文本色类，实现 `tagTheme` 配色的自由选择（提供 Yellow, Blue, Purple, Orange, Green 五种官方主题色以及前背景自适应）。
- **吊牌内照片框 (`CardImage`)**：
  - 在吊牌卡片中，`CardImage` 自动重构为带有拟真“透明胶带” (`Scotch Tape`) 的拍立得纸框。
  - **透明胶带**：使用 inline SVG 画布，通过 `stroke-dasharray` 边缘锯齿、半透明白色滤镜与下方阴影，模拟透明塑料胶带效果。
  - **照片纸框**：包含 `2px` 黑色描边、`shadow-solid-sm` 偏置投影以及内置的偏置角度，鼠标悬停时平滑复原为 `rotate(0deg)`。
- **参数控制**：
  - 默认状态下支持定义 `tagRotation`（挂吊倾角，如 `-2deg`），使其在网格中呈现出不规则的悬挂状态。


### 4.3 斜切式选项卡 (Skewed Tabs)

《斯普拉遁 3》经典的平行四边形倾斜选项卡，常用于游戏模式（如 Turf War / Salmon Run）的切换：

- **斜切双重抵消布局 (Double Skew Correction)**：
  - **外框斜切**：选项卡触发按钮 (`TabsTrigger`) 容器注入 `skew-x-[-12deg]`。
  - **文字反向矫正**：内部内容包裹在 `skew-x-[12deg] inline-block` 的容器中。这一对冲完全抵消了文字的倾斜扭曲，保证了文本及内部 Icon 的 100% 垂直可读性。
- **机械实心阴影物理下沉**：
  - 常态激活状态下具有 `border-2 border-chaos-black` 描边和 `shadow-solid-sm` 实体偏置投影。
  - 按下 `:active` 时，发生向右下方的微小物理下沉 `translate-x-[2px] translate-y-[2px]`，同时投影坍缩，模拟真实的按键下压感。
- **双重多态兼容 (Polymorphism)**：
  - 支持 `default`（平行斜切方块键）与 `line`（无斜切、底端紫色滑线指示器）两种变体。
  - 利用 Tailwind 级联规则 `group-data-[variant=line]/tabs-list:skew-x-0` 优雅地在子组件中关闭斜切，无需任何额外的 React JS 代码控制。

### 4.4 粘性导航栏与全局 Reduced Motion 开关 (Sticky Navigation Header & A11y Toggler)

《斯普拉遁 3》的顶部导航栏集成了品牌的极简前卫外观与任天堂极其严苛的无障碍（A11y）标准：
- **粘性高度收缩 (Scroll-Driven Shrinking)**：
  - 导航栏在页面顶部常态下呈现大高度（`70px` - `80px`）。
  - 当页面滚动距离超过 `40px` 时，导航栏高度通过 transition 平滑收紧至 `50px`，同时收窄内边距，减少在游戏体验和长篇滚动中的垂直空间占用。
- **全局减弱动态手动控制 (Reduced Motion Override System)**：
  - 提供全局的无障碍操控（A11y Bar），包含键盘首位 Tab 导航聚焦的 `Skip to main content` 链接。
  - 用户可直接通过 `Reduced Motion` 覆盖按钮手动开关所有复杂的贝塞尔流体动画与 3D 转场。
  - **CSS 动效熔断机制**：点击开关将在 `html` 根容器上动态注入/移除 `.reduced-motion` 类。在 CSS 层面通过强级联熔断所有过渡与动画周期（`transition-duration: 0.01ms !important`, `animation-duration: 0.01ms !important`）。
  - **JS 状态分发**：全局 React 组件可监听 `isReducedMotion` 偏好，自动调整 SVG 控制点计算频率并缩减 framer-motion 过渡时长。
- **右上角泼墨拐角与变形 Toggler (Corner Splat & Morph Toggler)**：
  - NavBar 右上角放置了高解析度矢量泼墨拐角背景 SVG。
  - 悬浮在拐角上的 Menu 按钮由一组完全由 CSS transform 驱动的三横线汉堡菜单图标构成。
  - 展开菜单时，三横线图标无缝变形并旋转交叉为 "X"（关闭），同时 "Menu" 文字产生阴影变化。
- **全屏手账 Overlay 菜单 (Full-screen Overlay Menu)**：
  - 点击 Menu 按钮后，拉起充满个性的全屏深色盖板。
  - 菜单背景以不同的延迟和缩放呈现出多色彩（Neon Yellow, Ink Blue）的巨幅矢量喷墨背景。
  - 导航链接采用大号大写倾斜字体（obviously-narrow 风格），并在 Hover 时展现 `rotate(-2deg)` 的轻微偏转倾斜，以及从中间向两侧平滑延展的“黄胶带”下划线物理微交互。
  - **JS 驱动的液态涌动与参数化插值 (Dynamic Wave Evolution via JS Thread)**：
    - 针对现代浏览器在 `@keyframes` 中应用 CSS 自定义属性（`var(...)`）导致 `clip-path` 无法进行正常几何路径插值的底层局限，弃用纯 CSS 关键帧，改用 **JavaScript `requestAnimationFrame` 驱动的极坐标插值架构**。
    - 引入 [animProgress](file:///C:/Users/shang/Project/splatoon-ui/src/components/ui/navigation.tsx#L59) state 变量。在 750ms 动效周期内使用 `easeInOutCubic` 缓动控制时间进度参数 $t$（`0.0` 至 `1.0`），于 JS 主线程完成极坐标的贝塞尔重构并以字面量形式直接赋给 `style.clipPath`，实现 100% 顺滑动画。
    - **多倍频反向旋转噪波（Octave Phase Shifting）**：叠加 $6$、$12$、$24$、$48$ 四组不同网格大小的 FBM 周期环状噪波，将每层倍频的角相与时间进度 $t$ 绑定进行反向偏移，在扩散中产生液体反向涌动、交织翻滚的逼真流体质感。
    - **触手扭动与拉丝变尖（Gaussian Splat Spikes & Drifting）**：硬编码 4 组完美偏向左下角的官方预设高斯突触，高度最高达 900px。在蔓延中，突触角度随正弦缓慢飘移（Drifting），突触宽度（Sigma）由宽变窄，模拟液体前冲拉伸的流体力学特性，终点态完美覆盖全屏。

### 4.5 装饰元素 (Decorative Elements)

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