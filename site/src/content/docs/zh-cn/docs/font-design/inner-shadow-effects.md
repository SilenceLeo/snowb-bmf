---
title: 内阴影效果：打造浮雕与内凹位图字体
description: "为位图字体添加内阴影效果，实现浮雕、雕刻和内凹发光样式。在 SnowB BMF 中配置偏移、模糊和颜色。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "位图字体设计中的内阴影效果"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "使用 SnowB BMF 为位图字体创建内阴影效果的全面指南。学习如何配置内凹阴影，打造浮雕、雕刻和内发光文字样式。"
  "keywords": ["内阴影", "内凹阴影", "位图字体", "浮雕效果", "文本效果", "内发光", "字体样式", "SnowB BMF"]
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "audience":
    "@type": "Audience"
    "audienceType": "字体设计师、游戏开发者、UI/UX 设计师"
  "articleSection": "字体设计"
  "teaches":
    - "如何启用和配置内阴影效果"
    - "调整内阴影偏移、模糊和颜色"
    - "创建浮雕、雕刻和内发光样式"
    - "将内阴影与外阴影组合使用以增强立体感"
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/inner-shadow-effects/"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何为位图字体创建内阴影效果"
    "description": "创建专业内阴影效果的逐步指南"
    "step":
      - "@type": "HowToStep"
        "name": "启用内阴影"
        "text": "使用内阴影面板的开关来切换内阴影的开启或关闭"
      - "@type": "HowToStep"
        "name": "调整偏移参数"
        "text": "设置水平和垂直偏移值来定位内阴影"
      - "@type": "HowToStep"
        "name": "配置模糊半径"
        "text": "调整模糊半径来控制内阴影的柔和度和扩散范围"
      - "@type": "HowToStep"
        "name": "选择阴影颜色"
        "text": "使用颜色选择器选择内阴影颜色和不透明度"
---

内阴影把阴影画在字形内部，做出浮雕、雕刻或内凹的文字效果。外阴影往外扩，内阴影往里收，让文字看起来像刻进了表面。

## 内阴影与外阴影的区别

外阴影画在字形背后，文字显得悬浮。内阴影画在字形填充区域里面，模拟光线打在凹陷面上的样子。游戏界面、标题画面里常见的浮雕和活字印刷效果，就是靠内阴影实现的。

两种阴影可以叠加，做出更丰富的立体层次。

## 内阴影控件

内阴影面板在右侧边栏，控制字形内部阴影的位置、柔和度和颜色。

### 启用或禁用内阴影

面板标题栏的开关控制开关。关掉后参数还在，随时能再打开。

### 核心参数

#### 水平和垂直偏移 (Offset X & Offset Y)
- **描述**：控制内阴影在字形内的位置。`Offset X` 左右移动，`Offset Y` 上下移动。
- **值**：正值向右/向下，负值向左/向上。
- **默认值**：`0px`
- **提示**：偏移方向就是模拟的光线方向。比如正 Offset Y 加负 Offset X，表示光从右上方来。

#### 模糊半径
- **描述**：内阴影边缘的柔和程度。值越大越弥散，`0` 是硬边内凹。
- **最小值**：`0px`
- **默认值**：`0px`

#### 阴影颜色
- **描述**：内阴影的颜色，颜色选择器里可以调不透明度（alpha 通道）。
- **默认值**：`#000000`（黑色）
- **提示**：深色做雕刻感，浅色（特别是低不透明度的白色）做内部高光或斜面效果。

## 常见内阴影样式

### 浮雕文字
文字从表面凸起，模拟单方向光照。
- **Offset X**：`1px`
- **Offset Y**：`1px`
- **模糊**：`1px`
- **颜色**：50% 不透明度的黑色（`#00000080`）
- **搭配建议**：外阴影偏移设为 `-1px, -1px`，形成完整浮雕。

### 雕刻 / 活字印刷
文字被切进或压入表面。
- **Offset X**：`0px`
- **Offset Y**：`-2px`
- **模糊**：`1px`
- **颜色**：黑色（`#000000`）

### 内发光
字形内部边缘发出柔光。
- **Offset X**：`0px`
- **Offset Y**：`0px`
- **模糊**：`4px` 到 `8px`
- **颜色**：明亮的强调色（例如青色 `#00FFFF`、金色 `#FFD700`）

### 微妙立体
极简的内凹，只加一点三维质感。
- **Offset X**：`0px`
- **Offset Y**：`1px`
- **模糊**：`2px`
- **颜色**：30% 不透明度的黑色（`#0000004D`）

## 最佳实践

### 与外阴影组合
内阴影配合[阴影效果](/zh-cn/docs/font-design/shadow-effects/)一起用，能做出逼真的浮雕和内凹。把两种阴影的偏移设成相反方向，光照看起来就一致了。

### 保持克制
内阴影不宜过重。模糊或偏移太大，文字会糊掉，小字号下特别明显。

### 注意填充样式
内阴影跟[填充样式](/zh-cn/docs/font-design/fill-styles/)会互相影响。纯色填充跟各种内阴影都合得来。渐变填充加轻微内发光，效果很好。

### 性能
- 内阴影逐字形渲染，烘焙到最终纹理里。跟外阴影不一样，内阴影不会撑大字形边界框。
- 模糊值高了渲染会慢一些，但阴影始终在字形边界内，对图集大小几乎没影响。

## 导出说明

- 内阴影跟外阴影一样，直接烘焙进最终的位图字体图像。
- 内阴影在字形边界内渲染，不占额外的内边距或图集空间。
- 内阴影可以和外阴影、描边、填充同时用，所有效果合成到最终字形位图里。

## 相关主题

- [阴影效果](/zh-cn/docs/font-design/shadow-effects/)
- [填充样式](/zh-cn/docs/font-design/fill-styles/)
- [描边样式](/zh-cn/docs/font-design/stroke-styles/)
