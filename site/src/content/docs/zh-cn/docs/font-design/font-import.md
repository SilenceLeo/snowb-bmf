---
title: 字体导入：加载 TTF、OTF、WOFF 和 TTC 文件
description: "将 TTF、OTF、WOFF 和 TTC 字体导入 SnowB BMF。了解字体回退系统、fontkit 矢量渲染和锐化功能，制作像素级完美的位图字体。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "SnowB BMF 字体导入指南 - 完整文档"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "SnowB BMF 字体导入综合指南。了解支持的格式（TTF、OTF、WOFF、TTC）、字体回退系统、基于 fontkit 的矢量渲染以及用于实现像素级完美效果的锐化功能。"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "description": "基于浏览器的位图字体生成器"
    "url": "https://snowb.org"
  "keywords": ["字体导入", "TTF", "OTF", "WOFF", "TTC", "TrueType Collection", "fontkit", "矢量渲染", "字体回退", "锐化功能", "位图字体", "SnowB BMF", "字体设计"]
  "articleSection": "字体设计"
  "audience":
    "@type": "Audience"
    "audienceType": "开发者和字体设计师"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何在 SnowB BMF 中导入字体"
    "description": "在 SnowB BMF 位图字体生成器中导入字体的分步指南"
    "supply":
      - "@type": "HowToSupply"
        "name": "字体文件（TTF、OTF、WOFF 或 TTC 格式）"
    "tool":
      - "@type": "HowToTool"
        "name": "SnowB BMF 字体生成器"
        "url": "https://snowb.org"
    "step":
      - "@type": "HowToStep"
        "name": "选择字体格式"
        "text": "从支持的格式中选择：TTF（推荐）、OTF、WOFF 或 TTC"
      - "@type": "HowToStep"
        "name": "导入主字体"
        "text": "使用\"添加字体文件\"按钮导入您的主字体以进行矢量渲染"
      - "@type": "HowToStep"
        "name": "从 TTC 中选择字体（如适用）"
        "text": "导入 TTC 文件时，会弹出一个对话框列出集合中的所有字体。勾选您需要的字体，然后点击「加载」即可导入。"
      - "@type": "HowToStep"
        "name": "设置字体回退"
        "text": "导入额外的字体以创建回退链，确保完整的字符覆盖"
      - "@type": "HowToStep"
        "name": "配置锐化功能"
        "text": "调整锐化设置（推荐 80%）以获得像素级的清晰度"
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
    "@id": "https://snowb.org/zh-cn/docs/font-design/font-import/"
  "inLanguage": "zh-CN"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
---

导入自定义字体才能生成高质量的位图字体。SnowB BMF 支持加载外部字体文件，给你更精确的字形渲染控制。根据字体的加载方式，应用会使用不同的渲染模式。

## 支持的字体格式

支持以下字体格式：

- **TTF** (TrueType 字体) — 兼容性最好，推荐使用。
- **OTF** (OpenType 字体) — 完全支持所有特性。
- **WOFF** (Web 开放字体格式) — 适用于压缩的 Web 字体。
- **TTC** (TrueType Collection) — 包含多个字体的集合文件。导入时 SnowB BMF 会弹出选择对话框，让你选择要加载的字体。

### 导入 TTC 文件

TTC 文件把多个相关字体打包在一起，比如同一字体家族的不同字重。导入流程：

1. **自动检测**：导入 `.ttc` 文件时，应用识别出集合格式。
2. **字体选择对话框**：弹出对话框列出集合中的每个字体，显示：
   - **全名 (Full Name)** — 如 "Arial Bold"
   - **字体家族 (Font Family)** — 如 "Arial"
   - **子族 (Font Subfamily)** — 如 "Bold"
3. **多选支持**：用复选框选择一个或多个字体。
4. **独立加载**：选中的字体各自添加到字体列表，可单独使用或放进回退链。

## 字体回退系统如何工作

SnowB BMF 支持多字体回退链。生成字形时，按导入顺序逐个查找：

1.  **主字体**（第一个导入的字体）— 负责大部分字符。
2.  **次要字体** — 主字体里找不到的字符，依次到后续字体中查找。
3.  **系统字体**（兜底）— 所有导入字体都没有时，用浏览器默认字体。

多语言项目特别适合这个机制。比如英文字体加上中文字体，一个位图字体就能覆盖两种字符集。

## 字体渲染模式

### 矢量渲染 (推荐)

通过 **"Add Font File"** 按钮导入字体时，应用使用矢量渲染。底层用 [fontkit](https://github.com/foliojs/fontkit) 库直接解析字体轮廓数据。

**为什么选 fontkit？** 格式兼容性广，原生支持 TTC，可变字体处理也更好。

**矢量渲染的好处：**
- **高精度字形**：直接从矢量数据渲染。
- **锐化功能**：网格对齐，字形更清晰。
- **精确度量**：直接从字体元数据提取基线和测量值。
- **自动回退**：字符缺失时切换到下一个字体。
- **kerning 支持**：保留字偶距对，间距更专业。

### Canvas 渲染 (基本回退)

字体无法作为矢量文件解析时，回退到浏览器的 Canvas 文本渲染（`measureText()` + `fillText()`）。

**Canvas 渲染的局限：**
- **锐化不可用**：没有矢量数据，锐化滑块会禁用。
- **浏览器差异**：不同浏览器的渲染结果可能不一样。
- **精度有限**：依赖浏览器的文本测量 API。

## "锐化"功能：实现像素级的清晰度

**锐化**是矢量渲染的一大优势，通过网格对齐算法让字形更清晰，小尺寸下效果明显。

### 工作原理

锐化会调整字形的矢量路径，让它们对齐像素网格。

- **对齐强度**：0-100% 的百分比控制。
- **网格对齐**：矢量坐标对齐到最近的像素边界。
- **路径优化**：调整控制点，曲线和线条更清晰。
- **减少模糊**：抗锯齿伪影变少，小字号文本更锐利。

### 推荐设置

- **0%**：无对齐，保留原始字形形状。
- **50%**：中等对齐，平滑度与清晰度兼顾。
- **80%**：默认值，适合大多数场景。
- **100%**：最大对齐，适合像素艺术风格。

**注意**：锐化仅对导入的矢量字体生效。

## 最佳实践

1.  **导入字体文件**：想要最好的质量和控制力，用"添加字体文件"功能。
2.  **规划回退链**：先导入主字体，再加辅助字体补充字符集。
3.  **善用 TTC**：有 TTC 文件的话，导入一次选需要的字重就行。
4.  **锐化从 80% 起步**：大多数情况效果不错，再根据字体大小和分辨率微调。
5.  **测试字符覆盖**：检查字体组合是否覆盖了所有必需字符。
6.  **在目标尺寸预览**：锐化效果在最终分辨率下看得最清楚。

## 故障排除

**锐化滑块被禁用了？**
- 还没导入矢量字体。用"添加字体文件"按钮添加一个。

**字体看起来模糊？**
- 试试提高锐化百分比。也检查下预览尺寸是否和最终显示分辨率一致。

**有些字符丢失了？**
- 导入的字体可能不包含那些 Unicode 字符。把包含缺失字符的字体加到回退链里。

**字体导入失败？**
- 检查文件格式（TTF、OTF、WOFF 或 TTC），确认文件没损坏。

**导入 TTC 文件后没反应？**
- 在选择对话框里至少选中一个字体再点"加载"。对话框没出现的话，文件可能不是有效的 TTC。

## 相关主题

- [锐利渲染](/zh-cn/docs/font-design/sharp/)
- [字符集](/zh-cn/docs/font-design/character-sets/)
- [SDF 渲染](/zh-cn/docs/font-design/sdf-rendering/)
