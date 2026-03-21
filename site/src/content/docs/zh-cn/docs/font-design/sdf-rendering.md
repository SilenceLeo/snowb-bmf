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

有符号距离场（SDF）渲染不存字形的像素颜色，而是把每个像素到字形边缘的距离编码到纹理里。这样字体放大缩小都不会糊，始终清晰。

SnowB BMF 支持多种 SDF 模式，直接在浏览器里就能生成分辨率无关的位图字体。

:::caution
SDF 渲染目前是**实验性**功能。参数和行为后续版本可能会变。
:::

## 什么是 SDF 渲染？

普通位图字体的字形是固定分辨率的图像，放大了就糊。SDF 把每个像素存成到最近字形边缘的距离值。

渲染时游戏引擎用着色器从距离值重建字形轮廓。距离场是平滑连续的，所以文本在几乎任何缩放下都很清晰。Unity（TextMeshPro）、Godot、Unreal Engine 都在用这个技术。

## SDF 渲染模式

五种模式。**Default** 是标准位图字体，另外四种生成距离场纹理。

| 模式 | 通道数 | 实现方式 | 需要字体文件 |
| --- | --- | --- | --- |
| **Default** | RGBA | 标准 Canvas 渲染 | 否 |
| **SDF** | 单通道 | Felzenszwalb/Huttenlocher EDT（JS）或 msdfgen WASM | 否（WASM 需要字体文件） |
| **PSDF** | 单通道 | msdfgen WASM | 是 |
| **MSDF** | 多通道 (RGB) | msdfgen WASM | 是 |
| **MTSDF** | 多通道 (RGBA) | msdfgen WASM | 是 |

### SDF（有符号距离场）

基础模式，生成单通道距离场，两种管线可选：

- **纯 JavaScript（EDT）：** Felzenszwalb 和 Huttenlocher 的欧氏距离变换。不需要字体文件，直接处理 Canvas 渲染的字形。
- **msdfgen WASM：** 上传字体文件后可用，直接处理矢量轮廓，质量更高。

### PSDF（伪 SDF）

用 msdfgen WASM 生成伪有符号距离场。单通道输出跟 SDF 像，但距离计算方式不一样。要上传字体文件。

### MSDF（多通道 SDF）

距离信息编码到 RGB 三个通道里，能保留单通道 SDF 做不出来的尖角和精细细节。游戏开发里最常用的距离场格式，质量和性能都不错。要上传字体文件。

### MTSDF（多通道 + 真实 SDF）

MSDF 的多通道方法加上 Alpha 通道里的真实 SDF。尖角保持和平滑抗锯齿兼得。要上传字体文件。

## 如何生成 SDF 字体

### 1. 上传字体文件

PSDF、MSDF、MTSDF 要先上传 TrueType（.ttf）或 OpenType（.otf）字体文件。到**导入字体**页面加载。

> SDF 模式不上传字体文件也能跑纯 JavaScript EDT 管线，但上传后能用质量更高的 WASM 管线。

### 2. 选择渲染模式

左侧边栏**字体配置**面板的**渲染配置**部分（标了*实验性*），下拉菜单里选。

### 3. 配置参数

按需调参数，详见下方[配置参数](#配置参数)。

### 4. 导出字体

预览没问题就导出。SDF 字体输出 PNG 纹理图集和 BMFont 描述文件。MSDF/MTSDF 还支持 MSDF Atlas JSON 格式，详见[导出格式](/zh-cn/docs/project-management/export-formats/)。

## 配置参数

### 距离范围（Distance Range）

距离场从字形边缘向外延伸多少像素。范围大了缩放更平滑，但字形需要更多填充空间。

- **最小值：** 1
- **步进：** 1
- **常用值：** 4–8 够用；16+ 用于极端缩放

### SDF 通道选项

只在 **SDF** 模式下可用，控制距离场映射到哪个输出通道：

| 选项 | 说明 |
| --- | --- |
| **White/Black** | 字形内白色，外部黑色 |
| **Black/White** | 字形内黑色，外部白色 |
| **White/Alpha** | 白色字形，距离信息存 Alpha 通道 |
| **Black/Alpha** | 黑色字形，距离信息存 Alpha 通道 |

选跟你游戏引擎着色器匹配的那个。

### WASM 管线参数

msdfgen WASM 管线下可用（PSDF、MSDF、MTSDF，以及上传了字体文件的 SDF）。

#### 重叠支持（Overlap Support）

处理字形中的重叠轮廓。字体有自重叠路径时打开，复杂文字和装饰性字体里比较常见。

#### 扫描线处理（Scanline Pass）

额外做一遍扫描线校正，修复距离场输出里的伪影。

#### 填充规则（Fill Rule）

**扫描线处理**开了才能用，决定重叠路径怎么填充：

- **Non-Zero（非零环绕规则）：** 默认。环绕数不为零的点算字形内部。
- **Even-Odd（奇偶规则）：** 被奇数条轮廓线包围的点算字形内部。

### MSDF 专属参数

只在 **MSDF** 和 **MTSDF** 模式下可用。

#### 角度阈值（Angle Threshold）

多通道边缘着色里检测角点的最小角度（弧度）。

- **范围：** 0.5 到 π（约 3.14159）
- **步进：** 0.1
- **默认值：** 3（约 171.9°）

值越低，检测到的角点越多，特征更锐利，但伪影可能也多。

#### 着色策略（Coloring Strategy）

边缘到颜色通道的分配方式：

| 策略 | 说明 |
| --- | --- |
| **Simple** | 标准边缘着色，大多数字体用这个。 |
| **Ink Trap** | 针对墨水陷阱优化，衬线字体常用。 |
| **Distance** *（实验性）* | 基于距离的着色，某些字形形状下效果更好。 |

#### 边缘着色种子值（Edge Coloring Seed）

边缘着色算法的随机种子。换个种子值有时能解决着色伪影。

- **最小值：** 0
- **步进：** 1

#### 误差校正（Error Correction）

MSDF 输出的后处理校正：

| 模式 | 说明 |
| --- | --- |
| **Off** | 不校正。最快，但可能有伪影。 |
| **Edge Priority** | 优先保边缘准确。推荐大多数场景用。 |
| **Indiscriminate** | 积极校正所有错误。有时会过度校正。 |

## 如何选择 SDF 模式？

| 模式 | 通道数 | 保留尖角 | 质量 | 速度 | 最佳用途 |
| --- | --- | --- | --- | --- | --- |
| **SDF** | 1 | 否 | 良好 | 快 | 简单字体、大号文本、UI 元素 |
| **PSDF** | 1 | 否 | 良好 | 中等 | 需要字体文件精度的 SDF 替代方案 |
| **MSDF** | 3 (RGB) | 是 | 优秀 | 中等 | 大多数游戏字体，行业标准 |
| **MTSDF** | 4 (RGBA) | 是 | 最佳 | 较慢 | 要求尖角保持 + 平滑抗锯齿的高保真字体 |

**建议：** 游戏开发大多数情况用 **MSDF**，质量和兼容性都好。只需要简单的大比例文本，或者没有字体文件，用 **SDF**。

## 导出 SDF 字体

导出流程跟标准位图字体一样。纹理图集（PNG）存距离场数据，描述文件存字形度量。

**MSDF** 和 **MTSDF** 还支持 **MSDF Atlas JSON** 格式，兼容 msdf-atlas-gen 工作流。所有格式详见[导出格式](/zh-cn/docs/project-management/export-formats/)。

## 在游戏引擎中使用 SDF 字体

### Unity (TextMeshPro)

TextMeshPro 原生支持 SDF 字体。把 PNG 纹理和 BMFont 描述文件导入 Unity 项目，从导入数据创建 TextMeshPro Font Asset，着色器自动处理距离场渲染。

### Godot

Godot 4 内置 SDF 字体渲染。导入 SDF 纹理图集，配置字体资源用 SDF 着色器。MSDF 字体要在导入设置里选多通道距离场选项。

### Unreal Engine

Unreal 通过 Slate UI 框架和 UMG 支持距离场字体。导入纹理，创建引用 SDF 纹理的字体面资产，材质配成 SDF 兼容着色器。
