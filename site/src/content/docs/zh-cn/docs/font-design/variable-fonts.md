---
title: 可变字体：动态控制字重、字宽和样式
description: "在 SnowB BMF 中使用 OpenType 可变字体。通过实时滑块控制字重、字宽、斜体和自定义轴，支持命名实例预设。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "SnowB BMF 可变字体指南 - 动态字体轴控制"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "了解如何在 SnowB BMF 中使用 OpenType 可变字体。通过实时滑块控制字重、字宽、斜体、光学尺寸和自定义轴。选择命名实例快速切换预设样式。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "基于浏览器的位图字体生成器"
    "url": "https://snowb.org"
  "keywords": ["可变字体", "variable fonts", "字体变体", "font variations", "字重轴", "weight axis", "字宽轴", "width axis", "OpenType 可变字体", "位图字体生成器", "命名实例", "named instances", "字体设计", "SnowB BMF"]
  "articleSection": "字体设计"
  "audience":
    "@type": "Audience"
    "audienceType": "游戏开发者和字体设计师"
  "teaches":
    - "如何在位图字体生成器中使用 OpenType 可变字体的变体轴和命名实例"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何在 SnowB BMF 中使用可变字体"
    "description": "在 SnowB BMF 位图字体生成器中控制可变字体轴和命名实例的分步指南"
    "supply":
      - "@type": "HowToSupply"
        "name": "可变字体文件（包含 OpenType 变体数据的 TTF 或 OTF 文件）"
    "tool":
      - "@type": "HowToTool"
        "name": "SnowB BMF 字体生成器"
        "url": "https://snowb.org"
    "step":
      - "@type": "HowToStep"
        "name": "导入可变字体"
        "text": "使用\"添加字体文件\"按钮导入可变字体（包含 OpenType 变体表的 TTF 或 OTF 文件）。"
      - "@type": "HowToStep"
        "name": "查看变体轴面板"
        "text": "检测到可变字体后，变体轴控制面板会自动出现在字体设置下方。"
      - "@type": "HowToStep"
        "name": "调整各个轴"
        "text": "使用滑块调整每个轴（字重、字宽、斜体、光学尺寸、倾斜或自定义轴）。每个滑块显示轴名称、当前值和最小-最大范围。"
      - "@type": "HowToStep"
        "name": "选择命名实例"
        "text": "使用实例下拉列表快速切换到预定义的字体样式，如 Regular、Bold、Light 或 Thin。"
      - "@type": "HowToStep"
        "name": "微调并导出"
        "text": "设置好所需的变体值后，继续配置其他字体设置并导出位图字体。"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/variable-fonts/"
---

可变字体是 OpenType 的一项技术：单个文件就能包含多种样式变体。不需要为 Regular、Bold、Light 分别加载文件，一个可变字体搞定所有样式，还能选它们之间的任意中间值。SnowB BMF 支持可变字体，生成位图字体时可以精确控制每个轴。

## 什么是可变字体？

传统字体家族每种样式一个文件：Regular 一个、Bold 一个、Light 一个。**OpenType 可变字体**把多个变体轴塞进一个文件里。

每个轴定义一个值范围，可以连续调整字体外观：

| 轴标签 | 名称 | 说明 |
|--------|------|------|
| `wght` | 字重 (Weight) | 控制笔画粗细，从 Thin (100) 到 Black (900) |
| `wdth` | 字宽 (Width) | 控制字符宽度，从窄体到宽体 |
| `ital` | 斜体 (Italic) | 在正体 (0) 和斜体 (1) 之间切换 |
| `opsz` | 光学尺寸 (Optical Size) | 根据不同显示尺寸调整设计细节 |
| `slnt` | 倾斜 (Slant) | 控制倾斜文本的角度 |

字体也可能包含设计师自定义的轴，和标准轴一起显示。

## 自动检测

SnowB BMF 会自动检测导入的字体是不是可变字体。用**"添加字体文件"**按钮加载时：

1. 应用读取字体的 OpenType 变体表。
2. 检测到变体轴后，控制面板自动出现在字体设置下方。
3. 不需要额外配置，控件直接可用。

字体不包含变体数据的话，面板不会出现。

**注意：** 可变字体控件只对**主字体**（回退链中第一个字体）生效。辅助字体用默认轴值。

## 变体轴控制

每个变体轴对应一个滑块：

- **轴名称**：可读名称（如 "Weight"、"Width"）。
- **当前值**：显示在滑块旁，拖动时实时更新。
- **最小–最大范围**：由字体定义。
- **步进精度**：多数轴步长为 `(最大值 - 最小值) / 100`。`ital` 轴步长为 1，因为它就是个开关。

### 常用轴详解

**字重 (`wght`)** — 用得最多。拖动滑块在 Thin 到 Black 之间切换，也能选任意中间值。

**字宽 (`wdth`)** — 调整字符的水平比例。空间紧张时压窄，展示场景拉宽。

**斜体 (`ital`)** — 二值轴，0 正体，1 斜体。

**光学尺寸 (`opsz`)** — 调整排版细节。小尺寸增加笔画对比度和间距提高可读性，大尺寸收紧间距适合展示。

**倾斜 (`slnt`)** — 控制倾斜角度，和斜体轴不同，这里是连续范围。

## 命名实例

很多可变字体带有**命名实例**，就是设计师预设好的轴值组合，对应传统字体样式。常见的有：

- Regular（常规）
- Bold（粗体）
- Light（细体）
- Thin（极细）
- SemiBold（半粗）
- ExtraBold（特粗）
- Condensed（窄体）

### 使用命名实例

字体包含命名实例时，轴滑块上方会出现**实例**下拉选择器：

1. 点击下拉列表查看可用实例。
2. 选一个名称（如 "Bold"），轴值立即切换。
3. 所有滑块随之更新。

### 自动实例匹配

SnowB BMF 会把当前轴值和命名实例做对比。如果手动调整的值刚好**完全匹配**某个实例的坐标，下拉列表会自动高亮对应的名称。

值不匹配任何实例时，下拉列表显示 "Custom"。

## 最佳实践

1. **从命名实例开始**：先选一个预定义实例，再微调各轴。
2. **在目标尺寸测试**：轴效果在最终位图字体尺寸下最明显，在预期分辨率下预览。
3. **用字重做强调**：不用分别导入 Bold 和 Regular，一个可变字体调字重轴就行。
4. **斜体轴是开关**：0 或 1，不是连续范围。要角度变化的话用倾斜轴。
5. **检查字体支持**：不是所有字体都是可变的。导入后没出现变体轴面板，说明字体不含变体数据。
6. **只对主字体生效**：变体控件作用于第一个导入的字体，回退字体用默认样式。

## 相关主题

- [字体导入](/zh-cn/docs/font-design/font-import/)
- [锐化渲染](/zh-cn/docs/font-design/sharp/)
- [SDF 渲染](/zh-cn/docs/font-design/sdf-rendering/)
