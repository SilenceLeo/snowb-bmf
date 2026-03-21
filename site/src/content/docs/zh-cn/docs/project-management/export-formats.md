---
title: 导出格式：6 种方式为游戏引擎导出位图字体
description: "学习如何以 6 种格式导出位图字体：Text、XML、Binary、JSON、C Header 和 MSDF Atlas JSON。兼容 Unity、Unreal、Godot、嵌入式系统和 MSDF 着色器管线。"
schema:
  "@context": "https://schema.org"
  "@type": "TechArticle"
  "headline": "从 SnowB BMF 以 6 种格式导出位图字体"
  "datePublished": "2025-01-15"
  "dateModified": "2026-03-21"
  "description": "学习如何以 6 种格式导出位图字体：Text、XML、Binary、JSON、C Header 和 MSDF Atlas JSON。兼容 Unity、Unreal、Godot、嵌入式系统和 MSDF 着色器管线。"
  "keywords": ["位图字体导出", "字体格式", "游戏开发", "Unity", "Unreal", "Godot", "BMFont", "纹理图集", "fnt格式", "XML格式", "二进制格式", "JSON 格式", "C 头文件格式", "MSDF Atlas JSON", "嵌入式系统", "像素格式", "导出对话框", "字体名称", "重建滤波器", "导出选项"]
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
    "@id": "https://snowb.org/zh-cn/docs/project-management/export-formats/"
  "audience":
    "@type": "Audience"
    "audienceType": "游戏开发者和 Web 开发者"
  "teaches":
    - "如何以多种格式导出位图字体"
    - "配置导出对话框选项"
    - "为您的游戏引擎选择合适的格式"
    - "使用 C Header 格式用于嵌入式系统"
  "mainEntity":
    "@type": "HowTo"
    "name": "如何为游戏引擎导出位图字体"
    "description": "从 SnowB BMF 以多种格式导出位图字体的分步指南"
    "step":
      - "@type": "HowToStep"
        "name": "打开导出对话框"
        "text": "点击顶部菜单栏中的导出按钮或按 Ctrl+Shift+S（macOS 上为 Cmd+Shift+S）"
      - "@type": "HowToStep"
        "name": "设置字体名称"
        "text": "输入自定义字体名称，该名称将显示在 BMFont 描述文件的 info face 字段中，或保持默认值（主字体家族名）"
      - "@type": "HowToStep"
        "name": "设置文件名"
        "text": "输入自定义导出 .zip 压缩包的文件名，或保持默认值（当前项目名）"
      - "@type": "HowToStep"
        "name": "选择导出类型"
        "text": "使用下拉菜单从 Text (.fnt)、XML、Binary、JSON、C Header 或 MSDF Atlas JSON 格式中选择"
      - "@type": "HowToStep"
        "name": "配置高级选项"
        "text": "对于 C Header 格式，可配置像素格式（GRAY8、RGB、RGBA 等）、重建滤波器、包含纹理开关和扩展数据字段开关"
      - "@type": "HowToStep"
        "name": "下载文件"
        "text": "点击保存按钮，下载包含描述文件和 PNG 纹理图集的 .zip 压缩包"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "inLanguage": "zh-CN"
  "mentions":
    - "@type": "DigitalDocument"
      "name": "BMFont 文本格式"
      "fileFormat": ".fnt"
      "description": "位图字体描述符的人类可读文本格式"
    - "@type": "DigitalDocument"
      "name": "BMFont XML 格式"
      "fileFormat": ".xml"
      "description": "位图字体描述符的结构化 XML 格式"
    - "@type": "DigitalDocument"
      "name": "BMFont 二进制格式"
      "fileFormat": ".fnt"
      "description": "用于性能关键应用程序的紧凑二进制格式"
    - "@type": "DigitalDocument"
      "name": "BMFont JSON 格式"
      "fileFormat": ".json"
      "description": "支持 distanceField 元数据的 BMFont 数据 JSON 表示"
    - "@type": "DigitalDocument"
      "name": "C Header 格式"
      "fileFormat": ".c"
      "description": "将纹理数据嵌入为 C 语言数组，适用于嵌入式系统和 MCU"
    - "@type": "DigitalDocument"
      "name": "MSDF Atlas JSON 格式"
      "fileFormat": ".json"
      "description": "兼容 msdf-atlas-gen 的格式，使用 em 归一化坐标，适用于 MSDF 着色器管线"
    - "@type": "ImageObject"
      "name": "PNG 纹理图集"
      "fileFormat": ".png"
      "description": "包含所有字符字形的位图字体纹理"
---

SnowB BMF 会将您的位图字体导出为一个纹理图集（`.png` 图像）和一个描述文件，用于告知您的应用程序如何使用它。描述文件包含了所有必要的数据，如字形位置、度量信息和字偶距配对。

您可以从多种标准格式中进行选择，以确保与大多数游戏引擎、框架和应用程序的兼容性。

## 如何导出字体

1.  **打开导出对话框**：点击顶部菜单栏中的 **导出 (Export)** 按钮或按 `Ctrl+Shift+S`（macOS 上为 `Cmd+Shift+S`）。
2.  **设置字体名称**：输入自定义字体名称，或保持默认值（您的主字体家族名）。该值会显示在 BMFont 描述文件的 `info face` 字段中。
3.  **设置文件名**：输入自定义导出 `.zip` 文件的名称，或保持默认值（当前项目名）。
4.  **选择导出类型**：从下拉菜单中选择最适合您需求的格式。预览会显示为 `{文件名}.{扩展名} (BMFont 类型)`。
5.  **配置高级选项**：根据所选格式，可能会出现额外的配置选项（参见下方的[导出对话框选项](#导出对话框选项)）。
6.  **保存**：点击 **Save** 按钮，下载包含描述文件和 PNG 纹理图集（一个或多个）的 `.zip` 压缩包。

## 支持的导出格式

所有格式均基于官方的 [AngelCode BMFont 规范](http://www.angelcode.com/products/bmfont/doc/file_format.html)。请根据您项目的兼容性、性能和易用性要求选择最合适的格式。

### 文本格式 (`.fnt`, `.txt`)

这是最常见且支持最广泛的格式。它是人类可读的，便于调试。

- **最适用于**：与 Unity、Unreal 和 Cocos2d-x 等引擎实现最大兼容性。
- **特点**：纯文本，易于解析，包含注释以提高可读性。
- **规范**：有关详细信息，请参阅[文本格式文档](https://www.angelcode.com/products/bmfont/doc/file_format.html#tags)。

### XML 格式 (`.xml`, `.fnt`)

一种结构化的、易于解析的格式，非常适合具有内置 XML 支持的应用程序。

- **最适用于**：Web 应用程序或使用可轻松处理 XML 的自定义工具的项目。
- **特点**：标准 XML 结构，自描述标签。

**示例：**
```xml
<?xml version="1.0"?>
<font>
  <info face="Arial" size="32" ... />
  <common lineHeight="38" base="26" scaleW="512" scaleH="512" pages="1" ... />
  <pages>
    <page id="0" file="font_0.png" />
  </pages>
  <chars count="95">
    <char id="65" x="10" y="0" width="18" height="20" xoffset="0" yoffset="6" ... />
  </chars>
</font>
```

### 二进制格式 (`.fnt`)

最紧凑、最高效的格式，专为快速加载和最小化文件体积而设计。

- **最适用于**：对性能要求严苛的应用程序、手机游戏或有内存限制的项目。
- **特点**：文件体积最小，为快速解析而优化，遵循 BMFont v3 规范。
- **规范**：有关详细信息，请参阅[二进制格式文档](https://www.angelcode.com/products/bmfont/doc/file_format.html#bin)。

**结构：**
二进制文件由类型化的数据块组成，分别用于信息、公共数据、页面、字符和字偶距配对，确保了快速的读取时间。

### JSON 格式 (`.json`)

BMFont 数据的 JSON 表示，提供了广泛使用的数据格式的灵活性。

- **最适用于**：Web 应用程序、自定义解析器以及偏好 JSON 而非纯文本或 XML 的项目。
- **特点**：标准 JSON 结构，任何语言都可轻松解析，使用 SDF 渲染模式时包含 `distanceField` 元数据。

**示例：**
```json
{
  "info": {
    "face": "Arial",
    "size": 32,
    "bold": 0,
    "italic": 0
  },
  "distanceField": {
    "fieldType": "msdf",
    "distanceRange": 4
  },
  "common": {
    "lineHeight": 38,
    "base": 26,
    "scaleW": 512,
    "scaleH": 512,
    "pages": 1
  },
  "pages": ["font_0.png"],
  "chars": [
    { "id": 65, "x": 10, "y": 0, "width": 18, "height": 20, "xoffset": 0, "yoffset": 6, "xadvance": 18, "page": 0 }
  ]
}
```

### C Header 格式 (`.c`)

将纹理数据直接嵌入为 C 语言字节数组，专为资源受限的环境设计。

- **最适用于**：嵌入式系统、微控制器 (MCU) 以及文件系统访问受限的裸机应用程序。
- **特点**：支持 8 种像素格式 (GRAY8、RGB、RGBA、ARGB、BGR、ABGR、BGRA、RGB565)，可配置重建滤波器，纹理数据直接编译进二进制文件。
- **像素格式**：选择与您的显示硬件匹配的格式：
  - `GRAY8` (1 字节/像素) — 单色显示屏
  - `RGB` (3 字节/像素) — 不带 Alpha 的标准颜色
  - `RGBA` / `ARGB` (4 字节/像素) — 带 Alpha 的颜色，不同的字节序
  - `BGR` / `ABGR` / `BGRA` (4 字节/像素) — 反转字节序变体
  - `RGB565` (2 字节/像素) — 适用于内存受限显示屏的 16 位颜色

### MSDF Atlas JSON (`.json`)

兼容 [msdf-atlas-gen](https://github.com/Chlumsky/msdf-atlas-gen) 的 JSON 格式，使用 em 归一化坐标。

- **最适用于**：MSDF 着色器管线、支持距离场的自定义渲染引擎，以及使用 msdf-atlas-gen 工具链的项目。
- **特点**：em 归一化坐标 (Y 轴向上)，来自 OpenType 表的字体度量信息，可配置范围的 distanceField 元数据，下划线位置/粗细数据。
- **注意**：此格式专为 SDF/MSDF 渲染模式设计。在默认渲染模式下使用会生成有效但非 SDF 的输出。

## 高级功能

### 多页面导出

如果您的字符集太大，无法容纳在单个纹理上，SnowB BMF 会自动处理：

- **自动分页**：字形将被分割到多个纹理文件中（例如 `font_0.png`、`font_1.png`）。
- **统一描述文件**：生成一个统一的描述文件，该文件引用所有纹理页面，以便您的应用程序可以轻松管理它们。

### 元数据

导出的文件会自动包含有用的元数据，例如字体名称、大小、生成日期和字符集详细信息，这对于调试和资产管理非常有帮助。

## 高级导出选项

### 导出对话框选项

打开导出对话框（`Ctrl+Shift+S` / `Cmd+Shift+S`）后，可以配置以下选项：

#### 字体名称 (Font Name)

自定义导出的 BMFont 描述文件中显示的字体名称。

- **字段类型**：文本输入
- **默认值**：主字体家族名
- **效果**：设置 BMFont 描述文件中的 `info face` 属性（例如 `info face="MyFont"`）

#### 文件名 (File Name)

自定义导出的 `.zip` 压缩包名称。

- **字段类型**：文本输入，带 `.zip` 后缀
- **默认值**：当前项目名
- **效果**：下载文件将命名为 `{文件名}.zip`

#### 导出类型 (Export Type)

从下拉菜单中选择输出格式。

- **字段类型**：下拉选择
- **预览**：每个选项显示为 `{文件名}.{扩展名} (BMFont 类型)`，方便您查看确切的输出文件名和格式
- **可选格式**：全部六种支持的格式 -- Text (.fnt/.txt)、XML (.xml/.fnt)、Binary (.fnt)、JSON (.json)、C Header (.c)、MSDF Atlas JSON (.json)

#### 像素格式 (Pixel Format) -- 仅 C Header

选择嵌入 C 头文件中纹理数据的像素编码格式。此选项仅在选择 C Header 格式时显示。

- **字段类型**：下拉选择
- **默认值**：GRAY8
- **可选值**：
  - `GRAY8` (1 字节/像素) -- 单色显示屏
  - `RGB` (3 字节/像素) -- 不带 Alpha 的标准颜色
  - `RGBA` (4 字节/像素) -- 带 Alpha 的颜色
  - `ARGB` (4 字节/像素) -- Alpha 在前的字节序
  - `BGR` (3 字节/像素) -- 反转字节序
  - `ABGR` (4 字节/像素) -- Alpha 在前的反转字节序
  - `BGRA` (4 字节/像素) -- 反转字节序，Alpha 在后
  - `RGB565` (2 字节/像素) -- 适用于内存受限显示屏的 16 位颜色

#### 重建滤波器 (Reconstruction Filter) -- 仅 C Header

对纹理应用模糊滤波处理。此选项仅在所选格式支持时显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：启用后，对纹理数据应用重建（模糊）滤波器，可在某些显示硬件上提升视觉质量

#### 包含纹理 (Include Textures) -- 仅 C Header

控制是否在 C 头文件中嵌入纹理像素数据。此选项仅在所选格式支持时显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：启用后，生成的 `.c` 文件将包含完整的纹理像素数据（C 字节数组），可直接编译到您的固件中

#### 扩展数据字段 (Extended Data Fields) -- 仅 C Header

在导出中包含额外的元数据字段。此选项仅在所选格式支持时显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：启用后，导出文件将包含超出标准 BMFont 规范的额外元数据字段

## 常见问题排查

-   **字符不显示**：
    -   确保 `.fnt` 文件和所有 `.png` 纹理文件都位于您项目的正确路径中。
    -   确认您尝试显示的字符已在导出时包含在字体中。

-   **文本模糊或失真**：
    -   在您的游戏引擎中，将纹理的过滤模式设置为 **点采样 (Point)** 或 **最近邻 (Nearest Neighbor)** 以防止模糊。
    -   确保您的游戏以 1:1 的像素比例渲染字体。

-   **导出失败**：
    -   如果导出超时或失败，可能是您的字符集对于单个纹理来说太大了。请尝试在 **布局 (Layout)** 设置中增加纹理尺寸，或减少字符数量。

## 相关主题

- [纹理打包](/zh-cn/docs/font-design/texture-packing/)
- [项目操作](/zh-cn/docs/project-management/project-operations/)
