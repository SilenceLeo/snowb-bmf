import { IProject as IProjectNext } from '../1.3.0/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  return {
    ...project,
    style: {
      ...project.style,
      useInnerShadow: false,
      innerShadow: null,
    },
  } as unknown as IProjectNext
}
