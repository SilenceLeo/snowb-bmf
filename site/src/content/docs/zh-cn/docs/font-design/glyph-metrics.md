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

SnowB BMF 可以在全局和单个字形两个层面调整字体度量，控制字符间距和定位。

## 全局字形度量

全局度量影响所有字形，统一调整整体布局。设置在左侧边栏。

![全局度量调整](/src/assets/global-metric-adjustments.png)

### 全局设置

- **xAdvance**：每个字符占多少水平空间，也就是字形渲染后光标往前走多远。
- **xOffset**：所有字形水平移动。正值向右，负值向左。
- **yOffset**：所有字形垂直移动。正值向下，负值向上。

单位都是像素，默认 0。

## 单个字形度量

某个字符的间距不对，可以单独覆盖它的全局度量。

### 调整步骤

1. 在工作区切到**预览 (Preview)** 模式。
2. 预览文本里输入要调的字符。
3. 在预览区域点击那个字符，选中它。
4. 底部弹出该字形的调整面板。

![单个字形调整](/src/assets/metric-adjustments.png)

### 单个设置

选中字形后可以改这几个属性：

- **xAdvance**：这个字符的前进宽度。
- **xOffset**：这个字形的水平偏移。
- **yOffset**：这个字形的垂直偏移。

单个调整优先级高于全局设置。

## 常见用例

### 全局调整适用于：
- 统一改变整个字体的间距。
- 调基线对齐。
- 补偿不同平台的渲染差异。

### 单个调整适用于：
- 修正某些字符的间距，比如 “W” 或 “I”。
- 重新摆放标点符号和特殊符号。
- 手动创建字偶距对。
- 让不同字符的视觉重量更均衡。

## 最佳实践

- **先调全局**：全局调整定好整体基线。
- **再调个别**：单个调整修补特例。
- **多用不同文本测试**：别只看一组样本。
- **关注目标平台**：各平台渲染文本的方式不一样。

## 相关主题

- [字偶距](/zh-cn/docs/font-design/kerning-pairs/)
- [布局设置](/zh-cn/docs/font-design/layout-settings/)