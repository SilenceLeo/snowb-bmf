---
title: 界面指南：SnowB BMF 工作区导航
description: SnowB BMF 用户界面的完整指南，帮助您快速上手位图字体制作。免费使用，无需下载。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF 界面指南"
  "headline": "SnowB BMF 用户界面完整指南"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "全面介绍 SnowB BMF 的所有界面元素和功能，包括三栏式布局、字体配置选项、预览区域和样式设置。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "基于浏览器的游戏开发位图字体生成器"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "用户界面文档"
  "keywords": ["SnowB BMF 界面", "位图字体生成器界面", "字体配置", "纹理图集预览", "样式设置", "用户界面指南", "软件文档"]
  "audience":
    "@type": "Audience"
    "audienceType": ["开发者", "游戏开发者", "字体设计师", "数字艺术家"]
  "inLanguage": "zh-CN"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "teaches":
    - "如何使用 SnowB BMF 界面"
    - "理解三栏式布局"
    - "字体配置选项"
    - "预览区域功能"
    - "样式和效果配置"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
---

SnowB BMF 界面分三块：左边是字体配置，中间是预览区域，右边是样式配置。

![SnowB BMF 界面概览](~/assets/interface-overview.png)

## 主要界面布局

### 顶部菜单栏

菜单栏放着文件操作按钮：

- **新建 (New)** - 新建位图字体项目
- **打开 (Open)** - 加载已有项目文件（.sbf 或 .ltr 格式）
- **保存 (Save)** - 保存当前项目
- **导出 (Export)** - 导出位图字体和纹理图集

项目名称显示在中间，新项目默认叫 "Unnamed"。

### 三栏式布局

界面分三个主要部分。

## 左侧面板 - 字体配置

左侧面板管理字体和布局：

- **字体 (Font Family)**: 上传字体文件（TTF、OTF、WOFF）
- **字号和行高 (Font Size & Line Height)**: 控制字形大小和垂直间距
- **锐化 (Sharp)**: 调整渲染锐利度，清晰或柔和的边缘都行
- **布局设置 (Layout Settings)**: 配置内边距、间距和纹理图集排列
- **自动打包 (Auto Pack)**: 开启后自动优化纹理空间
- **尺寸控制 (Size Controls)**: 设置最大宽度，选固定还是动态纹理尺寸
- **全局度量调整 (Global Metric Adjustments)**: 用 xAdvance、xOffset、yOffset 微调字符定位

## 中间面板 - 预览区域

中间面板实时显示位图字体效果：

- **纹理图集显示 (Texture Atlas Display)**: 展示所有字形，透明背景用棋盘格表示
- **尺寸信息 (Size Information)**: 显示当前纹理尺寸（如 “439 x 439”）
- **预览控制 (Preview Controls)**: 缩放滑块和全屏切换
- **图片字形支持 (Image Glyph Support)**: 点”选择图片 (SELECT IMAGES)”添加自定义图片字形
- **实时更新 (Real-time Updates)**: 改设置时预览立刻跟着变

## 右侧面板 - 样式配置

右侧面板控制字形外观：

- **填充选项 (Fill Options)**: 纯色、渐变或纹理填充，带颜色选择器
- **描边设置 (Stroke Settings)**: 加轮廓，宽度、类型（外部/内部/居中）、线帽和连接样式都能调
- **阴影效果 (Shadow Effects)**: 投影效果，偏移、模糊、样式都可调
- **样式类型 (Style Types)**: 每种效果都支持纯色、渐变或图像
- **开关控件 (Toggle Controls)**: 一键开关描边和阴影

## 后续步骤

熟悉界面后，去[工作流程指南](../workflow-guide/)看看，跟着步骤做你的第一个位图字体。