/**
 * Legend State Persistence Module
 *
 * Provides serialization and deserialization utilities for
 * converting Legend State store data to/from Protocol Buffer format.
 *
 * Usage:
 * - Use serializeProject() to convert current state to Protocol Buffer compatible format
 * - Use deserializeProject() to load saved data into Legend State stores
 */

// Serialization
export {
  serializeProject,
  serializeProjectById,
  getProjectMeta,
  validateSerializedProject,
  type SerializableProject,
} from './serialize'

// Deserialization
export {
  deserializeProject,
  initializeImageGlyphSources,
  validateDecodedProject,
  type DecodedProject,
} from './deserialize'
