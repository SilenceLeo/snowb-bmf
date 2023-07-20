import { action, observable, computed, makeObservable, runInAction } from 'mobx'

import Project from './project'

class Workspace {
  activeId = 0

  projectList: Map<number, Project> = new Map()

  constructor() {
    makeObservable(this, {
      activeId: observable,
      projectList: observable.shallow,
      currentProject: computed,
      namedList: computed,
      selectProject: action.bound,
      removeProject: action.bound,
      addProject: action.bound,
      setProjectName: action.bound,
    })

    runInAction(() => {
      this.activeId = Date.now()
      const project = new Project({ id: this.activeId })
      this.projectList.set(project.id, project)
    })
  }

  get currentProject(): Project {
    return this.projectList.get(this.activeId) as Project
  }

  get namedList(): { id: number; name: string }[] {
    const list: { id: number; name: string }[] = []
    this.projectList.forEach((value) => {
      list.push({
        id: value.id,
        name: value.name,
      })
    })
    return list
  }

  selectProject(id: number): void {
    if (this.projectList.has(id)) this.activeId = id
  }

  removeProject(id: number): void {
    const list = this.namedList.filter((item) => item.id !== id)
    if (list.length === 0) return
    this.activeId = list[0].id
    this.projectList.delete(id)
  }

  addProject(p: Partial<Project> = {}): number {
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

  setProjectName(name: string, value: number): void {
    const project = this.projectList.get(value)
    if (project) {
      project.setName(name)
    }
  }
}

export default Workspace
