<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo 位图字体生成器" target="_blank">
    <img alt="SnowBamboo Logo" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">现代化 Web 位图字体生成器</p>

<p align="center">
  <a href="https://snowb.org/">🌐 在线使用</a> •
  <a href="https://snowb.org/zh-cn/docs/">📚 使用文档</a> •
  <a href="README.md">English</a> •
  <a href="#特性">特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#开发指南">开发指南</a>
</p>

---

## 项目简介

SnowBamboo BMF 是一个基于现代 Web 技术构建的位图字体生成器。它为游戏、应用程序和数字媒体项目提供了创建、编辑和导出位图字体的完整解决方案。

**🎯 [立即体验 snowb.org](https://snowb.org/)**

[![SnowBamboo 位图字体生成器预览](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

## 特性

### 🎨 **高级字体编辑**
- 实时字体预览和编辑
- 多种字形生成模式
- 高级排版控制（字距、间距、基线）
- 支持渐变、阴影和特效
- 交互式画布编辑

### 🔄 **文件格式支持**
- **导入格式**: `.sbf` (SnowBamboo 原生格式)，`.ltr` (Littera 旧版文件)
- **字体资源**: TTF/OTF/WOFF 字体文件用于字形生成
- **导出格式**: 文本描述符、XML 格式、PNG 纹理图集
- 无缝迁移旧版工具

### ⚡ **性能与现代化架构**
- 基于 React 19 和 TypeScript 5.8+ 构建
- Vite 7 闪电般快速开发
- Web Workers 处理重计算
- 渐进式 Web 应用 (PWA) 功能
- MobX 6 实时状态管理

### 🛠 **开发者体验**
- 现代化构建工具和代码检查
- Vitest 完整测试套件
- Protocol Buffers 高效文件序列化
- Sentry 集成监控
- 热重载和即时反馈

## 技术栈

- **前端**: React 19, TypeScript 5.8+, Material-UI v7
- **构建工具**: Vite 7 优化打包
- **状态管理**: MobX 6 严格模式
- **样式**: Emotion CSS-in-JS, Material-UI 主题
- **测试**: Vitest, React Testing Library
- **图形**: Canvas API, Web Workers 打包算法
- **序列化**: Protocol Buffers (.sbf 格式)
- **PWA**: Workbox 服务工作者和缓存
- **监控**: Sentry 错误追踪和性能监控

## 快速开始

### 环境要求
- Node.js 18+ 和 Yarn 包管理器

### 安装

```bash
# 克隆仓库
git clone https://github.com/SilenceLeo/snowb-bmf.git
cd snowb-bmf

# 安装依赖
yarn install

# 启动开发服务器
yarn start
```

应用将在 `http://localhost:3000` 可用

### 生产构建

```bash
# 构建应用
yarn build

# 预览生产构建
yarn preview
```

## 开发指南

### 开发命令

```bash
# 开发
yarn start                    # 启动 Vite 开发服务器

# 代码质量
yarn lint                     # 运行 ESLint
yarn lint:fix                 # 自动修复代码检查问题
yarn format                   # 使用 Prettier 格式化代码

# 构建和部署
yarn build:all                # 完整构建流水线
yarn deploy                   # 部署到 GitHub Pages

# 实用工具
yarn pb                       # 生成 Protocol Buffer 定义
```

### 项目结构

```
src/
├── app/
│   ├── components/           # 可复用 UI 组件
│   ├── hooks/               # 自定义 React Hooks
│   ├── layout/              # 主要布局组件
│   └── theme/               # Material-UI 主题配置
├── file/
│   ├── conversion/          # 文件格式转换逻辑
│   └── export/              # 导出功能
├── store/
│   ├── base/                # MobX 存储模型
│   └── index.ts             # 存储配置
├── utils/                   # 实用函数和助手
└── workers/                 # Web Workers 重计算
```

### 架构亮点

- **状态管理**: MobX 6 单一工作区存储模式
- **文件格式**: 版本化 Protocol Buffer 模式，支持迁移
- **画布操作**: 优化的字体渲染和纹理图集生成
- **性能**: Web Workers 矩形打包算法
- **类型安全**: 严格的 TypeScript 配置和完整类型

## 文件格式支持

### 导入格式
- **`.sbf`** - SnowBamboo 原生格式（基于 Protocol Buffer）
- **`.ltr`** - Littera 旧版项目文件（自动转换）

### 字体资源
- **TTF/OTF/WOFF** - 字体文件用于字形生成（通过界面上传）

### 导出格式
- **文本描述符** - 人类可读的字体定义
- **XML 描述符** - 框架结构化 XML 格式
- **PNG 图集** - 多种打包算法优化的纹理图集

## 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
