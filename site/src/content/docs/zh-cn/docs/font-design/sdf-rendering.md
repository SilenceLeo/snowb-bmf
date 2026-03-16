---
title: "SDF 与 MSDF 渲染：面向游戏的可缩放距离场字体"
description: "使用 SnowB BMF 生成 SDF、PSDF、MSDF 和 MTSDF 位图字体。利用 msdfgen WASM 技术为 Unity、Godot、Unreal 创建分辨率无关的字体。免费在线工具。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "SDF 与 MSDF 渲染：面向游戏的可缩放距离场字体"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-15"
  "description": "使用 SnowB BMF 生成 SDF、PSDF、MSDF 和 MTSDF 位图字体。利用 msdfgen WASM 技术为 Unity、Godot、Unreal 创建分辨率无关的字体。"
  "keywords": ["SDF 字体生成器", "MSDF 位图字体", "有符号距离场", "msdfgen", "距离场纹理", "多通道 SDF", "MTSDF", "PSDF", "游戏字体渲染", "分辨率无关字体"]
  "author":
    "@type": "Person"
    "name": "SilenceLeo"
    "url": "https://github.com/SilenceLeo/"
  "publisher":
    "@type": "Organization"
    "name": "SnowB BMF"
    "url": "https://snowb.org"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
  "articleSection": "Font Design"
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://snowb.org/zh-cn/docs/font-design/sdf-rendering/"
  "teaches":
    - "什么是 SDF 渲染以及它的工作原理"
    - "SDF、PSDF、MSDF 和 MTSDF 模式之间的区别"
    - "如何配置距离场参数"
    - "如何在游戏引擎中使用 SDF 字体"
---

有符号距离场（Signed Distance Field，SDF）渲染是一种将每个像素到最近字形边缘的距离进行编码的技术，而不是存储字形的实际像素颜色。这使得字体可以缩放到任意大小，同时保持清晰锐利 —— 不像传统位图字体那样在放大时会出现像素化。

SnowB BMF 是一款**免费在线**位图字体生成器，支持多种 SDF 渲染模式，让您能够直接在浏览器中生成高质量、分辨率无关的位图字体。

:::caution
SDF 渲染目前是**实验性**功能。参数和行为可能会在未来版本中发生变化。
:::

## 什么是 SDF 渲染？

在标准位图字体中，每个字形都以固定分辨率的光栅化图像存储。放大这些图像会导致文本模糊或像素化。SDF 通过将每个像素编码为距离值来解决这个问题 —— 即该像素到最近字形边缘的距离。

在渲染时，游戏引擎使用着色器从这些距离值重建字形轮廓。由于距离场是平滑且连续的，因此文本在几乎任何缩放比例下都能保持清晰。这项技术被广泛应用于 Unity（TextMeshPro）、Godot 和 Unreal Engine 等现代游戏引擎中。

## SnowB BMF 中的 SDF 渲染模式

SnowB BMF 提供五种渲染模式。**Default** 模式生成标准位图字体，其余四种模式则生成不同类型的距离场纹理。

| 模式 | 通道数 | 实现方式 | 需要字体文件 |
| --- | --- | --- | --- |
| **Default** | RGBA | 标准 Canvas 渲染 | 否 |
| **SDF** | 单通道 | Felzenszwalb/Huttenlocher EDT（JS）或 msdfgen WASM | 否（WASM 需要字体文件） |
| **PSDF** | 单通道 | msdfgen WASM | 是 |
| **MSDF** | 多通道 (RGB) | msdfgen WASM | 是 |
| **MTSDF** | 多通道 (RGBA) | msdfgen WASM | 是 |

### SDF（有符号距离场）

基础 SDF 模式生成单通道距离场。SnowB BMF 为 SDF 生成提供两种管线：

- **纯 JavaScript（EDT）：** 使用 Felzenszwalb 和 Huttenlocher 的欧氏距离变换算法。无需上传字体文件即可使用 —— 它直接处理 Canvas 渲染的字形。
- **msdfgen WASM：** 当上传了字体文件时，可以使用 WASM 管线，直接处理字体的矢量轮廓，生成更高质量的结果。

### PSDF（伪 SDF）

PSDF 使用 msdfgen WASM 管线生成伪有符号距离场。它产生的单通道输出与 SDF 类似，但使用不同的距离计算方法。使用此模式必须上传字体文件。

### MSDF（多通道 SDF）

MSDF 将距离信息编码到三个颜色通道（RGB）中，从而保留了单通道 SDF 无法重现的尖角和精细细节。这是游戏开发中最流行的距离场格式，在质量和性能之间提供了极佳的平衡。需要上传字体文件。

### MTSDF（多通道 + 真实 SDF）

MTSDF 将 MSDF 的多通道方法与 Alpha 通道中的真实 SDF 相结合。这提供了两全其美的效果：来自 MSDF 的尖角保持和来自真实 SDF 的平滑抗锯齿。需要上传字体文件。

## 如何生成 SDF 字体

### 1. 上传字体文件

对于 PSDF、MSDF 和 MTSDF 模式，您必须先上传 TrueType（.ttf）或 OpenType（.otf）字体文件。前往**导入字体**页面加载您的字体。

> SDF 模式可以在不上传字体文件的情况下使用纯 JavaScript EDT 管线，但上传字体文件可以启用更高质量的 WASM 管线。

### 2. 选择渲染模式

在左侧边栏的**字体配置**面板中，找到**渲染配置**部分（标注为*实验性*）。从下拉菜单中选择您所需的渲染模式。

### 3. 配置参数

根据您的需求调整渲染参数。详细说明请参阅下方的[配置参数](#配置参数)部分。

### 4. 导出字体

对预览效果满意后，使用标准导出工作流导出您的字体。SDF 字体以 PNG 纹理图集及对应的 BMFont 描述文件导出。对于 MSDF/MTSDF，还提供 MSDF Atlas JSON 格式 —— 详见[导出格式](/zh-cn/docs/project-management/export-formats/)。

## 配置参数

### 距离范围（Distance Range）

距离范围定义了距离场从字形边缘向外延伸的距离（以像素为单位）。较大的范围可以产生更平滑的缩放效果，但需要在每个字形周围留出更多的填充空间。

- **最小值：** 1
- **步进：** 1
- **常用值：** 4–8 适用于大多数情况；更高的值（16+）适用于需要极端缩放的字体

### SDF 通道选项

仅在 **SDF** 模式下可用。控制距离场如何映射到输出纹理通道：

| 选项 | 说明 |
| --- | --- |
| **White/Black** | 字形内部白色，外部黑色 |
| **Black/White** | 字形内部黑色，外部白色 |
| **White/Alpha** | 白色字形，距离信息在 Alpha 通道中 |
| **Black/Alpha** | 黑色字形，距离信息在 Alpha 通道中 |

请选择与您游戏引擎着色器要求匹配的选项。

### WASM 管线参数

使用 msdfgen WASM 管线时可用这些参数（PSDF、MSDF、MTSDF，以及上传了字体文件的 SDF）。

#### 重叠支持（Overlap Support）

启用对字体字形中重叠轮廓的处理。如果您的字体包含具有自重叠路径的字形，请开启此选项 —— 这在复杂文字和装饰性字体中很常见。

#### 扫描线处理（Scanline Pass）

启用额外的基于扫描线的校正处理，以修复距离场输出中的潜在伪影。

#### 填充规则（Fill Rule）

仅在**扫描线处理**启用时可用。决定如何填充重叠路径：

- **Non-Zero（非零环绕规则）：** 默认的环绕规则。如果环绕数不为零，则该点位于字形内部。
- **Even-Odd（奇偶规则）：** 如果一个点被奇数条轮廓线包围，则该点位于字形内部。

### MSDF 专属参数

这些参数仅在 **MSDF** 和 **MTSDF** 模式下可用。

#### 角度阈值（Angle Threshold）

控制多通道边缘着色中检测角点的最小角度（以弧度为单位）。

- **范围：** 0.5 到 π（约 3.14159）
- **步进：** 0.1
- **默认值：** 3（约 171.9°）

较低的值会检测到更多角点，产生更锐利的特征，但可能会出现更多伪影。

#### 着色策略（Coloring Strategy）

决定如何将边缘分配到各颜色通道：

| 策略 | 说明 |
| --- | --- |
| **Simple** | 标准边缘着色算法，适用于大多数字体。 |
| **Ink Trap** | 针对具有墨水陷阱的字体进行优化（常见于衬线字体）。 |
| **Distance** *（实验性）* | 使用基于距离的着色方式，对于某些字形形状可能产生更好的效果。 |

#### 边缘着色种子值（Edge Coloring Seed）

边缘着色算法随机数生成器的种子值。更改此值有时可以解决着色伪影问题。

- **最小值：** 0
- **步进：** 1

#### 误差校正（Error Correction）

控制应用于 MSDF 输出的后处理误差校正：

| 模式 | 说明 |
| --- | --- |
| **Off** | 不进行误差校正。最快但可能有伪影。 |
| **Edge Priority** | 在优先保证边缘准确性的同时校正错误。推荐用于大多数场景。 |
| **Indiscriminate** | 积极校正所有检测到的错误。在某些情况下可能会过度校正。 |

## 我应该选择哪种 SDF 模式？

| 模式 | 通道数 | 保留尖角 | 质量 | 速度 | 最佳用途 |
| --- | --- | --- | --- | --- | --- |
| **SDF** | 1 | 否 | 良好 | 快 | 简单字体、大号文本、UI 元素 |
| **PSDF** | 1 | 否 | 良好 | 中等 | 需要字体文件精度的 SDF 替代方案 |
| **MSDF** | 3 (RGB) | 是 | 优秀 | 中等 | 大多数游戏字体 —— 行业标准 |
| **MTSDF** | 4 (RGBA) | 是 | 最佳 | 较慢 | 同时需要尖角保持和平滑抗锯齿的高保真字体 |

**一般建议：** 大多数游戏开发场景推荐使用 **MSDF**。它提供了质量和兼容性之间的最佳平衡。如果您只需要简单的大比例文本渲染，或者没有字体文件可上传，请使用 **SDF**。

## 导出 SDF 字体

SDF 字体使用与标准位图字体相同的工作流导出。纹理图集（PNG）包含距离场数据，描述文件包含字形度量信息。

对于 **MSDF** 和 **MTSDF** 模式，SnowB BMF 还支持 **MSDF Atlas JSON** 导出格式，该格式与基于 msdf-atlas-gen 的工作流兼容。所有可用格式请参阅[导出格式](/zh-cn/docs/project-management/export-formats/)。

## 在游戏引擎中使用 SDF 字体

### Unity (TextMeshPro)

TextMeshPro 原生支持 SDF 字体。将导出的 PNG 纹理和 BMFont 描述文件导入到 Unity 项目中，然后从导入的数据创建 TextMeshPro Font Asset。TextMeshPro 的着色器将自动处理距离场渲染。

### Godot

Godot 4 通过其内置的文本渲染管线支持 SDF 字体渲染。导入 SDF 纹理图集并将字体资源配置为使用 SDF 着色器。对于 MSDF 字体，请确保在字体导入设置中选择多通道距离场选项。

### Unreal Engine

Unreal Engine 通过其 Slate UI 框架和 UMG 支持距离场字体。导入导出的纹理并创建引用 SDF 纹理的字体面资产。配置材质以使用 SDF 兼容的着色器来实现正确的渲染。
