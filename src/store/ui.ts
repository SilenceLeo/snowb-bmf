import { action, observable, makeObservable } from 'mobx'

class Ui {
  globalLoader = 0

  constructor() {
    makeObservable(this, {
      globalLoader: observable,
      showGlobalLoader: action.bound,
      hideGlobalLoader: action.bound,
    })
  }

  showGlobalLoader(num = 1): void {
    this.globalLoader += num
  }

  hideGlobalLoader(num = -1): void {
    this.globalLoader += num
  }
}

export default Ui
