import binary from './fileTypes/binary'
import text from './fileTypes/text'
import xml from './fileTypes/xml'
import { ConfigItem } from './type'

const list = [text, xml, binary]

export const configList: ConfigItem[] = []

list.forEach(({ type, exts, getContent }) => {
  exts.forEach((ext) => {
    configList.push({
      id: type + ext,
      ext,
      type,
      getContent,
    })
  })
})

export { default as exportFile } from './exportFile'
export * from './toBmfInfo'
export { default as toBmfInfo } from './toBmfInfo'
export * from './type'
export default configList
