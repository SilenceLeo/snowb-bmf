# Plan: 补充第三方许可证归属

## Context

项目已完成 msdfgen (MIT) 和 FreeType (FTL) 的归属（`THIRD_PARTY_LICENSES.md`、`msdfgenWasm.ts` 注释头、`README.md` Acknowledgments）。用户询问是否还有其他依赖需要添加归属。

## 调查结果

经全面排查，除已归属的 msdfgen/FreeType 外，还有以下值得关注的项目：

| 项目 | 许可证 | 需要归属？ | 说明 |
|------|--------|-----------|------|
| **msdfgen** | MIT | 已完成 | 已在 THIRD_PARTY_LICENSES.md |
| **FreeType** | FTL | 已完成 | 已在 THIRD_PARTY_LICENSES.md |
| **jszip** | MIT OR GPL-3.0 | 建议明确 | 双许可证，建议声明选择 MIT |
| **protobufjs** | BSD-3-Clause | 可选 | 标准 npm 包，BSD-3 要求保留版权声明（npm 包自带） |
| **dexie** | Apache-2.0 | 可选 | npm 包自带 LICENSE |
| **Felzenszwalb/Huttenlocher EDT** | 学术算法 | 不需要 | TypeScript 重新实现，非复制代码，已有论文引用注释 |
| **rectangle-packer** | MIT | 不需要 | 项目作者自己的 npm 包 |

## 结论

**真正需要处理的只有 1 项：**

### jszip 许可证声明

jszip 使用 `(MIT OR GPL-3.0-or-later)` 双许可证。虽然 npm 包通常不需要额外归属，但明确声明选择 MIT 可避免 GPL copyleft 传染的歧义。

**方案：** 在 `THIRD_PARTY_LICENSES.md` 末尾添加 jszip 的 MIT 许可证选择声明。

其他 npm 依赖（protobufjs BSD-3、dexie Apache-2.0 等）都是标准开源许可证，通过 npm 分发时自带 LICENSE 文件，**不需要额外归属**。

## 变更

### 文件：`THIRD_PARTY_LICENSES.md`

在 FreeType 段落后添加：

```markdown
---

## JSZip

- **Repository:** https://github.com/Stuk/jszip
- **License:** MIT (dual-licensed under MIT OR GPL-3.0-or-later; this project uses under the MIT license)
- **Copyright:** Copyright (c) 2009-2016 Stuart Knightley, David Duber, Alain Deseine, and contributors
```

（无需完整 MIT 文本，因为 msdfgen 段落已包含。引用即可。）

## 验证

1. 确认 `THIRD_PARTY_LICENSES.md` 新增 jszip 段落
2. `yarn build` 构建成功
