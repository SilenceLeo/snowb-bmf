import { IGradientColor, IProject as IProjectNext } from '../1.0.2/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
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
