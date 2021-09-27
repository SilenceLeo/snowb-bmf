import { ConfigItem } from './type'
import text from './types/text'
import xml from './types/xml'

const list = [text, xml]

export const configList: ConfigItem[] = []

list.forEach(({ type, exts, getString }) => {
  exts.forEach((ext) => {
    configList.push({
      id: type + ext,
      ext,
      type,
      getString,
    })
  })
})

export * from './type'
export * from './toBmfInfo'
export { default as toBmfInfo } from './toBmfInfo'
export { default as exportFile } from './exportFile'
export default configList
