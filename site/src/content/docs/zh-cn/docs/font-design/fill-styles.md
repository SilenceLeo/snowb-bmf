---
title: "字体填充样式：纯色、渐变与图案"
description: "学习如何为您的位图字体应用纯色、渐变和独特的图像图案，为任何项目创造引人注目的视觉效果。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "字体填充样式：纯色、渐变与图案"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "学习如何为您的位图字体应用纯色、渐变和独特的图像图案，为任何项目创造引人注目的视觉效果。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "articleSection": "Font Design"
  "keywords": ["字体填充样式", "位图字体", "纯色", "渐变", "图像图案", "字体设计", "SnowB BMF", "排版", "视觉效果"]
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/fill-styles/"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "teaches":
    - "如何为位图字体应用纯色"
    - "为字体字符创建线性和径向渐变"
    - "在字体设计中使用图像图案和纹理"
    - "自定义渐变色标和角度"
    - "控制图像图案重复模式"
---

填充样式决定字符内部长什么样。SnowB BMF 有三种选项：纯色、渐变、图像图案。

在右侧边栏的”填充”部分操作，调整后实时预览。

## 纯色

一种颜色铺满整个字符，简单直接，适合可读性要求高的场景。

选颜色、调透明度 (alpha)，改了画布上立刻更新。

适合对比度要求高的 UI 元素、极简排版和单色配色方案。

## 渐变

颜色之间平滑过渡，给字体加点层次感。

两种类型可选：

- **线性渐变**：沿直线方向混合颜色，0-360 度控制角度。
- **径向渐变**：从中心向外辐射，适合做发光和高光效果。

**自定义渐变**

渐变条是主要编辑区域。在渐变条上点击添加色标，点色标可以改颜色，拖动色标调整位置。要删除色标，把它往上或往下拖离渐变条。线性渐变可以用拨盘或输入数值来设置角度。

默认是白到黑的线性渐变。

### 渐变预设

SnowB BMF 带有渐变预设：

- **内置预设**：10 个现成的渐变，涵盖火焰、冰霜、金属、霓虹等效果，一键应用。
- **保存自定义预设**：做好的渐变可以存下来，跨项目复用。
- **删除预设**：自定义预设可以删，内置的不能。

预设选择器在渐变编辑器顶部。

## 图像图案

用自定义图片或纹理填充字符，做出独特的视觉风格。

拖放图像文件当纹理，上传后有缩略图预览。用缩放控制调整图案密度（精度 0.01）。重复模式控制纹理在字符内怎么平铺：
  - **`repeat`**：所有方向平铺。
  - **`repeat-x`**：只水平重复。
  - **`repeat-y`**：只垂直重复。
  - **`no-repeat`**：不重复，只显示一次。

图像图案适合模拟材质（木头、金属、石头）、融入品牌纹理、做装饰性字体，或者构建游戏主题的文字资产。

## 相关主题

- [描边样式](/zh-cn/docs/font-design/stroke-styles/)
- [阴影效果](/zh-cn/docs/font-design/shadow-effects/)