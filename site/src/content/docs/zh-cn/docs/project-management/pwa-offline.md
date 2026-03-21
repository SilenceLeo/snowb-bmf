---
title: PWA 离线与更新：随时随地工作，保持最新版本
description: 了解 SnowB BMF 如何作为渐进式 Web 应用离线工作、自动更新如何保持工具最新，以及如何手动检查新版本。
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "PWA 离线与更新 - SnowB BMF 文档"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "SnowB BMF 渐进式 Web 应用功能完整指南：离线使用、自动更新、手动检查更新和通知状态。"
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
    "name": "SnowB"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/project-management/pwa-offline/"
  "audience":
    "@type": "Audience"
    "audienceType": "游戏开发者和 Web 开发者"
  "teaches":
    - "如何离线使用 SnowB BMF"
    - "应用更新的工作原理"
    - "如何手动检查更新"
    - "了解 PWA 离线功能"
  "articleSection": "Documentation"
  "keywords": ["PWA", "渐进式 Web 应用", "离线", "Service Worker", "应用更新", "位图字体工具", "SnowB BMF", "离线优先", "Web 应用"]
  "mainEntity":
    "@type": "HowTo"
    "name": "如何离线使用 SnowB BMF 并管理更新"
    "description": "使用 SnowB BMF 离线工作和保持应用更新的分步指南"
    "step":
      - "@type": "HowToStep"
        "name": "加载应用"
        "text": "在浏览器中打开 SnowB BMF。Service Worker 会在首次加载时自动缓存所有应用资源。"
      - "@type": "HowToStep"
        "name": "确认离线就绪"
        "text": "在屏幕左下角查看 'App is ready for offline use' 成功通知。"
      - "@type": "HowToStep"
        "name": "离线工作"
        "text": "缓存完成后，无需网络连接即可使用 SnowB BMF。所有功能在本地运行，数据存储在 IndexedDB 中。"
      - "@type": "HowToStep"
        "name": "有可用更新时进行更新"
        "text": "当检测到新版本时，点击通知中的 Update 按钮进行更新。"
---

## 离线功能

SnowB BMF 是一款渐进式 Web 应用 (PWA)，首次访问后即可完全离线工作。**Service Worker** 会自动缓存所有应用资源 — HTML、CSS、JavaScript、字体和图标 — 因此您无需网络连接即可创建和编辑位图字体。

### 离线模式工作原理

1. **首次访问**：浏览器通过 Service Worker 下载并缓存所有应用文件。
2. **离线就绪通知**：屏幕左下角显示绿色成功通知：**"App is ready for offline use"**。该通知会在 5 秒后自动消失。
3. **后续访问**：应用完全从本地缓存加载，无论网络是否可用。

### 本地数据存储

所有项目数据存储在浏览器的 **IndexedDB** 数据库中，而非远程服务器。这意味着：

- 您的字体和项目始终在本地可用。
- 不会向外部服务器发送或存储任何数据。
- 项目在浏览器会话之间持久保存（除非清除浏览器数据）。

有关数据持久化的更多详情，请参阅[项目管理](/zh-cn/docs/project-management/project-operations/)。

## 应用更新

当您在线且 SnowB BMF 发布新版本时，Service Worker 会自动检测。更新过程设计为非侵入式 — 由您选择何时应用更新。

### 自动更新检测

Service Worker 在后台检查新版本。当发现新版本时，您将看到引导您完成更新流程的通知：

1. **更新下载中**：显示带有刷新图标的信息通知：新版本正在后台下载。
2. **更新就绪**：显示警告通知：**"New version available, click update to experience now"**，附带 **Update** 按钮。
3. **应用更新**：点击 **Update** 进行更新。更新过程中显示加载指示器和 **"Updating to new version..."**。
4. **更新完成**：页面自动刷新，加载新版本。

### 更新失败

如果更新失败，会显示错误通知和 **Retry** 按钮。点击 **Retry** 重新尝试更新。如果问题持续存在，请尝试刷新页面或清除浏览器缓存。

## 手动检查更新

您也可以随时手动检查更新。

### 如何检查

1. 通知面板显示 **"Check for Updates"** 按钮。
2. 点击触发手动检查。检查期间显示加载动画。
3. 如果发现新版本，将如上所述显示更新通知。
4. 如果没有新版本，通知会在 2 秒后自动关闭。
5. 通知显示 **"Last checked: {time}"**，展示您上次检查的时间。

### 检查失败

如果手动检查失败（例如网络问题），会显示错误通知：**"Failed to check for updates"**，附带 **Retry** 按钮。

## 通知状态参考

SnowB BMF 使用屏幕左下角的彩色通知来展示 Service Worker 和更新状态：

| 状态 | 级别 | 图标 | 消息 | 操作 |
|------|------|------|------|------|
| 离线就绪 | 成功（绿色） | 对勾 | "App is ready for offline use" | 5 秒后自动消失 |
| 更新下载中 | 信息（蓝色） | 刷新 | 正在下载新版本 | 无（自动进行） |
| 更新就绪 | 警告（黄色） | 更新箭头 | "New version available, click update to experience now" | **Update** 按钮 |
| 更新中 | 警告（黄色） | 加载动画 | "Updating to new version..." | 更新期间按钮禁用 |
| 更新失败 | 错误（红色） | 错误图标 | 错误信息 | **Retry** 按钮 |
| 检查失败 | 错误（红色） | 错误图标 | "Failed to check for updates" | **Retry** 按钮 |

所有通知都可以通过点击关闭 (X) 按钮手动关闭，但在通知区域外点击（clickaway）不会关闭通知。

## 相关主题

- [项目管理](/zh-cn/docs/project-management/project-operations/)
