import { action, observable } from 'mobx'

class Ui {
  @observable globalLoader = 0

  @action.bound showGlobalLoader(num = 1): void {
    this.globalLoader += num
  }

  @action.bound hideGlobalLoader(num = -1): void {
    this.globalLoader += num
  }
}

export default Ui
