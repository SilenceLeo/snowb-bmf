import { IProject } from './project'
import { IProject as IProjectNext, IFont } from '../'

export default function updateToNext(project: IProject): IProjectNext {
  if (project.style?.font?.font) {
    ;(project.style.font as IFont).fonts = [{ font: project.style.font.font }]
  }
  return project
}
