---
title: 字偶距：调整字符间距提升可读性
description: 通过配置字偶距，优化字体字符间距，打造专业且精致的文本布局。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "字偶距调整 - SnowB BMF 字体设计文档"
  "description": "学习如何在 SnowB BMF 中通过配置字偶距来优化位图字体的字符间距，打造专业且精致的文本布局。"
  "keywords": ["字偶距", "字体设计", "字符间距", "排版学", "位图字体", "SnowB BMF", "字体字偶距", "文本布局"]
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "字体设计"
  "teaches":
    - "如何在 SnowB BMF 中激活字偶距预览模式"
    - "如何定义和调整字偶距对"
    - "专业字偶距调整的最佳实践"
    - "理解正负字偶距值的含义"
  "audience":
    "@type": "Audience"
    "audienceType": "字体设计师、游戏开发者、UI设计师"
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/kerning-pairs/"
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
    "name": "如何在 SnowB BMF 中配置字偶距"
    "description": "通过字偶距调整字符间距的逐步指南"
    "step":
      - "@type": "HowToStep"
        "name": "激活预览模式"
        "text": "点击主工具栏中的预览按钮，启用字偶距视觉引导"
      - "@type": "HowToStep"
        "name": "定义字偶距对"
        "text": "在预览文本区域输入您想要调整字偶距的两个字符"
      - "@type": "HowToStep"
        "name": "调整字偶距数值"
        "text": "点击第一个字符，使用字偶距面板调整间距值"
---

字偶距（Kerning）是排版学中的一项基本技术，它通过调整特定字符对之间的间距，创造出视觉上更具吸引力且更易于阅读的文本。恰当的字偶距能让您的字体看起来既专业又均衡。

在 SnowB BMF 中，您可以精确控制字偶距，从而完善您的位图字体布局。

## 可视化字偶距调整效果

调整前后的差异一目了然。字偶距修正了字母间不协调的间距，创造出更自然的文本流。

| *调整前：默认间距* | *调整后：优化间距* |
| --- | --- |
| ![调整字偶距前的默认字符间距](~/assets/kerning-before.png) | ![调整字偶距后的优化字符间距](~/assets/kerning-after.png) |

## 如何配置字偶距

在 SnowB BMF 中，调整字偶距是一个直观且可视化的过程。

### 1. 激活预览模式

首先，点击主工具栏中的 **预览（Preview）** 按钮。这将在工作区中渲染您的文本，并提供用于字偶距调整的辅助视觉引导。

### 2. 定义字偶距对

在预览文本区域，只需输入您想要调整字偶距的两个字符。例如，要调整 'A' 和 'W' 之间的间距，请输入 `AW`。

### 3. 调整间距

点击字符对中的第一个字符（例如 `AW` 中的 'A'）。此时将出现字偶距调整面板，允许您调整它与下一个字符之间的间距。

![调整 'AW' 字符对的字偶距值](~/assets/kerning-AW.png)

- **数量（Amount）：** 这是以像素为单位的字偶距值。
  - **负值** (`-10`) 会使字符靠得更近。
  - **正值** (`10`) 会使字符分得更开。

您的更改会实时反映在预览区域，为您提供即时反馈。要调整 `WA` 的字偶距，只需输入 `WA` 并选择 'W' 即可。

![调整 'WA' 字符对的字偶距值](~/assets/kerning-WA.png)

## 专业字偶距调整的最佳实践

- **使用真实单词：** 使用实际的单词和句子测试字偶距，以观察字符对在上下文中的表现。
- **关注常见组合：** 优先处理常见的问题组合，例如 `AV`、`AW`、`VA`、`WA`、`To`、`P.`、`To`、`Yo`。
- **相信您的眼睛：** 追求视觉上一致的间距，而非数学上的相等。目标是达到感官上的平衡。
- **进行微小调整：** 以微小的增量（每次 1-3 像素）微调字偶距，以获得最佳效果。

## 相关主题

- [字形度量](/zh-cn/docs/font-design/glyph-metrics/)