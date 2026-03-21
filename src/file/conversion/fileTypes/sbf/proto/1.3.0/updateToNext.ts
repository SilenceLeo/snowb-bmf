import { IProject } from './project'

// No-op: v1.3.0 is the current version. This function exists to maintain
// the migration chain pattern.
export default function updateToNext(project: IProject): IProject {
  return project
}
