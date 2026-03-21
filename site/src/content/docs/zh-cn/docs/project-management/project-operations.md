---
title: 项目管理：创建、保存和组织字体项目
description: 学习如何创建、打开、保存和管理您的位图字体项目。高效处理多个项目并了解支持的文件格式。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "管理位图字体项目 - SnowB BMF 文档"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "SnowB BMF 项目管理完整指南：创建、打开、保存和管理位图字体项目，支持 .sbf 和 .ltr 文件格式。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "inLanguage": "zh-CN"
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

打开应用就会自动建一个新项目。也可以手动创建：

- 点主菜单的 **新建** 按钮。
- 双击项目选项卡栏空白区域。

新项目默认叫 `Unnamed`、`Unnamed-1`，之后可以改名。

## 打开现有项目

### 如何打开
- 点主菜单的**打开**按钮，选项目文件。

### 支持的文件格式
- **SnowB BMF 项目 (`.sbf`)**：原生格式，完全兼容。
- **Littera 项目 (`.ltr`)**：旧版 Flash Littera 工具的格式。

## 保存项目

**注意：** SnowB BMF 会自动把项目存到浏览器 IndexedDB，但建议同时存一份 `.sbf` 文件做备份。浏览器数据清除、换设备、存储空间满了都可能丢数据。

### 如何保存
1. 点 **保存项目** 按钮或按 `Cmd/Ctrl+S`。
2. 选个位置，输入文件名。
3. 项目存为 `.sbf` 文件，用 Protocol Buffers 编码，体积小。

## 自动持久化

SnowB BMF 自动把所有项目存到浏览器 **IndexedDB** 里，意外刷新或浏览器崩溃不会丢工作。

### 工作原理

- **自动触发**：离开页面（`beforeunload`）或切到别的标签页时就会保存。
- **高效存储**：用 Protocol Buffers 序列化，体积小。
- **多项目支持**：工作区里所有打开的项目都会自动保存和恢复。

### 注意事项

- **清除浏览器数据**会丢失已保存项目。重要项目记得留 `.sbf` 备份。
- **隐私/无痕模式**下自动保存可能不持久。
- 保存的项目绑定当前浏览器和配置文件，不会跨浏览器或设备同步。

## 管理多个项目

用**选项卡工作区**管理所有项目。每个选项卡有独立的字体设置、字符集和样式。

- **创建项目**：点**新建**或双击选项卡栏空白区域。
- **关闭项目**：点选项卡上的关闭 (x) 图标。至少保留一个项目。
- **项目隔离**：各项目改动互不影响。

### 切换项目
- 点对应选项卡就行。至少要保留一个项目。

### 重命名项目
1. 双击选项卡中的项目名称。
2. 输入新名称，点选项卡外任意位置确认。

## 相关主题

- [导出格式](/zh-cn/docs/project-management/export-formats/)
