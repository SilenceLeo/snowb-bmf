import { IProject, IGradientColor } from 'src/proto'

type TransProject = (project: IProject) => IProject
interface VersionMap {
  [key: number]: TransProject
}

function f1000000t1000001(project: IProject) {
  project.layout = { ...project.layout }
  project.layout.width = 1024
  project.layout.height = 1024
  project.layout.auto = true
  project.layout.fixedSize = false
  return project
}

function f1000001t1000002(project: IProject) {
  function fixOffset(list: IGradientColor[]) {
    const len = list.length - 1
    list.forEach((item, idx) => {
      item.offset = (1 / len) * idx
    })
  }
  if (
    project?.style?.fill?.gradient?.palette &&
    project.style.fill.gradient.palette.length > 0
  ) {
    fixOffset(project.style.fill.gradient.palette)
  }

  if (
    project?.style?.stroke?.gradient?.palette &&
    project.style.stroke.gradient.palette.length > 0
  ) {
    fixOffset(project.style.stroke.gradient.palette)
  }

  return project
}

const obj: VersionMap = {
  1000000: f1000000t1000001,
  1000001: f1000001t1000002,
}

const verions: (keyof VersionMap)[] = Object.keys(obj)
  .map((verion) => Number(verion))
  .sort()

function updateOldProject(project: IProject, version: number): IProject {
  verions.forEach((v) => {
    if (version <= v && obj[v]) obj[v](project)
  })
  return project
}

export default updateOldProject
