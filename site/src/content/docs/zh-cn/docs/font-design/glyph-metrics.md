---
title: "字形度量：微调 xAdvance、xOffset 和 yOffset"
description: 通过调整全局和单个字形的度量（如 xAdvance、xOffset 和 yOffset），优化位图字体中的字符间距和位置。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "在 SnowB BMF 中调整字形度量"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "通过调整全局和单个字形的度量（如 xAdvance、xOffset 和 yOffset），优化位图字体中的字符间距和位置。"
  "about":
    "@type": "Thing"
    "name": "字形度量"
    "description": "位图字体中的字符间距和定位参数"
  "audience":
    "@type": "Audience"
    "audienceType": "字体设计师, 游戏开发者, 排版专业人员"
  "keywords": ["字形度量", "位图字体", "字符间距", "xAdvance", "xOffset", "yOffset", "字体设计", "排版", "SnowB BMF"]
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何在 SnowB BMF 中调整字形度量"
    "description": "调整全局和单个字形度量以实现最佳字符间距的分步指南"
    "step":
      - "@type": "HowToStep"
        "name": "打开度量面板"
        "text": "导航到左侧边栏，找到全局度量调整设置"
      - "@type": "HowToStep"
        "name": "调整全局度量"
        "text": "设置 xAdvance、xOffset 和 yOffset 值，以控制整体字体间距和定位"
      - "@type": "HowToStep"
        "name": "微调单个字形度量"
        "text": "激活预览模式，选择特定字符，并覆盖其单独的度量值"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "inLanguage": "zh-CN"
  "articleSection": "Font Design"
---

在 SnowB BMF 中，您可以在全局和单个字形两个层面上微调字体度量。这使您可以精确控制字符的间距和定位。

## 全局字形度量

全局度量调整会影响字体中的每一个字形，提供了一种统一控制整体布局的方法。您可以在左侧边栏中找到这些设置。

![全局度量调整](/src/assets/global-metric-adjustments.png)

### 全局设置

- **xAdvance**: 定义每个字符占据的默认水平空间。它控制着每个字形渲染后光标前进的距离。
- **xOffset**: 水平移动所有字形。正值向右移动，负值向左移动。
- **yOffset**: 垂直移动所有字形。正值向下移动，负值向上移动。

所有度量值均以像素为单位，默认为 0。

## 单个字形度量

为了进行更精细的控制，您可以为特定字形覆盖全局度量。这对于修复特定字符的间距问题非常有用。

### 如何调整单个字形

1.  在工作区激活 **预览 (Preview)** 模式。
2.  在预览文本字段中输入您想要调整的字符。
3.  在预览区域中单击一个字符以选中它。
4.  单个字形的调整面板将出现在底部。

![单个字形调整](/src/assets/metric-adjustments.png)

### 单个设置

对于任何选定的字形，您可以覆盖以下内容：

- **xAdvance**: 为所选字符设置自定义的前进宽度。
- **xOffset**: 对此字形应用独特的水平偏移。
- **yOffset**: 对此字形应用独特的垂直偏移。

这些单独的调整将始终优先于全局设置。

## 常见用例

### 何时使用全局调整：
- 在整个字体上应用一致的间距更改。
- 调整字体的基线以获得更好的对齐效果。
- 抵消特定平台的渲染怪癖。

### 何时使用单个调整：
- 修正有问题字符的间距（例如，“W”或“I”）。
- 重新定位标点符号和特殊符号。
- 创建自定义字偶距对。
- 平衡不同字符的视觉重量。

## 最佳实践

- **从全局开始**: 首先进行全局调整，为您的字体设置一个基线。
- **单独调整**: 对特例和微调使用单独的调整。
- **经常预览**: 在预览模式下使用不同的文本样本不断测试您的更改。
- **考虑目标**: 牢记目标平台的文本渲染方式。

## 相关主题

- [字偶距](/zh-cn/docs/font-design/kerning-pairs/)
- [布局设置](/zh-cn/docs/font-design/layout-settings/)