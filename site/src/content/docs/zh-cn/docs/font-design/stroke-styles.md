---
title: 描边样式：为位图字体添加轮廓和边框
description: 一份全面的字体描边（轮廓）应用与自定义指南。学习如何使用宽度、颜色、位置和线条样式，创造出专业且易于阅读的文本效果。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "字体描边与轮廓样式"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "一份全面的字体描边（轮廓）应用与自定义指南。学习如何使用宽度、颜色、位置和线条样式，创造出专业且易于阅读的文本效果。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "audience":
    "@type": "Audience"
    "audienceType": ["游戏开发者", "字体设计师", "UI/UX设计师"]
  "keywords": ["字体描边", "轮廓样式", "位图字体设计", "文本样式", "字体效果", "排版", "SnowB BMF"]
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/stroke-styles/"
  "articleSection": "字体设计"
  "teaches": ["字体描边应用", "轮廓自定义", "文本可读性增强", "视觉样式技巧"]
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
---

描边给字符加上轮廓线。作用很直接：让字符更清晰、在复杂背景上更好认，也能做出不同的视觉风格。

## 应用描边

在样式编辑器中打开**描边**开关，然后调整下面的属性。

## 核心描边属性

### 描边宽度与位置
- **宽度**：轮廓厚度，单位像素。描边粗了视觉冲击力强，但小号字体可能被遮挡细节。
- **描边类型**：描边画在字符边缘的哪个位置。
  - **外部**：画在字符外面，原始形状不变，字符看起来更大。提高可读性一般用这个。
  - **居中**：在字符边缘居中，轮廓均衡。
  - **内部**：画在字符里面，字符会显得更细。

### 线帽与连接
控制边角和端点的外观，手写体和风格化字体里比较明显。
- **线帽**：开放路径端点的样式。
  - **平头 (Butt)**：平直方形。
  - **圆头 (Round)**：圆形。
  - **方头 (Square)**：方形，但会伸出字符轮廓。
- **线连接**：线条交汇处怎么画。
  - **尖角 (Miter)**：锐利的尖。
  - **圆角 (Round)**：圆滑过渡。
  - **斜角 (Bevel)**：平直截断。

## 描边填充与颜色

描边的填充也可以自定义：
- **纯色**：单一颜色。
- **渐变**：颜色平滑过渡。
- **图像填充**：用纹理或图像填充描边。

## 描边最佳实践

- **保持对比度**：描边和填充色之间对比度要够，不然白描白字看不清。
- **小字号用细描边**：粗了会把字符本身盖住。
- **外部描边最实用**：想让文本从背景里跳出来，**外部**类型通常效果最好。

## 相关主题

- [填充样式](/zh-cn/docs/font-design/fill-styles/)
- [阴影效果](/zh-cn/docs/font-design/shadow-effects/)
