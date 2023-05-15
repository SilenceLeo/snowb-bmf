import { IProject } from './project'
import { IProject as IProjectNext, IFont } from '../1.0.3'

export default function updateToNext(project: IProject): IProjectNext {
  if (project.style?.font?.font) {
    ;(project.style.font as IFont).fonts = [{ font: project.style.font.font }]
  }
  return project
}
