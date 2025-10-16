import { IProject as IProjectNext } from '../1.2.1/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  // Add sharp field to font with default value 80
  const updatedProject = { ...project } as any

  // Add sharp field to font
  if (updatedProject.style?.font) {
    // Set default sharp value to 80 if not present
    updatedProject.style.font.sharp = 80
  }

  return updatedProject as IProjectNext
}
