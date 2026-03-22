<p align="center">
  <a href="https://snowb.org/" title="SnowBamboo 位图字体生成器" target="_blank">
    <img alt="SnowBamboo 标志" src="./public/logo192.png?raw=true" width="120" height="120" style="margin-bottom: 10px;">
  </a>
</p>

<h1 align="center">SnowBamboo BMF</h1>
<p align="center">专业在线位图字体生成器</p>

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

SnowBamboo BMF 是一款免费开源的位图字体生成器，面向游戏开发者和数字创意工作者。在浏览器中直接创建、编辑和导出位图字体，无需安装，无需注册，数据不离开本地。内置 SDF/MSDF 渲染，文本在游戏引擎中缩放不失真。

**[立即尝试 snowb.org](https://snowb.org/)**

[![SnowBamboo 位图字体生成器预览](https://github.com/SilenceLeo/snowb-bmf/assets/4632034/182efea8-6254-4bb7-80a1-1d4c3be1e928)](https://snowb.org/)

### 核心优势

- **零配置** — 打开浏览器就能用
- **跨平台** — Windows、Mac、Linux、ChromeOS 表现一致
- **隐私优先** — 所有处理在本地完成，不采集数据，不上传文件
- **纹理优化** — 打包算法减少 30%–50% 的纹理内存占用
- **SDF/MSDF** — 集成 msdfgen WASM，文本缩放不失真
- **多项目工作区** — 标签式界面，同时打开多个字体项目
- **引擎兼容** — 直接用于 Unity、Unreal、Godot、Cocos2d、Phaser、PixiJS
- **Littera 迁移** — 导入 `.ltr` 文件，直接迁移老项目

## 核心功能

### 字体编辑与设计

- **实时预览** — 所见即所得，支持文本预览模式
- **排版控制** — 字偶间距、字母间距、基线、逐字形度量均可调整
- **填充样式** — 纯色、渐变（线性/径向，10 种预设）、图像纹理
- **描边样式** — 宽度、位置（外/中/内）、线帽/线连，填充同样支持纯色/渐变/图像
- **阴影效果** — 多层阴影，参数可调
- **自定义字形** — 拖入图像作为图标或特殊字符，文件名自动映射字符编码
- **多项目管理** — 标签式界面，双击创建或重命名项目
- **字符输入** — Unicode 块选择、自定义字符集
- **画布操作** — 空格 + 拖拽平移，Ctrl + 滚轮缩放（25%–1,000%）
- **渲染清晰度** — 字体渲染锐度可调

### SDF/MSDF 渲染

- **五种模式** — SDF、PSDF、MSDF、MTSDF、标准位图
- **msdfgen WASM** — Emscripten 编译，距离场生成速度接近原生
- **参数可调** — 距离范围、角度阈值、着色策略（Simple/Ink Trap/Distance）、错误校正、填充规则
- **通道输出** — White/Black、Black/White、White/Alpha、Black/Alpha
- **缩放不失真** — 引擎支持 SDF 着色器即可任意缩放

### 文件格式支持

**导入：**`.sbf`、`.ltr`、`TTF/OTF/WOFF/TTC`

**导出：**[AngelCode BMFont](https://www.angelcode.com/products/bmfont/doc/file_format.html) 文本、XML、二进制、JSON、C 头文件、PNG 纹理图集、MSDF Atlas JSON

### 游戏引擎集成

导出文件可直接用于 Unity（TextMesh Pro / 传统版）、Unreal Engine（Slate / UMG）、Godot、[Cocos2d/Creator](https://docs.cocos.com/creator/3.8/manual/en/asset/font.html)、[Phaser 3](https://docs.phaser.io/phaser/concepts/gameobjects/bitmap-text) / PixiJS。标准 BMFont 格式，自定义引擎也能直接读取。

### 性能与架构

- **渲染** — React 19 + Canvas API，重计算走 Web Workers
- **打包** — Worker 池并行执行 MaxRects / Guillotine / Shelf 算法，自动/固定/自适应三种模式，支持多页
- **PWA** — 离线可用，应用内提示更新
- **类型安全** — TypeScript 严格模式 + Legend State v2 响应式状态管理

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
| **PWA** | Workbox Service Worker |
| **监控** | Sentry（错误追踪与性能监控） |

## 快速开始

### 前置要求

- Node.js 18+ 及 Yarn 包管理器

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

应用将在 `http://localhost:3000` 上运行

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
- **持久化** — 基于 Dexie 的 IndexedDB 存储，使用 Protocol Buffers 进行项目序列化
- **SDF 生成** — msdfgen 通过 Emscripten 编译为 WASM
- **代码质量** — ESLint 9 扁平配置、Prettier 导入排序、Husky 预提交钩子

## 许可证

MIT 许可证，见 [LICENSE](LICENSE)。

第三方库许可证见 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)。

## 致谢

- [msdfgen](https://github.com/Chlumsky/msdfgen)（Viktor Chlumsky）— 多通道有符号距离场生成器
- [FreeType](https://www.freetype.org) — 字体渲染库
- [fontkit](https://github.com/foliojs/fontkit)（Devon Govett）— 高级字体引擎，支持 OpenType、TrueType、WOFF、WOFF2 和 TTC 格式
