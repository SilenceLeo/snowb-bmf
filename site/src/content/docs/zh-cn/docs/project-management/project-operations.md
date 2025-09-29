---
title: 管理位图字体项目
description: 学习如何创建、打开、保存和管理您的位图字体项目。高效处理多个项目并了解支持的文件格式。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "管理位图字体项目 - SnowB BMF 文档"
  "description": "SnowB BMF 项目管理完整指南：创建、打开、保存和管理位图字体项目，支持 .sbf 和 .ltr 文件格式。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "author":
    "@type": "Organization"
    "name": "SnowB BMF Team"
    "url": "https://snowb.org"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "articleSection": "Documentation"
  "keywords": ["项目管理", "位图字体", "文件操作", "保存项目", "打开项目", ".sbf 格式", ".ltr 格式", "SnowB BMF"]
  "mainEntity":
    "@type": "HowTo"
    "name": "如何管理位图字体项目"
    "description": "在 SnowB BMF 中创建、打开、保存和管理位图字体项目的分步说明"
    "step":
      - "@type": "HowToStep"
        "name": "创建新项目"
        "text": "点击主菜单中的新建按钮或双击项目选项卡栏的空白区域"
      - "@type": "HowToStep"
        "name": "打开现有项目"
        "text": "点击打开按钮以浏览并选择 .sbf 或 .ltr 项目文件"
      - "@type": "HowToStep"
        "name": "保存项目"
        "text": "点击保存项目按钮或按 Cmd/Ctrl+S 保存为 .sbf 文件"
      - "@type": "HowToStep"
        "name": "管理多个项目"
        "text": "使用选项卡在项目之间切换，双击选项卡名称进行重命名"
---

## 创建新项目

开始一个新的位图字体项目非常简单。当您启动应用程序时，会自动创建一个新项目。您还可以通过两种方式创建其他项目：

- 点击主菜单中的 **新建** 按钮。
- 双击项目选项卡栏的空白区域。

新项目会自动分配默认名称，如 `Unnamed`、`Unnamed-1` 等，您可以稍后重命名。

## 打开现有项目

您可以从本地文件系统打开项目。

### 如何打开
- 点击主菜单中的 **打开** 按钮，浏览并选择您的项目文件。

### 支持的文件格式
- **SnowB BMF 项目 (`.sbf`)**：此工具的原生格式，确保完全的数据兼容性。
- **Littera 项目 (`.ltr`)**：用于从旧版基于 Flash 的 Littera 工具导入项目。

## 保存您的项目

**重要提示：** 项目数据会临时存储在浏览器的内存中。**如果您刷新或关闭浏览器选项卡，将会丢失未保存的工作。** 请务必将项目保存到文件中以防数据丢失。

### 如何保存
1. 点击 **保存项目** 按钮或按 `Cmd/Ctrl+S`。
2. 在您的计算机上选择一个位置并输入文件名。
3. 项目将保存为 `.sbf` 文件，该文件使用 Protocol Buffers 进行高效存储。

## 管理多个项目

该工具支持同时处理多个项目。

### 在项目之间切换
- 只需单击相应的选项卡即可在打开的项目之间切换。
- 注意：必须始终至少保持一个项目处于打开状态。

### 重命名项目
1. 双击项目选项卡中的项目名称，使其可编辑。
2. 输入新名称，然后单击选项卡外部的任何位置以确认更改。
