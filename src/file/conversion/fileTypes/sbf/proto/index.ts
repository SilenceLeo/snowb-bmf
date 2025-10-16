// Import version-specific protobuf types and updaters
import * as v1000000Project from './1.0.0/project'
import v1000000UpdateToNext from './1.0.0/updateToNext'
import * as v1000001Project from './1.0.1/project'
import v1000001UpdateToNext from './1.0.1/updateToNext'
import * as v1000002Project from './1.0.2/project'
import v1000002UpdateToNext from './1.0.2/updateToNext'
import * as v1001000Project from './1.1.0/project'
import v1001000UpdateToNext from './1.1.0/updateToNext'
import * as v1001001Project from './1.1.1/project'
import v1001001UpdateToNext from './1.1.1/updateToNext'
import * as v1001002Project from './1.1.2/project'
import v1001002UpdateToNext from './1.1.2/updateToNext'
import * as v1002000Project from './1.2.0/project'
import v1002000UpdateToNext from './1.2.0/updateToNext'
import * as v1002001Project from './1.2.1/project'
import v1002001UpdateToNext from './1.2.1/updateToNext'

export interface ProtoVersion {
  Project: any
  updateToNext: (project: any) => any
}

export interface AllProto {
  1000000: ProtoVersion
  1000001: ProtoVersion
  1000002: ProtoVersion
  1001000: ProtoVersion
  1001001: ProtoVersion
  1001002: ProtoVersion
  1002000: ProtoVersion
  1002001: ProtoVersion
}

export const allProto: AllProto = {
  1000000: {
    Project: v1000000Project.Project,
    updateToNext: v1000000UpdateToNext,
  },
  1000001: {
    Project: v1000001Project.Project,
    updateToNext: v1000001UpdateToNext,
  },
  1000002: {
    Project: v1000002Project.Project,
    updateToNext: v1000002UpdateToNext,
  },
  1001000: {
    Project: v1001000Project.Project,
    updateToNext: v1001000UpdateToNext,
  },
  1001001: {
    Project: v1001001Project.Project,
    updateToNext: v1001001UpdateToNext,
  },
  1001002: {
    Project: v1001002Project.Project,
    updateToNext: v1001002UpdateToNext,
  },
  1002000: {
    Project: v1002000Project.Project,
    updateToNext: v1002000UpdateToNext,
  },
  1002001: {
    Project: v1002001Project.Project,
    updateToNext: v1002001UpdateToNext,
  },
}

// Current version (latest)
export const CURRENT_VERSION = 1002001

// Export utilities
export { default as encodeProject } from './encodeProject'
export { default as toOriginBuffer } from './toOriginBuffer'
export { default as updateOldProject } from './updateOldProject'
export * from './1.2.1/project'
export { default } from './1.2.1/project'

// Legacy export for backward compatibility
export const oldProto = allProto
