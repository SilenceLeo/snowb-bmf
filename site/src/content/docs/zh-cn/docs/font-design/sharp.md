---
title: 控制字体锐度和抗锯齿
description: 掌握位图字体的边缘渲染。调整锐度以控制抗锯齿效果，从完美平滑 (0%) 到清晰锐利的像素级 (100%)。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "控制字体锐度和抗锯齿"
  "description": "掌握位图字体的边缘渲染。调整锐度以控制抗锯齿效果，从完美平滑 (0%) 到清晰锐利的像素级 (100%)。"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "about":
    "@type": "Thing"
    "name": "锐度功能"
    "description": "位图字体生成的抗锯齿和边缘渲染控制"
    "featureList":
      - "0-100% 锐度控制"
      - "0% 锐度时完全抗锯齿"
      - "100% 锐度时像素完美渲染"
      - "实时视觉反馈"
      - "针对复古和现代字体风格优化"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "keywords": ["位图字体", "抗锯齿", "字体锐度", "像素艺术", "矢量渲染", "字体设计", "游戏开发"]
  "articleSection": "字体设计"
  "audience":
    "@type": "Audience"
    "audienceType": ["游戏开发者", "字体设计师", "UI/UX 设计师"]
  "teaches": ["字体抗锯齿控制", "位图字体边缘渲染", "锐度功能使用"]
  "inLanguage": "zh-CN"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何在 SnowB BMF 中控制字体锐度"
    "description": "调整字体锐度以获得最佳位图字体渲染效果的分步指南"
    "step":
      - "@type": "HowToStep"
        "name": "选择锐化百分比"
        "text": "打开字体配置面板，调整锐度滑块以设置所需的锐化百分比（0-100%）"
      - "@type": "HowToStep"
        "name": "实时预览效果"
        "text": "在工作区中观察实时预览，查看锐度设置对字体字形的影响"
      - "@type": "HowToStep"
        "name": "根据目标尺寸微调"
        "text": "根据目标显示尺寸调整锐度值 — 小像素艺术字体使用较高值，大号平滑字体使用较低值"
---

**锐度**控制字形的抗锯齿和边缘渲染。你可以选择柔和平滑的边缘，也可以要硬朗像素化的线条。

范围 0% 到 100%：

-   **0%：** 完全抗锯齿，边缘最平滑。大字号下用这个，干净现代。
-   **100%：** 禁用抗锯齿，边缘像素化。复古游戏、像素艺术、极小尺寸下的清晰文本。

## 视觉效果对比

放大看差异最明显。0% 用像素渐变平滑边缘，100% 是硬边过渡。

| 0% 锐度 (平滑)                                  | 100% 锐度 (锐利)                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| ![锐度为 0% 的字体示例](~/assets/sharp-0.png) | ![锐度为 100% 的字体示例](~/assets/sharp-100.png) |

## 如何选择合适的锐度

-   **平滑外观：** 低值（0-25%），适合大号文本的平滑曲线。
-   **像素艺术 / 复古风格：** 高值（75-100%），边缘对齐像素网格，锐利清晰。
-   **折中：** 中间值兼顾清晰度和平滑度。

## 重要说明

-   需要先加载字体文件才能用这个设置。
-   锐度越高，纹理文件通常越小，半透明像素少了。
-   锐度越低，复杂字符在大尺寸下更好认。

## 相关主题

- [字体导入](/zh-cn/docs/font-design/font-import/)
- [字体大小](/zh-cn/docs/font-design/font-size/)
