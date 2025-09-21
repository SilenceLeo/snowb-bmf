import { IFont, IProject as IProjectNext } from '../1.1.0/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  if (project.style?.font?.font) {
    ;(project.style.font as IFont).fonts = [{ font: project.style.font.font }]
  }
  return project
}
