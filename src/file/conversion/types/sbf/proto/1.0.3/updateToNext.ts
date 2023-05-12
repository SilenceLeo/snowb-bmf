import { IProject } from './project'
import { IProject as IProjectNext, IFill } from '../project'

export default function updateToNext(project: IProject): IProjectNext {
  if (project.style?.stroke) {
    ;(project.style?.stroke as IFill).strokeType = 0
  }
  return project
}
