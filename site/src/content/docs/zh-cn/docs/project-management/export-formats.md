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

SnowB BMF 导出位图字体时会生成纹理图集（`.png` 图像）和描述文件。描述文件记录字形位置、度量信息和字偶距等数据，应用程序读这个文件来渲染文本。

支持多种标准格式，主流游戏引擎、框架和应用都能用。

## 如何导出字体

1.  **打开导出对话框**：点顶部菜单的 **导出 (Export)** 按钮，或按 `Ctrl+Shift+S`（macOS 按 `Cmd+Shift+S`）。
2.  **设置字体名称**：输入自定义名称，或用默认值（主字体家族名）。这个值写入 BMFont 描述文件的 `info face` 字段。
3.  **设置文件名**：输入 `.zip` 文件名，或用默认值（当前项目名）。
4.  **选择导出类型**：下拉菜单里选格式。预览显示为 `{文件名}.{扩展名} (BMFont 类型)`。
5.  **配置高级选项**：有些格式会有额外配置项（见下方[导出对话框选项](#导出对话框选项)）。
6.  **保存**：点 **Save**，下载 `.zip` 包，里面有描述文件和 PNG 纹理图集。

## 支持的导出格式

所有格式基于 [AngelCode BMFont 规范](http://www.angelcode.com/products/bmfont/doc/file_format.html)。按你的兼容性、性能和易用性需求选。

### 文本格式 (`.fnt`, `.txt`)

最常见、支持最广，人可读，好调试。

- **适用场景**：Unity、Unreal、Cocos2d-x 等引擎，兼容性最好。
- **特点**：纯文本，解析简单。
- **规范**：参阅[文本格式文档](https://www.angelcode.com/products/bmfont/doc/file_format.html#tags)。

### XML 格式 (`.xml`, `.fnt`)

结构化格式，适合有 XML 解析能力的应用。

- **适用场景**：Web 应用或用自定义 XML 工具的项目。
- **特点**：标准 XML 结构，标签自描述。

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

最紧凑，加载快、体积小。

- **适用场景**：性能敏感的应用、手机游戏、内存有限的项目。
- **特点**：体积最小，解析快，遵循 BMFont v3 规范。
- **规范**：参阅[二进制格式文档](https://www.angelcode.com/products/bmfont/doc/file_format.html#bin)。

**结构：**
二进制文件由类型化数据块组成，分别存信息、公共数据、页面、字符和字偶距配对，读取速度快。

### JSON 格式 (`.json`)

BMFont 数据的 JSON 版本。

- **适用场景**：Web 应用、自定义解析器，或习惯用 JSON 的项目。
- **特点**：标准 JSON，什么语言都能解析。SDF 渲染模式下包含 `distanceField` 元数据。

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

纹理数据直接嵌入为 C 语言字节数组，给资源受限的环境用。

- **适用场景**：嵌入式系统、微控制器 (MCU)、没有文件系统的裸机应用。
- **特点**：8 种像素格式（GRAY8、RGB、RGBA、ARGB、BGR、ABGR、BGRA、RGB565），可配置重建滤波器，纹理数据直接编译进固件。
- **像素格式**：选择与您的显示硬件匹配的格式：
  - `GRAY8` (1 字节/像素) — 单色显示屏
  - `RGB` (3 字节/像素) — 不带 Alpha 的标准颜色
  - `RGBA` / `ARGB` (4 字节/像素) — 带 Alpha 的颜色，不同的字节序
  - `BGR` (3 字节/像素) / `ABGR` / `BGRA` (4 字节/像素) — 反转字节序变体
  - `RGB565` (2 字节/像素) — 适用于内存受限显示屏的 16 位颜色

### MSDF Atlas JSON (`.json`)

兼容 [msdf-atlas-gen](https://github.com/Chlumsky/msdf-atlas-gen) 的 JSON 格式，用 em 归一化坐标。

- **适用场景**：MSDF 着色器管线、支持距离场的自定义渲染引擎、msdf-atlas-gen 工具链项目。
- **特点**：em 归一化坐标（Y 轴向上），OpenType 表的字体度量，可配置范围的 distanceField 元数据，下划线位置/粗细数据。
- **注意**：这个格式是给 SDF/MSDF 渲染模式用的。默认渲染模式下也能生成，但输出不是 SDF 的。

## 高级功能

### 多页面导出

字符集太大一个纹理放不下时，SnowB BMF 自动处理：

- **自动分页**：字形分到多个纹理文件（如 `font_0.png`、`font_1.png`）。
- **统一描述文件**：生成一个引用所有纹理页面的描述文件。

### 元数据

导出文件自动带字体名称、大小、生成日期和字符集信息，方便调试和资产管理。

## 高级导出选项

### 导出对话框选项

打开导出对话框（`Ctrl+Shift+S` / `Cmd+Shift+S`）后，能配置这些选项：

#### 字体名称 (Font Name)

自定义 BMFont 描述文件中的字体名称。

- **字段类型**：文本输入
- **默认值**：主字体家族名
- **效果**：写入描述文件的 `info face` 属性（如 `info face="MyFont"`）

#### 文件名 (File Name)

自定义 `.zip` 包的名称。

- **字段类型**：文本输入，带 `.zip` 后缀
- **默认值**：当前项目名
- **效果**：下载文件叫 `{文件名}.zip`

#### 导出类型 (Export Type)

下拉菜单选输出格式。

- **字段类型**：下拉选择
- **预览**：每个选项显示为 `{文件名}.{扩展名} (BMFont 类型)`，能看到具体的输出文件名和格式
- **可选格式**：六种 -- Text (.fnt/.txt)、XML (.xml/.fnt)、Binary (.fnt)、JSON (.json)、C Header (.c)、MSDF Atlas JSON (.json)

#### 像素格式 (Pixel Format) -- 仅 C Header

选择 C 头文件中纹理数据的像素编码格式。只在选 C Header 格式时出现。

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

给纹理加模糊滤波。格式支持时才显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：开启后对纹理数据做重建（模糊）滤波，某些显示硬件上效果更好

#### 包含纹理 (Include Textures) -- 仅 C Header

是否在 C 头文件里嵌入纹理像素数据。格式支持时才显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：开启后 `.c` 文件包含完整纹理像素数据（C 字节数组），可以直接编译到固件里

#### 扩展数据字段 (Extended Data Fields) -- 仅 C Header

导出时带上额外的元数据字段。格式支持时才显示。

- **字段类型**：Off/On 开关
- **默认值**：Off（关闭）
- **效果**：开启后包含标准 BMFont 规范之外的额外元数据

## 常见问题排查

-   **字符不显示**：
    -   检查 `.fnt` 文件和所有 `.png` 纹理文件的路径对不对。
    -   看看要显示的字符是不是已包含在导出字体中。

-   **文本模糊或失真**：
    -   游戏引擎里把纹理过滤模式改成**点采样 (Point)** 或**最近邻 (Nearest Neighbor)**。
    -   按 1:1 像素比例渲染字体。

-   **导出失败**：
    -   字符集可能太大了。在**布局 (Layout)** 设置里加大纹理尺寸，或减少字符数量。

## 相关主题

- [纹理打包](/zh-cn/docs/font-design/texture-packing/)
- [项目操作](/zh-cn/docs/project-management/project-operations/)
