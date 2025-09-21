import { IFill, IProject as IProjectNext } from '../1.1.2/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  if (project.style?.stroke) {
    ;(project.style?.stroke as IFill).strokeType =
      (project.style?.stroke as IFill)?.strokeType || 0
  }
  return project
}
