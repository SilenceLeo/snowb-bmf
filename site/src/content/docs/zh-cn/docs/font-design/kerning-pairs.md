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

字偶距（Kerning）调整特定字符对之间的间距，让文本看起来更匀称。没有字偶距的话，有些字母组合的间距会明显不协调。

SnowB BMF 支持逐对设置字偶距。

## 调整前后对比

字偶距修正之后，字母之间的间距更自然。

| *调整前：默认间距* | *调整后：优化间距* |
| --- | --- |
| ![调整字偶距前的默认字符间距](~/assets/kerning-before.png) | ![调整字偶距后的优化字符间距](~/assets/kerning-after.png) |

## 如何配置字偶距

### 1. 激活预览模式

点主工具栏的**预览（Preview）** 按钮，工作区渲染文本并显示字偶距辅助引导。

### 2. 定义字偶距对

在预览文本区域输入要调的两个字符。比如调 'A' 和 'W' 的间距，输入 `AW`。

### 3. 调整间距

点字符对的第一个字符（`AW` 里的 'A'），字偶距面板弹出来，调它跟下一个字符的间距。

![调整 'AW' 字符对的字偶距值](~/assets/kerning-AW.png)

- **数量（Amount）：** 字偶距值，单位像素。
  - **负值**（`-10`）：字符靠近。
  - **正值**（`10`）：字符远离。

改动实时反映在预览里。要调 `WA` 的字偶距，输入 `WA` 然后选 'W'。

![调整 'WA' 字符对的字偶距值](~/assets/kerning-WA.png)

## 最佳实践

- **用真实文本测试：** 拿实际的单词和句子看效果，别只看单个字符对。
- **优先处理常见组合：** `AV`、`AW`、`VA`、`WA`、`To`、`P.`、`Yo` 这些。
- **相信眼睛：** 视觉上看着匀就行，不用追求数学精确。
- **小步调整：** 每次 1-3 像素，别一下拉太多。

## 相关主题

- [字形度量](/zh-cn/docs/font-design/glyph-metrics/)