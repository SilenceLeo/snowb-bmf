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

可变字体是一种现代 OpenType 技术，允许单个字体文件包含沿连续轴的多种样式变体。无需为 Regular、Bold、Light 等样式分别加载单独的文件，一个可变字体文件即可提供所有这些样式——以及它们之间的任意值。SnowB BMF 完全支持可变字体，让您在生成位图字体时精确控制每个轴。

## 什么是可变字体？

传统字体家族需要为每种样式提供单独的文件：Regular 一个、Bold 一个、Light 一个，依此类推。**OpenType 可变字体**通过将多个变体轴嵌入单个文件来解决这个问题。

每个轴定义了一个值范围，可以连续调整字体的外观：

| 轴标签 | 名称 | 说明 |
|--------|------|------|
| `wght` | 字重 (Weight) | 控制笔画粗细，从 Thin (100) 到 Black (900) |
| `wdth` | 字宽 (Width) | 控制字符宽度，从窄体到宽体 |
| `ital` | 斜体 (Italic) | 在正体 (0) 和斜体 (1) 之间切换 |
| `opsz` | 光学尺寸 (Optical Size) | 根据不同显示尺寸调整设计细节 |
| `slnt` | 倾斜 (Slant) | 控制倾斜文本的角度 |

字体还可能包含由字体设计师定义的自定义轴，这些轴会与标准轴一起显示。

## 自动检测

SnowB BMF 会自动检测导入的字体是否为可变字体。当您使用**"添加字体文件"**按钮加载可变字体文件时：

1. 应用程序读取字体的 OpenType 变体表。
2. 如果发现变体轴，**变体轴**控制面板会自动出现在字体设置下方。
3. 无需额外配置——控件立即可用。

如果导入的字体不包含变体数据，面板不会出现。

**注意：** 可变字体控件仅对**主字体**（回退链中的第一个字体）生效。辅助字体和回退字体使用其默认轴值。

## 变体轴控制

字体中的每个变体轴都显示为一个独立的滑块，提供完整的控制：

- **轴名称**：轴的可读名称（如"Weight"、"Width"）。
- **当前值**：显示在滑块旁边，拖动时实时更新。
- **最小–最大范围**：滑块范围由字体定义的最小值和最大值决定。
- **步进精度**：大多数轴使用 `(最大值 - 最小值) / 100` 的步长以实现平滑控制。`ital`（斜体）轴使用步长 1，因为它通常作为开/关切换（0 或 1）。

### 常用轴详解

**字重 (`wght`)** — 最常用的轴。拖动滑块可在 Thin、Light、Regular、Medium、SemiBold、Bold、ExtraBold 和 Black 字重之间切换，或选择任意中间值。

**字宽 (`wdth`)** — 调整字符的水平比例。适用于在受限空间中排列文本或创建宽幅展示样式。

**斜体 (`ital`)** — 二值轴。设为 0 表示正体，设为 1 表示斜体。步长为 1 确保干净切换。

**光学尺寸 (`opsz`)** — 调整精细的排版细节。较小的光学尺寸通常会增加笔画对比度和间距以提高可读性，而较大的尺寸会收紧间距以适合展示用途。

**倾斜 (`slnt`)** — 控制文本的倾斜角度，提供连续范围，不同于二值的斜体轴。

## 命名实例

许多可变字体附带**命名实例**——由字体设计师预定义的轴值组合，对应传统的字体样式。这些通常包含熟悉的名称，如：

- Regular（常规）
- Bold（粗体）
- Light（细体）
- Thin（极细）
- SemiBold（半粗）
- ExtraBold（特粗）
- Condensed（窄体）

### 使用命名实例

当可变字体包含命名实例时，轴滑块上方会出现一个**实例**下拉选择器：

1. 点击下拉列表查看所有可用的实例。
2. 选择一个实例名称（如"Bold"），即可立即应用其预定义的轴值。
3. 所有轴滑块会更新以反映所选实例的坐标值。

### 自动实例匹配

SnowB BMF 会持续将您当前的轴值与字体的命名实例进行比较。如果您手动调整的值**完全匹配**某个命名实例的坐标，下拉列表会自动高亮该实例名称。这有助于您了解自定义调整何时与标准样式对齐。

如果您的值不匹配任何实例，下拉列表会显示"Custom"以表示非标准配置。

## 最佳实践

1. **从命名实例开始**：先选择一个预定义实例，再微调各个轴以获得自定义效果。
2. **在目标尺寸下测试**：可变字体轴效果在最终位图字体尺寸下最为明显。请始终在预期的显示分辨率下预览。
3. **用字重实现强调**：无需分别导入 Bold 和 Regular 字体，使用单个可变字体并调整字重轴即可。
4. **注意斜体轴**：斜体轴是切换开关（0 或 1），不是连续范围。如需角度变化的文本，请使用倾斜轴。
5. **检查字体支持**：并非所有字体都是可变字体。如果导入后未出现变体轴面板，说明该字体不包含变体数据。
6. **仅主字体生效**：请记住，变体控件仅对第一个导入的字体生效。额外的回退字体使用其默认样式。

## 相关主题

- [字体导入](/zh-cn/docs/font-design/font-import/)
- [锐化渲染](/zh-cn/docs/font-design/sharp/)
- [SDF 渲染](/zh-cn/docs/font-design/sdf-rendering/)
