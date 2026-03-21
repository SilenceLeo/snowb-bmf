import binary from './fileTypes/binary'
import c from './fileTypes/c'
import json from './fileTypes/json'
import msdfAtlasJson from './fileTypes/msdfAtlasJson'
import text from './fileTypes/text'
import xml from './fileTypes/xml'
import { ConfigItem } from './type'

const list = [text, xml, binary, c, json, msdfAtlasJson]

export const configList: ConfigItem[] = []

list.forEach(
  ({
    type,
    exts,
    getContent,
    getFiles,
    includePng,
    supportsPixelFormat,
    supportsBlur,
    supportsTextures,
    supportsExtended,
    supportsDistanceField,
  }) => {
    exts.forEach((ext) => {
      configList.push({
        id: type + ext,
        ext,
        type,
        getContent,
        getFiles,
        includePng,
        supportsPixelFormat,
        supportsBlur,
        supportsTextures,
        supportsExtended,
        supportsDistanceField,
      })
    })
  },
)

export { default as exportFile } from './exportFile'
export { default as toBmfInfo } from './toBmfInfo'
export * from './type'
export default configList
