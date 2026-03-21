---
title: 快捷键与画布导航
description: 掌握 SnowB BMF 键盘快捷键、画布平移与缩放控制，利用快捷键和手势加速位图字体编辑工作流。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "name": "SnowB BMF 快捷键与画布导航"
  "headline": "SnowB BMF 快捷键与画布导航指南"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "SnowB BMF 键盘快捷键、画布平移与缩放控制、触控板手势和缩放预设的完整参考。涵盖位图字体编辑器中项目管理和画布导航的所有快捷键。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "基于浏览器的游戏开发位图字体生成器"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "articleSection": "快捷键文档"
  "keywords": ["键盘快捷键", "画布导航", "缩放控制", "位图字体编辑器", "快捷键", "平移缩放", "SnowB BMF", "触控板手势", "画布平移"]
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
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/getting-started/keyboard-shortcuts/"
  "teaches":
    - "如何使用 Space + 拖拽平移画布"
    - "如何使用 Ctrl/Cmd + 滚轮缩放"
    - "如何使用缩放预设和缩放滑块"
    - "项目管理的全局快捷键"
    - "触控板与鼠标导航的区别"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
---

SnowB BMF 的所有快捷键、鼠标手势和缩放控制都在这里。

## 全局快捷键

这些快捷键在应用任何地方都能用。

| 操作 | Windows / Linux | macOS |
|------|----------------|-------|
| 新建项目 | `Alt+N` 或 `Ctrl+N` | `Alt+N` 或 `Ctrl+N` |
| 保存项目 (.sbf) | `Ctrl+S` | `Cmd+S` |
| 导出位图字体 | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| 退出图片字形全屏模式 | `Escape` | `Escape` |
| 创建新项目（标签栏） | 双击空白区域 | 双击空白区域 |

## 画布导航

Pack 视图和 Preview 视图各自有独立的平移和缩放状态，调一个不影响另一个。

### 平移（Space + 拖拽）

按住 **Space** 拖鼠标就能平移画布。光标会跟着变：

1. **默认光标** -- 正常编辑模式
2. **手型光标（张开）** -- Space 按下了，准备平移
3. **手型光标（抓取）** -- Space 按下且鼠标按住，正在平移

松开 Space 或鼠标就停止平移。

### 缩放（滚轮）

| 输入 | 操作 |
|------|------|
| `Ctrl` + 滚轮 (Windows/Linux) | 放大 / 缩小 |
| `Cmd` + 滚轮 (macOS) | 放大 / 缩小 |
| 滚轮（垂直滚动） | 垂直平移 |
| 滚轮（水平滚动） | 水平平移 |
| `Alt` + 滚轮 | 水平平移（仅限鼠标滚轮） |

SnowB BMF 自动识别你用的是**触控板**还是**鼠标滚轮**，灵敏度不一样：

- **触控板**：1:1 直接响应，平滑精细
- **鼠标滚轮**：加了阻尼，不会一下缩太多

### 缩放控制（底部控制栏）

底部控制栏可以精确调缩放：

- **缩放滑块** -- 拖动调整，范围 0.01x（1%）到 10x（1000%）
- **缩放百分比按钮** -- 点击打开预设菜单
- **缩放预设** -- 快速跳到：25%、50%、75%、100%、125%、150%、500%、1000%

显示的百分比是当前活动视图（Pack 或 Preview）的缩放级别。

## 导航技巧

- **快速重置**：缩放菜单里选 **100%**，回到默认缩放。
- **大型纹理**：先缩到 25% 或 50% 看整体，再放大看单个字形。
- **精确定位**：Space+拖拽配合 Ctrl/Cmd+滚轮缩放，快速定位到纹理图集的任意位置。

## 相关主题

- [界面指南](/zh-cn/docs/getting-started/interface-guide/) -- SnowB BMF 完整工作区布局概览
- [工作流指南](/zh-cn/docs/getting-started/workflow-guide/) -- 创建位图字体的分步教程
