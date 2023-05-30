import { action, observable, runInAction, computed } from 'mobx'

import Project from './project'

class Workspace {
  @observable activeId = 0

  @observable.shallow projectList: Map<number, Project> = new Map()

  constructor() {
    runInAction(() => {
      this.activeId = Date.now()
      const project = new Project({ id: this.activeId })
      this.projectList.set(project.id, project)
    })
  }

  @computed get currentProject(): Project {
    return this.projectList.get(this.activeId) as Project
  }

  @computed get namedList(): { id: number; name: string }[] {
    const list: { id: number; name: string }[] = []
    this.projectList.forEach((value) => {
      list.push({
        id: value.id,
        name: value.name,
      })
    })
    return list
  }

  @action.bound selectProject(id: number): void {
    if (this.projectList.has(id)) this.activeId = id
  }

  @action.bound removeProject(id: number): void {
    const list = this.namedList.filter((item) => item.id !== id)
    if (list.length === 0) return
    this.activeId = list[0].id
    this.projectList.delete(id)
  }

  @action.bound addProject(p: Partial<Project> = {}): number {
    if (p.id && this.projectList.has(p.id)) {
      this.activeId = p.id
      return 1
    }
    if (!p.name) {
      p.name = 'Unnamed'
      const namedList: number[] = []
      this.projectList.forEach((item) => {
        const named = item.name.match(/^Unnamed-?(\d+)?$/)
        if (named) {
          namedList.push(Number(named[1]) || 0)
        }
      })
      if (namedList.length > 0) {
        p.name += `-${Math.max(...namedList) + 1}`
      }
    }

    const project = new Project(p)
    this.projectList.set(project.id, project)
    this.activeId = project.id
    return 0
  }

  @action.bound setProjectName(name: string, value: number): void {
    const project = this.projectList.get(value)
    if (project) {
      project.setName(name)
    }
  }
}

export default Workspace
