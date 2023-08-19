import { IMapDidChange, IObjectDidChange } from 'mobx'
import { IDisposer } from 'mobx-utils/lib/utils'

declare module 'mobx-utils/lib/deepObserve' {
  declare type IChange = IObjectDidChange | IMapDidChange

  declare function deepObserve<T = unknown>(
    target: T,
    listener: (change: IChange, path: string, root: T) => void,
  ): IDisposer
}
