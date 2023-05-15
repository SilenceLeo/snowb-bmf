import { IProject, oldProto, OldProto } from './proto/index'

type OldKey = keyof OldProto

const verions: OldKey[] = Object.keys(oldProto)
  .map((verion) => `${Number(verion)}` as unknown as OldKey)
  .sort()

function updateOldProject(project: IProject, version: number): IProject {
  verions.forEach((v) => {
    if (version <= v && oldProto[v]) oldProto[v].updateToNext(project)
  })
  return project
}

export default updateOldProject
