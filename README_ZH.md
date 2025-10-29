<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo 位图字体生成器" target="_blank">
    <img alt="SnowBamboo 标志" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">专业网络位图字体生成器</p>

<p align="center">
  <a href="https://snowb.org/">Web 应用</a> •
  <a href="https://snowb.org/zh-cn/docs/">文档</a> •
  <a href="README.md">English</a>
</p>

---

## 概述

SnowBamboo BMF 是一款免费的开源位图字体生成器，为游戏开发者和数字创意工作者设计。在浏览器中直接创建、编辑和导出专业级位图字体——无需安装、无需注册、无需云端上传。

**[立即尝试 snowb.org](https://snowb.org/)**

[![SnowBamboo 位图字体生成器预览](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### 核心优势

- **零配置启动** - 无需安装，数秒内开始创建
- **真正跨平台** - 在 Windows、Mac、Linux、ChromeOS 上表现一致
- **隐私优先** - 100% 本地处理，无追踪、无云端上传
- **生产级品质** - 先进的打包算法减少纹理内存占用 30-50%
- **完全兼容** - 原生支持 Unity、Unreal、Godot、Cocos2d、Phaser、PixiJS
- **向后兼容** - 从 Littera 导入并无缝迁移现有项目

## 核心功能

### 字体编辑与设计

- **实时预览** - 编辑时实时获得视觉反馈
- **高级排版** - 字偶对调整、字母间距、基线调整
- **专业效果** - 渐变色（线性/径向）、多层阴影、自定义描边
- **自定义字形** - 导入图像用于图标和特殊字符
- **灵活输入** - Unicode 块、自定义字符集
- **交互式画布** - 通过鼠标和键盘进行精确控制

### 文件格式支持

**导入** - `.sbf`、`.ltr`、`TTF/OTF/WOFF`

**导出** - [AngelCode 标准格式](https://www.angelcode.com/products/bmfont/doc/file_format.html) BMFont 文本/XML、`.fnt` 二进制、PNG 纹理图集

### 游戏引擎集成

原生支持所有主流引擎：Unity（TextMesh Pro/传统版）、Unreal Engine（Slate/UMG）、Godot、[Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html)、[Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text)/PixiJS，以及通过标准 BMFont 格式支持自定义引擎。

### 性能与架构

- **优化渲染** - React 19 与 Canvas API 以及用于复杂计算的 Web Workers
- **智能打包** - 通过 worker 池的 MaxRects、Guillotine 和 Shelf 算法
- **渐进式网络应用** - 离线工作，自动更新
- **类型安全** - 完整的 TypeScript 与严格模式、反应式 MobX 状态管理

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19、TypeScript 5.8+ |
| **构建工具** | Vite 7（优化打包） |
| **状态管理** | MobX 6（严格模式） |
| **UI 组件** | Material-UI v7、Emotion CSS-in-JS |
| **测试** | Vitest、React Testing Library |
| **图形** | Canvas API、Web Workers |
| **序列化** | Protocol Buffers（.sbf 格式） |
| **PWA** | Workbox 服务工作线程 |
| **监控** | Sentry（错误追踪与性能监控） |

## 快速开始

### 前置要求

- Node.js 18+ 以及 Yarn 包管理器

### 安装与开发

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

# 本地预览生产构建
yarn preview
```

## 开发指南

### 基本命令

```bash
# 开发
yarn start                    # 启动 Vite 开发服务器（端口 3000）
yarn test                     # 运行 Vitest 测试

# 代码质量
yarn lint                     # 运行 ESLint
yarn lint:fix                 # 自动修复代码检查问题
yarn lint:check               # 检查零警告
yarn format                   # 使用 Prettier 格式化

# 构建与部署
yarn build                    # 构建生产包
yarn build:all                # 完整构建流程（应用 + 文档 + 网站地图）
yarn preview                  # 本地预览生产构建
yarn deploy                   # 部署到 GitHub Pages

# 工具
yarn pb                       # 生成 Protocol Buffer 定义
yarn find-unused              # 查找未使用的文件
yarn find-unused:cleanup      # 删除未使用的文件
```

### 关键开发模式

详见 [CLAUDE.md](./CLAUDE.md) 了解详细的开发模式，包括：
- MobX 6 状态管理
- Protocol Buffer 架构版本控制
- Canvas 操作与工具函数
- 性能优化策略
- 代码质量标准（代码检查、格式化、测试）

## 许可证

本项目在 MIT 许可证下发布 - 详见 [LICENSE](LICENSE) 文件。
