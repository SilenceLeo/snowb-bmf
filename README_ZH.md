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

<p align="center">
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/SilenceLeo/snowb-bmf"></a>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/SilenceLeo/snowb-bmf">
</p>

---

## 概述

SnowBamboo BMF 是一款免费的开源位图字体生成器，为游戏开发者和数字创意工作者设计。在浏览器中直接创建、编辑和导出专业级位图字体——无需安装、无需注册、无需云端上传。支持 SDF/MSDF 渲染，实现现代游戏引擎中分辨率无关的文本显示。

**[立即尝试 snowb.org](https://snowb.org/)**

[![SnowBamboo 位图字体生成器预览](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### 核心优势

- **零配置启动** - 无需安装，数秒内开始创建
- **真正跨平台** - 在 Windows、Mac、Linux、ChromeOS 上表现一致
- **隐私优先** - 100% 本地处理，无追踪、无云端上传
- **生产级品质** - 先进的打包算法减少纹理内存占用 30-50%
- **SDF/MSDF 支持** - 通过 msdfgen WASM 集成实现分辨率无关的渲染
- **多项目工作区** - 标签式界面同时管理多个字体项目
- **完全兼容** - 原生支持 Unity、Unreal、Godot、Cocos2d、Phaser、PixiJS
- **向后兼容** - 从 Littera 导入并无缝迁移现有项目

## 核心功能

### 字体编辑与设计

- **实时预览** - 编辑时实时获得视觉反馈，支持文本预览模式
- **高级排版** - 字偶对调整、字母间距、基线调整、逐字形度量编辑
- **专业填充** - 纯色、渐变色（线性/径向）含 10 种内置预设、图像/图案纹理
- **高级描边** - 宽度、位置（外部/中间/内部）、线帽/线接选项，支持纯色/渐变/图像填充
- **多层阴影** - 可配置的阴影效果
- **自定义字形** - 拖拽导入图像用于图标和特殊字符，从文件名自动映射字符
- **多项目工作区** - 标签式界面管理多个字体项目，双击创建/重命名
- **灵活输入** - Unicode 块、自定义字符集
- **交互式画布** - 空格+拖拽平移，Ctrl+滚轮缩放（25%–1000%），预览模式切换
- **字体清晰度** - 可调节的渲染清晰度控制

### SDF/MSDF 渲染

- **5 种渲染模式** - SDF、PSDF、MSDF、MTSDF 和标准位图
- **msdfgen 集成** - 通过 Emscripten 编译为 WASM，实现原生速度的距离场生成
- **可配置参数** - 距离范围、角度阈值、着色策略（Simple/Ink Trap/Distance）、错误校正、填充规则、重叠支持
- **通道模式** - White/Black、Black/White、White/Alpha、Black/Alpha 输出选项
- **分辨率无关** - 在支持 SDF 着色器的游戏引擎中任意缩放都保持锐利

### 文件格式支持

**导入** - `.sbf`、`.ltr`、`TTF/OTF/WOFF/TTC`

**导出** - [AngelCode 标准格式](https://www.angelcode.com/products/bmfont/doc/file_format.html) BMFont 文本、XML、二进制、JSON、C 头文件、PNG 纹理图集、MSDF Atlas JSON

### 游戏引擎集成

原生支持所有主流引擎：Unity（TextMesh Pro/传统版）、Unreal Engine（Slate/UMG）、Godot、[Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html)、[Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text)/PixiJS，以及通过标准 BMFont 格式支持自定义引擎。

### 性能与架构

- **优化渲染** - React 19 与 Canvas API 以及用于复杂计算的 Web Workers
- **智能打包** - 通过 worker 池的 MaxRects、Guillotine 和 Shelf 算法；自动/固定/自适应模式，支持多页
- **渐进式网络应用** - 离线工作，应用内更新通知和自动版本检测
- **类型安全** - 完整的 TypeScript 与严格模式、反应式 Legend State v2

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19、TypeScript 5.8+ |
| **构建工具** | Vite 7（优化打包） |
| **状态管理** | Legend State v2 |
| **UI 组件** | Material-UI v7、Emotion CSS-in-JS |
| **WASM** | msdfgen（SDF/MSDF 生成）、FreeType（字体解析） |
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

### 项目架构

- **状态管理** — Legend State v2 可观察对象（`src/store/legend/`）
- **纹理打包** — Web Worker 池与 MaxRects/Guillotine 算法（`src/utils/PackingEngine.ts`）
- **持久化** — 通过 Dexie 使用 IndexedDB，Protocol Buffers 用于项目序列化
- **SDF 生成** — msdfgen 通过 Emscripten 编译为 WASM
- **代码质量** — ESLint 9 扁平配置、Prettier 导入排序、Husky 预提交钩子

## 许可证

本项目在 MIT 许可证下发布 - 详见 [LICENSE](LICENSE) 文件。

本项目使用了第三方开源库，详见 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) 完整的许可证信息。

## 致谢

- [msdfgen](https://github.com/Chlumsky/msdfgen)（Viktor Chlumsky）— 多通道有符号距离场生成器
- [FreeType](https://www.freetype.org) — 字体渲染库
- [opentype.js](https://github.com/opentypejs/opentype.js)（Frederik De Bleser）— OpenType 和 TrueType 字体解析库
