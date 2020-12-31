import { IProject } from 'src/proto'

type TransProject = (project: IProject) => IProject
interface VersionMap {
  [key: number]: TransProject
}

function f10000t10001(project: IProject) {
  project.layout = { ...project.layout }
  project.layout.width = 1024
  project.layout.height = 1024
  project.layout.auto = true
  project.layout.fixedSize = false
  return project
}

const obj: VersionMap = {
  10000: f10000t10001,
}

const verions: (keyof VersionMap)[] = Object.keys(obj)
  .map((verion) => Number(verion))
  .sort()

function updateOldProject(project: IProject, version: number): IProject {
  verions.forEach((v) => {
    if (version >= v && obj[v]) obj[v](project)
  })
  return project
}

export default updateOldProject
