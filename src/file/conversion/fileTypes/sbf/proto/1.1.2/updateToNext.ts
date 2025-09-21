import { IProject as IProjectNext } from '../1.2.0/project'
import { IProject } from './project'

export default function updateToNext(project: IProject): IProjectNext {
  // Add page support with default values
  const updatedProject = { ...project } as any

  // Add page field to layout with default value 1
  if (updatedProject.layout) {
    updatedProject.layout.page = 1
  }

  // Add page field to all font glyphs with default value 0
  if (updatedProject.glyphs) {
    Object.values(updatedProject.glyphs).forEach((glyph: any) => {
      if (glyph) {
        glyph.page = 0
      }
    })
  }

  // Add page field to all image glyphs with default value 0
  if (updatedProject.glyphImages) {
    updatedProject.glyphImages.forEach((glyph: any) => {
      if (glyph) {
        glyph.page = 0
      }
    })
  }

  return updatedProject as IProjectNext
}
