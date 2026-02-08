import type { IProject } from './1.2.1/project'
import { CURRENT_VERSION, allProto } from './index'

export default function updateOldProject(
  project: IProject,
  version: number,
): IProject {
  let currentProject: IProject = project

  const versions = Object.keys(allProto)
    .map(Number)
    .sort((a, b) => a - b)

  for (const v of versions) {
    if (
      version <= v &&
      v < CURRENT_VERSION &&
      allProto[v as keyof typeof allProto]
    ) {
      currentProject =
        allProto[v as keyof typeof allProto].updateToNext(currentProject)
    }
  }

  return currentProject
}
