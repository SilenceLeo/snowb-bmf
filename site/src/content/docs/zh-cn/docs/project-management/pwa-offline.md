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

SnowB BMF 是渐进式 Web 应用 (PWA)，第一次访问后就能离线用。**Service Worker** 自动缓存所有应用资源（HTML、CSS、JavaScript、字体和图标），断网也能创建和编辑位图字体。

### 离线模式怎么工作

1. **第一次访问**：浏览器通过 Service Worker 下载并缓存所有文件。
2. **离线就绪通知**：屏幕左下角弹出绿色通知：**"App is ready for offline use"**，5 秒后自动消失。
3. **之后再访问**：应用从本地缓存加载，有没有网都一样。

### 本地数据存储

所有项目数据存在浏览器 **IndexedDB** 里，不会发到任何服务器。

- 字体和项目一直在本地。
- 不会给外部服务器发数据。
- 项目跨会话保留（清浏览器数据除外）。

数据持久化详情见[项目管理](/zh-cn/docs/project-management/project-operations/)。

## 应用更新

有网的时候 SnowB BMF 发了新版本，Service Worker 自动检测。更新不会打断你的工作，你来决定什么时候更新。

### 自动更新检测

Service Worker 在后台检查新版本。有新版本时通知会引导你：

1. **更新下载中**：蓝色通知带刷新图标，新版本在后台下载。
2. **更新就绪**：黄色通知：**"New version available, click update to experience now"**，带 **Update** 按钮。
3. **应用更新**：点 **Update** 开始更新，显示加载动画和 **"Updating to new version..."**。
4. **更新完成**：页面自动刷新，加载新版本。

### 更新失败

更新失败会弹红色通知和 **Retry** 按钮。点 **Retry** 重试。还是不行的话，刷新页面或清浏览器缓存。

## 手动检查更新

随时可以手动检查。

### 如何检查

1. 通知面板有 **"Check for Updates"** 按钮。
2. 点一下就开始检查，会显示加载动画。
3. 有新版本的话，弹更新通知。
4. 没有新版本，通知 2 秒后自动关闭。
5. 通知上显示 **"Last checked: {time}"**，是你上次检查的时间。

### 检查失败

检查失败（比如没网），弹错误通知：**"Failed to check for updates"**，带 **Retry** 按钮。

## 通知状态参考

屏幕左下角的彩色通知显示 Service Worker 和更新状态：

| 状态 | 级别 | 图标 | 消息 | 操作 |
|------|------|------|------|------|
| 离线就绪 | 成功（绿色） | 对勾 | "App is ready for offline use" | 5 秒后自动消失 |
| 更新下载中 | 信息（蓝色） | 刷新 | 正在下载新版本 | 无（自动进行） |
| 更新就绪 | 警告（黄色） | 更新箭头 | "New version available, click update to experience now" | **Update** 按钮 |
| 更新中 | 警告（黄色） | 加载动画 | "Updating to new version..." | 更新期间按钮禁用 |
| 更新失败 | 错误（红色） | 错误图标 | 错误信息 | **Retry** 按钮 |
| 检查失败 | 错误（红色） | 错误图标 | "Failed to check for updates" | **Retry** 按钮 |

所有通知都能点关闭 (X) 按钮手动关掉，但点通知区域外面不会关闭。

## 相关主题

- [项目管理](/zh-cn/docs/project-management/project-operations/)
