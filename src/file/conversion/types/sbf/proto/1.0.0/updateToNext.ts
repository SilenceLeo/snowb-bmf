import { IProject } from './project'
import { IProject as IProjectNext } from '../1.0.1'

export default function updateToNext(project: IProject): IProjectNext {
  const next = project as IProjectNext
  next.layout = { ...project.layout }
  next.layout.width = 1024
  next.layout.height = 1024
  next.layout.auto = true
  next.layout.fixedSize = false
  return next
}
