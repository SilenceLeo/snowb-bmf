---
title: "常见问题：SnowB BMF 位图字体生成器 FAQ"
description: 查找有关 SnowB BMF（免费的网页位图字体生成器）的常见问题解答。了解支持的格式、性能等信息。
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "name": "SnowB BMF - 常见问题"
  "description": "SnowB BMF 免费网页位图字体生成器的详细常见问题解答。获取有关功能、兼容性、性能和故障排除的答案。"
  "url": "https://snowb.org/zh-cn/docs/faq/"
  "inLanguage": "zh-CN"
  "publisher":
    "@type": "Organization"
    "name": "SnowB"
    "url": "https://snowb.org"
  "isPartOf":
    "@type": "WebSite"
    "name": "SnowB BMF 文档"
    "url": "https://snowb.org"
  "about":
    "@type": "SoftwareApplication"
    "name": "SnowB BMF"
    "applicationCategory": "DesignApplication"
    "url": "https://snowb.org"
  "mainEntity":
    - "@type": "Question"
      "name": "SnowB BMF 是什么？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 是一款免费的、基于网页的位图字体生成器。它允许您直接在浏览器中为游戏、网页和其他应用程序创建、编辑和导出自定义位图字体。"
    - "@type": "Question"
      "name": "SnowB BMF 是免费的吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "是的，SnowB BMF 完全免费使用。所有功能无需注册或安装即可使用。"
    - "@type": "Question"
      "name": "支持哪些浏览器？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 可在支持 Canvas API 的现代浏览器上运行，包括最新版本的 Chrome、Firefox、Safari 和 Edge。为获得最佳体验，我们建议使用最新的浏览器。"
    - "@type": "Question"
      "name": "如何保存我的项目？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 会在您离开页面或关闭标签页时自动将项目保存到浏览器的 IndexedDB 存储中。但为了最大程度的安全性，我们建议您同时通过点击\"保存\"按钮下载 .sbf 项目文件来手动保存项目。这确保您拥有可在不同浏览器和设备之间使用的便携式备份。"
    - "@type": "Question"
      "name": "刷新页面后我的工作丢失了。如何防止这种情况发生？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 使用 IndexedDB 进行自动持久化，因此在正常情况下刷新页面不应导致数据丢失。如果您的工作丢失，可能是因为您的浏览器存储被清除（例如通过\"清除浏览数据\"）或您正在使用隐私/无痕窗口。为防止数据丢失，请始终保留 .sbf 备份文件。"
    - "@type": "Question"
      "name": "我可以同时处理多个项目吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "当然可以！SnowB BMF 内置了带标签页界面的多项目工作区。您可以在单个浏览器标签页中创建、打开和切换多个项目。点击\"新建\"按钮或双击标签栏的空白区域即可创建新项目。所有项目都会自动保存到 IndexedDB 中。"
    - "@type": "Question"
      "name": "我可以导出哪些格式的字体？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 支持六种导出格式：文本格式 (.fnt, .txt) 提供最大引擎兼容性；XML 格式 (.xml, .fnt) 用于结构化数据；二进制格式 (.fnt) 体积紧凑；JSON 格式 (.json) 用于 Web 应用和自定义解析器；C 头文件 (.c) 用于嵌入式系统和 MCU，提供 8 种像素格式选项；MSDF Atlas JSON (.json) 用于兼容 msdf-atlas-gen 的 MSDF 着色器管线。"
    - "@type": "Question"
      "name": "哪种导出格式最适合我的游戏引擎？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "对于 Unity/Unreal/Cocos2d-x，使用文本格式 (.fnt)。对于自定义引擎，任何格式都可以，但二进制格式 (.fnt) 提供最佳性能。"
    - "@type": "Question"
      "name": "导出的字体与 Unity 兼容吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "是的，.fnt 文件可与 TextMeshPro 和 NGUI 配合使用。为了获得清晰、像素完美的渲染效果，请在 Unity 中将纹理的过滤模式设置为\"Point\"（或\"Nearest\"）。"
    - "@type": "Question"
      "name": "为什么我的字体看起来很模糊？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "模糊通常是由纹理过滤引起的。要解决此问题，请在您的游戏引擎或应用程序中将纹理过滤模式设置为\"Point\"或\"Nearest\"。此外，请确保您的文本在整数位置渲染且未进行缩放。"
    - "@type": "Question"
      "name": "如何修复不正确的字符间距？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "不正确的间距可能是由于字偶距问题或不正确的字体度量引起的。在导出之前，请在 SnowB BMF 中检查您的字偶距对和基线设置。"
    - "@type": "Question"
      "name": "如何创建像素完美的字体？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "要获得清晰、像素完美的外观：1) 使用专为像素艺术设计的字体，2) 将字体大小设置为与您的目标分辨率完全匹配，3) 禁用抗锯齿和字体平滑，4) 确保字符与像素网格对齐。"
    - "@type": "Question"
      "name": "为什么应用程序运行缓慢或卡顿？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "处理非常大的字符集或复杂的字体时可能会出现性能问题。要提高性能：减少字符集只包含您需要的字形，增加纹理尺寸以降低打包算法的复杂性，关闭其他浏览器选项卡以释放内存。"
    - "@type": "Question"
      "name": "我收到了\"内存不足\"的错误。我该怎么办？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "这在生成非常大的字体图集时会发生。请尝试减小纹理尺寸，将您的字符集拆分为多个较小的字体文件，或使用二进制导出格式，它更节省内存。"
    - "@type": "Question"
      "name": "我可以导入自己的字体吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "是的，您可以上传 .ttf、.otf 和 .woff 字体文件。但是，SnowB BMF 无法直接访问您系统上安装的字体。"
    - "@type": "Question"
      "name": "如何使用自定义图像作为字符？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "1) 导入带透明度的 PNG 图像，2) 为每个图像分配一个 Unicode 值，3) 根据需要调整每个图像字形的位置和缩放，4) 导出字体。图像字形将包含在图集中。"
    - "@type": "Question"
      "name": "导入旧版项目文件会发生什么？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 会自动转换旧版项目文件。只需打开文件，检查导入的设置以确保它们是正确的，然后将项目另存为新的 .sbf 文件。"
    - "@type": "Question"
      "name": "SnowB BMF 支持 SDF/MSDF 字体吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "是的，SnowB BMF 作为实验性功能支持五种渲染模式：默认模式（标准 Canvas 渲染）、SDF（使用 Felzenszwalb EDT 的有向距离场）、PSDF（通过 msdfgen WASM 的伪 SDF）、MSDF（通过 msdfgen WASM 的多通道 SDF）和 MTSDF（通过 msdfgen WASM 的多通道 + 真实 SDF）。SDF 字体与分辨率无关，非常适合游戏引擎。注意：PSDF、MSDF 和 MTSDF 模式需要先上传字体文件。请参阅 SDF 渲染文档了解详情。"
    - "@type": "Question"
      "name": "什么是渐变预设？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 包含 10 个内置渐变预设，您可以一键应用。您还可以将自定义渐变保存为预设以在不同项目中重复使用，并删除不再需要的预设。在填充设置面板的渐变部分中找到预设选择器。"
    - "@type": "Question"
      "name": "自动保存是如何工作的？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "SnowB BMF 会自动将所有项目保存到浏览器的 IndexedDB 存储中。这发生在您离开页面时（beforeunload 事件）和标签页失去可见性时（visibilitychange 事件）。您的项目以 Protocol Buffer 编码数据存储以提高效率。注意：清除浏览器数据将删除已保存的项目，因此请始终保留 .sbf 文件备份。"
    - "@type": "Question"
      "name": "什么是 xFractional 设置？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "xFractional 设置是一项实验性功能，通过使用定点数格式为字形度量启用亚像素精度。启用后，xAdvance、xOffset 和其他度量使用以定点数存储的小数值，在较小尺寸下提供更平滑的文本渲染。这是一个高级选项——大多数用户不需要更改它。"
    - "@type": "Question"
      "name": "什么是内阴影功能？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "内阴影功能在字形内部渲染阴影，营造雕刻或浮雕效果。可与外阴影同时使用，为位图字体增添多层深度和立体感。可在阴影设置面板中配置颜色、模糊、偏移和不透明度。"
    - "@type": "Question"
      "name": "SnowB BMF 支持可变字体吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "是的，SnowB BMF 在导入 TTF/OTF/WOFF 文件时会自动检测可变字体，并显示变体轴控制（字重、字宽、斜体及自定义轴）。通过实时滑块调整各轴参数，在生成位图前精确微调字体外观。"
    - "@type": "Question"
      "name": "我可以导入 TTC（TrueType Collection）文件吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "可以。导入 TTC 文件时，SnowB BMF 会自动检测并弹出字体选择对话框，您可以从合集中选择一个或多个字体导入到项目中。"
    - "@type": "Question"
      "name": "什么是有序网格打包？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "有序网格是与自动和固定模式并列的第三种纹理打包模式。它按行列有序排列字形，可配置列数，生成可预测的网格化纹理图集布局，适用于某些游戏引擎的特定需求。"
    - "@type": "Question"
      "name": "SnowB BMF 可以离线使用吗？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "可以。SnowB BMF 是一款渐进式 Web 应用（PWA），支持完全离线功能。加载后，您可以将其安装为类原生应用，在没有网络连接的情况下创建字体。重新上线后，应用会自动检查更新。"
    - "@type": "Question"
      "name": "在哪里可以找到快捷键？"
      "acceptedAnswer":
        "@type": "Answer"
        "text": "请参阅快捷键文档页面获取完整列表。主要快捷键包括 Space+拖拽平移画布、Ctrl+滚轮缩放，以及各种导航快捷操作，让字体编辑工作流更高效。"
---

## 综合

### SnowB BMF 是什么？

免费的网页版位图字体生成器，在浏览器里给游戏、网页和其他应用做位图字体。

### SnowB BMF 是免费的吗？

完全免费，不用注册不用安装。

### 支持哪些浏览器？

支持 Canvas API 的现代浏览器都能跑，包括最新版 Chrome、Firefox、Safari 和 Edge。建议用最新版浏览器。

## 项目管理

### 如何保存我的项目？

SnowB BMF 在你离开页面或关闭标签页时自动把项目存到浏览器 IndexedDB。建议同时点"保存"下载 `.sbf` 文件做备份，方便换浏览器或换设备时用。详见[项目管理](/zh-cn/docs/project-management/project-operations/)。

### 刷新页面后我的工作丢失了。如何防止这种情况发生？

SnowB BMF 用 IndexedDB 自动保存，正常刷新不会丢数据。如果丢了，可能是浏览器存储被清掉了（比如"清除浏览数据"）或者在用隐私/无痕窗口。记得留 `.sbf` 备份。

### 我可以同时处理多个项目吗？

可以。内置多项目工作区，带标签页界面。一个浏览器标签页里就能创建、打开和切换多个项目。点"新建"或双击标签栏空白区域就能建新项目，所有项目自动存到 IndexedDB。详见[项目管理](/zh-cn/docs/project-management/project-operations/)。

## 字体格式与导出

### 我可以导出哪些格式的字体？

六种：
-   **文本 (.fnt, .txt):** 兼容性最好，Unity、Unreal、Cocos2d-x 等引擎都支持。
-   **XML (.xml, .fnt):** 结构化格式，适合 Web 应用或自定义解析器。
-   **二进制 (.fnt):** 最紧凑，性能最高。
-   **JSON (.json):** Web 应用和自定义解析器用。
-   **C 头文件 (.c):** 嵌入式系统和 MCU 用，8 种像素格式。
-   **MSDF Atlas JSON (.json):** 兼容 msdf-atlas-gen 的 MSDF 着色器管线。

详见[导出格式](/zh-cn/docs/project-management/export-formats/)。

### 哪种导出格式最适合我的游戏引擎？

-   **Unity/Unreal/Cocos2d-x:** 用 **文本 (.fnt)**。
-   **自定义引擎:** 都行，但 **二进制 (.fnt)** 性能最好。

详见[导出格式](/zh-cn/docs/project-management/export-formats/)。

### 导出的字体与 Unity 兼容吗？

兼容。`.fnt` 文件配合 TextMeshPro 和 NGUI 都能用。想要像素完美的渲染，在 Unity 里把纹理过滤模式设成"Point"（或"Nearest"）。

## 字体质量与渲染

### 为什么我的字体看起来很模糊？

多半是纹理过滤的问题。在游戏引擎或应用里把纹理过滤改成"Point"或"Nearest"，文本要在整数位置渲染，别缩放。详见[锐利渲染](/zh-cn/docs/font-design/sharp/)。

### 如何修复不正确的字符间距？

可能是字偶距或字体度量没设对。导出前查一下字偶距对和基线设置。详见[字偶距](/zh-cn/docs/font-design/kerning-pairs/)和[字形度量](/zh-cn/docs/font-design/glyph-metrics/)。

### 如何创建像素完美的字体？

1.  用专门做像素艺术的字体。
2.  字体大小跟目标分辨率严格匹配。
3.  关掉抗锯齿和字体平滑。
4.  字符对齐到像素网格。

详见[锐利渲染](/zh-cn/docs/font-design/sharp/)和[字体大小](/zh-cn/docs/font-design/font-size/)。

## 性能

### 为什么应用程序运行缓慢或卡顿？

字符集太大或字体太复杂时可能卡。试试：
-   **精简字符集：** 只留要用的字形。
-   **加大纹理尺寸：** 降低打包算法压力。
-   **关掉其他标签页：** 释放内存。

详见[纹理打包](/zh-cn/docs/font-design/texture-packing/)和[字符集](/zh-cn/docs/font-design/character-sets/)。

### 我收到了"内存不足"的错误。我该怎么办？

生成大型字体图集时可能碰到。试试：
-   **减小纹理尺寸。**
-   **字符集拆分**成多个小字体文件。
-   **用二进制导出格式，** 更省内存。

## 导入与自定义

### 我可以导入自己的字体吗？

可以，上传 `.ttf`、`.otf`、`.woff` 文件就行。不过 SnowB BMF 读不到你系统里已安装的字体。详见[字体导入](/zh-cn/docs/font-design/font-import/)。

### 如何使用自定义图像作为字符？

1.  导入带透明度的 PNG 图像。
2.  给每个图像分配一个 Unicode 值。
3.  调整图像字形的位置和缩放。
4.  导出字体，图像字形会打包进图集。

详见[图像字形](/zh-cn/docs/font-design/image-glyphs/)。

### 导入旧版项目文件会发生什么？

SnowB BMF 自动转换旧版文件。打开后检查设置对不对，然后另存为 `.sbf`。

## 新功能

### SnowB BMF 支持 SDF/MSDF 字体吗？

支持，实验性功能，五种渲染模式：**默认模式**（标准 Canvas 渲染）、**SDF**（Felzenszwalb EDT 有向距离场）、**PSDF**（msdfgen WASM 伪 SDF）、**MSDF**（msdfgen WASM 多通道 SDF）、**MTSDF**（msdfgen WASM 多通道 + 真实 SDF）。SDF 字体分辨率无关，适合游戏引擎。PSDF、MSDF、MTSDF 要先上传字体文件。详见 [SDF 渲染文档](/zh-cn/docs/font-design/sdf-rendering/)。

### 什么是渐变预设？

内置 10 个渐变预设，点一下就能用。自定义的渐变也能存成预设，跨项目复用，不要的随时删。预设选择器在填充设置面板的渐变区域。详见[填充样式](/zh-cn/docs/font-design/fill-styles/)。

### 什么是内阴影功能？

在字形内部画阴影，做出雕刻或浮雕的感觉。可以跟外阴影一起用，叠出多层立体效果。阴影设置面板里调颜色、模糊、偏移和不透明度。详见[内阴影效果](/zh-cn/docs/font-design/inner-shadow-effects/)。

### SnowB BMF 支持可变字体吗？

支持。导入 TTF/OTF/WOFF 时自动检测可变字体，显示变体轴控制（字重、字宽、斜体、自定义轴）。拖滑块调参数，生成位图前微调字体外观。详见[可变字体](/zh-cn/docs/font-design/variable-fonts/)。

### 我可以导入 TTC（TrueType Collection）文件吗？

可以。导入 TTC 文件时弹出字体选择对话框，从合集里选一个或多个字体导入。详见[字体导入](/zh-cn/docs/font-design/font-import/)。

### 什么是有序网格打包？

第三种纹理打包模式，跟自动和固定并列。按行列有序排列字形，可以设列数，生成规则的网格布局。某些游戏引擎有这种需求。详见[纹理打包](/zh-cn/docs/font-design/texture-packing/)。

### SnowB BMF 可以离线使用吗？

可以。SnowB BMF 是 PWA，加载一次后就能离线用。可以装成本地应用，断网也能做字体。上线后自动检查更新。详见 [PWA 与离线](/zh-cn/docs/project-management/pwa-offline/)。

### 在哪里可以找到快捷键？

看[快捷键](/zh-cn/docs/getting-started/keyboard-shortcuts/)页面。常用的有 Space+拖拽平移画布、Ctrl+滚轮缩放等。

## 数据与存储

### 自动保存是如何工作的？

SnowB BMF 自动把所有项目存到浏览器 IndexedDB。触发时机：离开页面（`beforeunload`）和标签页不可见时（`visibilitychange`）。项目用 Protocol Buffer 编码。清浏览器数据会丢已保存项目，记得留 `.sbf` 备份。详见[项目管理](/zh-cn/docs/project-management/project-operations/)。

### 什么是 xFractional 设置？

实验性功能，用定点数格式给字形度量加亚像素精度。开启后 xAdvance、xOffset 等度量用小数值，小尺寸下文本渲染更平滑。高级选项，大部分人不用管。
