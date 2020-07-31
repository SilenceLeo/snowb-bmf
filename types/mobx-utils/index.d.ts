import {
  IObjectDidChange,
  // IArrayChange,
  // IArraySplice,
  IMapDidChange,
} from 'mobx'
import { IDisposer } from 'mobx-utils/lib/utils'

declare module 'mobx-utils/lib/deepObserve' {
  declare type IChange = IObjectDidChange | IMapDidChange
  // | IArrayChange
  // | IArraySplice

  declare function deepObserve<T = unknown>(
    target: T,
    listener: (change: IChange, path: string, root: T) => void,
  ): IDisposer
}
