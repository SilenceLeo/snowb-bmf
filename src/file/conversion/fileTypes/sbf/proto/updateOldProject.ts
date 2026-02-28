import type { IProject } from './1.2.2/project'
// NOTE: Circular dependency with ./index.ts. This works due to JavaScript's
// module initialization order but should ideally be refactored by extracting
// CURRENT_VERSION and allProto to a separate constants file.
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
