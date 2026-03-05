import { IProject as IProjectNext } from '../1.2.2/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  return {
    ...project,
    style: {
      ...project.style,
      render: null,  // new field — deserialize layer provides defaults
    },
    extensions: null,  // new field — reserved for future use
  } as unknown as IProjectNext
}
