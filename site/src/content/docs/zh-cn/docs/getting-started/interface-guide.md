---
title: 界面指南
description: SnowB BMF 用户界面的完整指南，帮助您快速上手位图字体制作。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF 界面指南"
  "headline": "SnowB BMF 用户界面完整指南"
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
  "educationalLevel": "初级到中级"
  "learningResourceType": "用户指南"
  "inLanguage": "zh-CN"
  "image": "https://user-images.githubusercontent.com/4632034/89119353-85c0f680-d4e0-11ea-88ae-978dfc01d5fc.png"
  "mainEntity":
    "@type": "UserInterface"
    "name": "SnowB BMF 主界面"
    "description": "用于位图字体生成的三栏式界面布局"
  "teaches":
    - "如何使用 SnowB BMF 界面"
    - "理解三栏式布局"
    - "字体配置选项"
    - "预览区域功能"
    - "样式和效果配置"
  "hasPart":
    - "@type": "Article"
      "name": "左侧面板 - 字体配置"
      "description": "核心字体设置和布局选项"
    - "@type": "Article"
      "name": "中间面板 - 预览区域"
      "description": "实时纹理图集显示和控制"
    - "@type": "Article"
      "name": "右侧面板 - 样式配置"
      "description": "字体字形的视觉样式选项"
---

SnowB BMF 拥有一个简洁直观的界面，分为三个主要面板：字体配置（左侧）、预览区域（中间）和样式配置（右侧）。本指南将详细介绍所有界面元素及其功能，助您高效创建位图字体。

![SnowB BMF 界面概览](~/assets/interface-overview.png)

## 主要界面布局

### 顶部菜单栏

顶部菜单栏提供基本的文件操作功能：

- **新建 (New)** - 创建一个新的位图字体项目
- **打开 (Open)** - 加载现有的项目文件（支持 .sbf 或 .ltr 格式）
- **保存 (Save)** - 保存您当前的项目
- **导出 (Export)** - 导出位图字体和纹理图集

项目名称显示在中间（新项目默认为 "Unnamed"）。

### 三栏式布局

界面被划分为三个主要部分，以实现高效的工作流程管理。

## 左侧面板 - 字体配置

左侧面板用于管理核心字体设置和布局选项：

- **字体 (Font Family)**: 上传字体文件（支持 TTF, OTF, WOFF 格式）
- **字号和行高 (Font Size & Line Height)**: 控制字形大小和垂直间距
- **锐化 (Sharp)**: 调整字体渲染的锐利度，实现清晰或柔和的边缘效果
- **布局设置 (Layout Settings)**: 配置内边距、间距和纹理图集的组织方式
- **自动打包 (Auto Pack)**: 启用自动纹理优化，以实现高效的空间利用
- **尺寸控制 (Size Controls)**: 设置最大宽度，并选择固定或动态的纹理尺寸
- **全局度量调整 (Global Metric Adjustments)**: 通过 xAdvance、xOffset 和 yOffset 控件微调字符的定位

## 中间面板 - 预览区域

中间面板提供位图字体的实时预览：

- **纹理图集显示 (Texture Atlas Display)**: 高效地展示所有生成的字形，并以透明背景（棋盘格图案）显示
- **尺寸信息 (Size Information)**: 显示当前纹理的尺寸（例如 "439 x 439"）
- **预览控制 (Preview Controls)**: 用于详细检查的缩放滑块和全屏切换按钮
- **图片字形支持 (Image Glyph Support)**: 通过“选择图片 (SELECT IMAGES)”按钮添加自定义图片字形
- **实时更新 (Real-time Updates)**: 调整设置时，更改会立即反映在预览中

## 右侧面板 - 样式配置

右侧面板控制字体字形的视觉样式：

- **填充选项 (Fill Options)**: 可选择纯色、渐变或基于纹理的填充，并配有颜色选择器
- **描边设置 (Stroke Settings)**: 添加轮廓，可自定义宽度、类型（外部/内部/居中）、线帽和连接样式
- **阴影效果 (Shadow Effects)**: 应用投影效果，可调整偏移、模糊和样式选项
- **样式类型 (Style Types)**: 每种效果都支持纯色、渐变或基于图像的样式
- **开关控件 (Toggle Controls)**: 用于轻松启用或禁用描边和阴影效果的开关

## 后续步骤

现在您已经熟悉了界面，请查看 [工作流程指南](../workflow-guide/)，获取创建您的第一个位图字体并针对特定用例进行优化的分步说明。