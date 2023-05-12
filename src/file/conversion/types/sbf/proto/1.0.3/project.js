/* eslint-disable */
import * as $protobuf from 'protobufjs/minimal'

// Common aliases
const $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util

// Exported root namespace
const $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {})

export const Metric = ($root.Metric = (() => {
  /**
   * Properties of a Metric.
   * @exports IMetric
   * @interface IMetric
   * @property {number|null} [xAdvance] Metric xAdvance
   * @property {number|null} [xOffset] Metric xOffset
   * @property {number|null} [yOffset] Metric yOffset
   */

  /**
   * Constructs a new Metric.
   * @exports Metric
   * @classdesc Represents a Metric.
   * @implements IMetric
   * @constructor
   * @param {IMetric=} [properties] Properties to set
   */
  function Metric(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Metric xAdvance.
   * @member {number} xAdvance
   * @memberof Metric
   * @instance
   */
  Metric.prototype.xAdvance = 0

  /**
   * Metric xOffset.
   * @member {number} xOffset
   * @memberof Metric
   * @instance
   */
  Metric.prototype.xOffset = 0

  /**
   * Metric yOffset.
   * @member {number} yOffset
   * @memberof Metric
   * @instance
   */
  Metric.prototype.yOffset = 0

  /**
   * Creates a new Metric instance using the specified properties.
   * @function create
   * @memberof Metric
   * @static
   * @param {IMetric=} [properties] Properties to set
   * @returns {Metric} Metric instance
   */
  Metric.create = function create(properties) {
    return new Metric(properties)
  }

  /**
   * Encodes the specified Metric message. Does not implicitly {@link Metric.verify|verify} messages.
   * @function encode
   * @memberof Metric
   * @static
   * @param {IMetric} message Metric message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Metric.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (
      message.xAdvance != null &&
      Object.hasOwnProperty.call(message, 'xAdvance')
    )
      writer.uint32(/* id 1, wireType 0 =*/ 8).sint32(message.xAdvance)
    if (
      message.xOffset != null &&
      Object.hasOwnProperty.call(message, 'xOffset')
    )
      writer.uint32(/* id 2, wireType 0 =*/ 16).sint32(message.xOffset)
    if (
      message.yOffset != null &&
      Object.hasOwnProperty.call(message, 'yOffset')
    )
      writer.uint32(/* id 3, wireType 0 =*/ 24).sint32(message.yOffset)
    return writer
  }

  /**
   * Encodes the specified Metric message, length delimited. Does not implicitly {@link Metric.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Metric
   * @static
   * @param {IMetric} message Metric message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Metric.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Metric message from the specified reader or buffer.
   * @function decode
   * @memberof Metric
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Metric} Metric
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Metric.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Metric()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.xAdvance = reader.sint32()
          break
        case 2:
          message.xOffset = reader.sint32()
          break
        case 3:
          message.yOffset = reader.sint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Metric message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Metric
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Metric} Metric
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Metric.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Metric message.
   * @function verify
   * @memberof Metric
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Metric.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.xAdvance != null && message.hasOwnProperty('xAdvance'))
      if (!$util.isInteger(message.xAdvance))
        return 'xAdvance: integer expected'
    if (message.xOffset != null && message.hasOwnProperty('xOffset'))
      if (!$util.isInteger(message.xOffset)) return 'xOffset: integer expected'
    if (message.yOffset != null && message.hasOwnProperty('yOffset'))
      if (!$util.isInteger(message.yOffset)) return 'yOffset: integer expected'
    return null
  }

  /**
   * Creates a Metric message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Metric
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Metric} Metric
   */
  Metric.fromObject = function fromObject(object) {
    if (object instanceof $root.Metric) return object
    let message = new $root.Metric()
    if (object.xAdvance != null) message.xAdvance = object.xAdvance | 0
    if (object.xOffset != null) message.xOffset = object.xOffset | 0
    if (object.yOffset != null) message.yOffset = object.yOffset | 0
    return message
  }

  /**
   * Creates a plain object from a Metric message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Metric
   * @static
   * @param {Metric} message Metric
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Metric.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.xAdvance = 0
      object.xOffset = 0
      object.yOffset = 0
    }
    if (message.xAdvance != null && message.hasOwnProperty('xAdvance'))
      object.xAdvance = message.xAdvance
    if (message.xOffset != null && message.hasOwnProperty('xOffset'))
      object.xOffset = message.xOffset
    if (message.yOffset != null && message.hasOwnProperty('yOffset'))
      object.yOffset = message.yOffset
    return object
  }

  /**
   * Converts this Metric to JSON.
   * @function toJSON
   * @memberof Metric
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Metric.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Metric
})())

export const GradientColor = ($root.GradientColor = (() => {
  /**
   * Properties of a GradientColor.
   * @exports IGradientColor
   * @interface IGradientColor
   * @property {number|null} [id] GradientColor id
   * @property {number|null} [offset] GradientColor offset
   * @property {string|null} [color] GradientColor color
   */

  /**
   * Constructs a new GradientColor.
   * @exports GradientColor
   * @classdesc Represents a GradientColor.
   * @implements IGradientColor
   * @constructor
   * @param {IGradientColor=} [properties] Properties to set
   */
  function GradientColor(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * GradientColor id.
   * @member {number} id
   * @memberof GradientColor
   * @instance
   */
  GradientColor.prototype.id = 0

  /**
   * GradientColor offset.
   * @member {number} offset
   * @memberof GradientColor
   * @instance
   */
  GradientColor.prototype.offset = 0

  /**
   * GradientColor color.
   * @member {string} color
   * @memberof GradientColor
   * @instance
   */
  GradientColor.prototype.color = ''

  /**
   * Creates a new GradientColor instance using the specified properties.
   * @function create
   * @memberof GradientColor
   * @static
   * @param {IGradientColor=} [properties] Properties to set
   * @returns {GradientColor} GradientColor instance
   */
  GradientColor.create = function create(properties) {
    return new GradientColor(properties)
  }

  /**
   * Encodes the specified GradientColor message. Does not implicitly {@link GradientColor.verify|verify} messages.
   * @function encode
   * @memberof GradientColor
   * @static
   * @param {IGradientColor} message GradientColor message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GradientColor.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.id != null && Object.hasOwnProperty.call(message, 'id'))
      writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.id)
    if (message.offset != null && Object.hasOwnProperty.call(message, 'offset'))
      writer.uint32(/* id 2, wireType 5 =*/ 21).float(message.offset)
    if (message.color != null && Object.hasOwnProperty.call(message, 'color'))
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.color)
    return writer
  }

  /**
   * Encodes the specified GradientColor message, length delimited. Does not implicitly {@link GradientColor.verify|verify} messages.
   * @function encodeDelimited
   * @memberof GradientColor
   * @static
   * @param {IGradientColor} message GradientColor message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GradientColor.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a GradientColor message from the specified reader or buffer.
   * @function decode
   * @memberof GradientColor
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {GradientColor} GradientColor
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GradientColor.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.GradientColor()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32()
          break
        case 2:
          message.offset = reader.float()
          break
        case 3:
          message.color = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a GradientColor message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof GradientColor
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {GradientColor} GradientColor
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GradientColor.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a GradientColor message.
   * @function verify
   * @memberof GradientColor
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  GradientColor.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.id != null && message.hasOwnProperty('id'))
      if (!$util.isInteger(message.id)) return 'id: integer expected'
    if (message.offset != null && message.hasOwnProperty('offset'))
      if (typeof message.offset !== 'number') return 'offset: number expected'
    if (message.color != null && message.hasOwnProperty('color'))
      if (!$util.isString(message.color)) return 'color: string expected'
    return null
  }

  /**
   * Creates a GradientColor message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof GradientColor
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {GradientColor} GradientColor
   */
  GradientColor.fromObject = function fromObject(object) {
    if (object instanceof $root.GradientColor) return object
    let message = new $root.GradientColor()
    if (object.id != null) message.id = object.id | 0
    if (object.offset != null) message.offset = Number(object.offset)
    if (object.color != null) message.color = String(object.color)
    return message
  }

  /**
   * Creates a plain object from a GradientColor message. Also converts values to other types if specified.
   * @function toObject
   * @memberof GradientColor
   * @static
   * @param {GradientColor} message GradientColor
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  GradientColor.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.id = 0
      object.offset = 0
      object.color = ''
    }
    if (message.id != null && message.hasOwnProperty('id'))
      object.id = message.id
    if (message.offset != null && message.hasOwnProperty('offset'))
      object.offset =
        options.json && !isFinite(message.offset)
          ? String(message.offset)
          : message.offset
    if (message.color != null && message.hasOwnProperty('color'))
      object.color = message.color
    return object
  }

  /**
   * Converts this GradientColor to JSON.
   * @function toJSON
   * @memberof GradientColor
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  GradientColor.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return GradientColor
})())

export const Gradient = ($root.Gradient = (() => {
  /**
   * Properties of a Gradient.
   * @exports IGradient
   * @interface IGradient
   * @property {number|null} [type] Gradient type
   * @property {number|null} [angle] Gradient angle
   * @property {Array.<IGradientColor>|null} [palette] Gradient palette
   */

  /**
   * Constructs a new Gradient.
   * @exports Gradient
   * @classdesc Represents a Gradient.
   * @implements IGradient
   * @constructor
   * @param {IGradient=} [properties] Properties to set
   */
  function Gradient(properties) {
    this.palette = []
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Gradient type.
   * @member {number} type
   * @memberof Gradient
   * @instance
   */
  Gradient.prototype.type = 0

  /**
   * Gradient angle.
   * @member {number} angle
   * @memberof Gradient
   * @instance
   */
  Gradient.prototype.angle = 0

  /**
   * Gradient palette.
   * @member {Array.<IGradientColor>} palette
   * @memberof Gradient
   * @instance
   */
  Gradient.prototype.palette = $util.emptyArray

  /**
   * Creates a new Gradient instance using the specified properties.
   * @function create
   * @memberof Gradient
   * @static
   * @param {IGradient=} [properties] Properties to set
   * @returns {Gradient} Gradient instance
   */
  Gradient.create = function create(properties) {
    return new Gradient(properties)
  }

  /**
   * Encodes the specified Gradient message. Does not implicitly {@link Gradient.verify|verify} messages.
   * @function encode
   * @memberof Gradient
   * @static
   * @param {IGradient} message Gradient message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Gradient.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.type != null && Object.hasOwnProperty.call(message, 'type'))
      writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.type)
    if (message.angle != null && Object.hasOwnProperty.call(message, 'angle'))
      writer.uint32(/* id 2, wireType 5 =*/ 21).float(message.angle)
    if (message.palette != null && message.palette.length)
      for (let i = 0; i < message.palette.length; ++i)
        $root.GradientColor.encode(
          message.palette[i],
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
        ).ldelim()
    return writer
  }

  /**
   * Encodes the specified Gradient message, length delimited. Does not implicitly {@link Gradient.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Gradient
   * @static
   * @param {IGradient} message Gradient message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Gradient.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Gradient message from the specified reader or buffer.
   * @function decode
   * @memberof Gradient
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Gradient} Gradient
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Gradient.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Gradient()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32()
          break
        case 2:
          message.angle = reader.float()
          break
        case 3:
          if (!(message.palette && message.palette.length)) message.palette = []
          message.palette.push(
            $root.GradientColor.decode(reader, reader.uint32()),
          )
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Gradient message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Gradient
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Gradient} Gradient
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Gradient.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Gradient message.
   * @function verify
   * @memberof Gradient
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Gradient.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.type != null && message.hasOwnProperty('type'))
      if (!$util.isInteger(message.type)) return 'type: integer expected'
    if (message.angle != null && message.hasOwnProperty('angle'))
      if (typeof message.angle !== 'number') return 'angle: number expected'
    if (message.palette != null && message.hasOwnProperty('palette')) {
      if (!Array.isArray(message.palette)) return 'palette: array expected'
      for (let i = 0; i < message.palette.length; ++i) {
        let error = $root.GradientColor.verify(message.palette[i])
        if (error) return 'palette.' + error
      }
    }
    return null
  }

  /**
   * Creates a Gradient message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Gradient
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Gradient} Gradient
   */
  Gradient.fromObject = function fromObject(object) {
    if (object instanceof $root.Gradient) return object
    let message = new $root.Gradient()
    if (object.type != null) message.type = object.type | 0
    if (object.angle != null) message.angle = Number(object.angle)
    if (object.palette) {
      if (!Array.isArray(object.palette))
        throw TypeError('.Gradient.palette: array expected')
      message.palette = []
      for (let i = 0; i < object.palette.length; ++i) {
        if (typeof object.palette[i] !== 'object')
          throw TypeError('.Gradient.palette: object expected')
        message.palette[i] = $root.GradientColor.fromObject(object.palette[i])
      }
    }
    return message
  }

  /**
   * Creates a plain object from a Gradient message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Gradient
   * @static
   * @param {Gradient} message Gradient
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Gradient.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.arrays || options.defaults) object.palette = []
    if (options.defaults) {
      object.type = 0
      object.angle = 0
    }
    if (message.type != null && message.hasOwnProperty('type'))
      object.type = message.type
    if (message.angle != null && message.hasOwnProperty('angle'))
      object.angle =
        options.json && !isFinite(message.angle)
          ? String(message.angle)
          : message.angle
    if (message.palette && message.palette.length) {
      object.palette = []
      for (let j = 0; j < message.palette.length; ++j)
        object.palette[j] = $root.GradientColor.toObject(
          message.palette[j],
          options,
        )
    }
    return object
  }

  /**
   * Converts this Gradient to JSON.
   * @function toJSON
   * @memberof Gradient
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Gradient.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Gradient
})())

export const PatternTexture = ($root.PatternTexture = (() => {
  /**
   * Properties of a PatternTexture.
   * @exports IPatternTexture
   * @interface IPatternTexture
   * @property {Uint8Array|null} [buffer] PatternTexture buffer
   * @property {number|null} [scale] PatternTexture scale
   * @property {string|null} [repetition] PatternTexture repetition
   */

  /**
   * Constructs a new PatternTexture.
   * @exports PatternTexture
   * @classdesc Represents a PatternTexture.
   * @implements IPatternTexture
   * @constructor
   * @param {IPatternTexture=} [properties] Properties to set
   */
  function PatternTexture(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * PatternTexture buffer.
   * @member {Uint8Array} buffer
   * @memberof PatternTexture
   * @instance
   */
  PatternTexture.prototype.buffer = $util.newBuffer([])

  /**
   * PatternTexture scale.
   * @member {number} scale
   * @memberof PatternTexture
   * @instance
   */
  PatternTexture.prototype.scale = 0

  /**
   * PatternTexture repetition.
   * @member {string} repetition
   * @memberof PatternTexture
   * @instance
   */
  PatternTexture.prototype.repetition = ''

  /**
   * Creates a new PatternTexture instance using the specified properties.
   * @function create
   * @memberof PatternTexture
   * @static
   * @param {IPatternTexture=} [properties] Properties to set
   * @returns {PatternTexture} PatternTexture instance
   */
  PatternTexture.create = function create(properties) {
    return new PatternTexture(properties)
  }

  /**
   * Encodes the specified PatternTexture message. Does not implicitly {@link PatternTexture.verify|verify} messages.
   * @function encode
   * @memberof PatternTexture
   * @static
   * @param {IPatternTexture} message PatternTexture message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  PatternTexture.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.buffer != null && Object.hasOwnProperty.call(message, 'buffer'))
      writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.buffer)
    if (message.scale != null && Object.hasOwnProperty.call(message, 'scale'))
      writer.uint32(/* id 2, wireType 1 =*/ 17).double(message.scale)
    if (
      message.repetition != null &&
      Object.hasOwnProperty.call(message, 'repetition')
    )
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.repetition)
    return writer
  }

  /**
   * Encodes the specified PatternTexture message, length delimited. Does not implicitly {@link PatternTexture.verify|verify} messages.
   * @function encodeDelimited
   * @memberof PatternTexture
   * @static
   * @param {IPatternTexture} message PatternTexture message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  PatternTexture.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a PatternTexture message from the specified reader or buffer.
   * @function decode
   * @memberof PatternTexture
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {PatternTexture} PatternTexture
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  PatternTexture.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.PatternTexture()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.buffer = reader.bytes()
          break
        case 2:
          message.scale = reader.double()
          break
        case 3:
          message.repetition = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a PatternTexture message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof PatternTexture
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {PatternTexture} PatternTexture
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  PatternTexture.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a PatternTexture message.
   * @function verify
   * @memberof PatternTexture
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  PatternTexture.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.buffer != null && message.hasOwnProperty('buffer'))
      if (
        !(
          (message.buffer && typeof message.buffer.length === 'number') ||
          $util.isString(message.buffer)
        )
      )
        return 'buffer: buffer expected'
    if (message.scale != null && message.hasOwnProperty('scale'))
      if (typeof message.scale !== 'number') return 'scale: number expected'
    if (message.repetition != null && message.hasOwnProperty('repetition'))
      if (!$util.isString(message.repetition))
        return 'repetition: string expected'
    return null
  }

  /**
   * Creates a PatternTexture message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof PatternTexture
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {PatternTexture} PatternTexture
   */
  PatternTexture.fromObject = function fromObject(object) {
    if (object instanceof $root.PatternTexture) return object
    let message = new $root.PatternTexture()
    if (object.buffer != null)
      if (typeof object.buffer === 'string')
        $util.base64.decode(
          object.buffer,
          (message.buffer = $util.newBuffer(
            $util.base64.length(object.buffer),
          )),
          0,
        )
      else if (object.buffer.length) message.buffer = object.buffer
    if (object.scale != null) message.scale = Number(object.scale)
    if (object.repetition != null)
      message.repetition = String(object.repetition)
    return message
  }

  /**
   * Creates a plain object from a PatternTexture message. Also converts values to other types if specified.
   * @function toObject
   * @memberof PatternTexture
   * @static
   * @param {PatternTexture} message PatternTexture
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  PatternTexture.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      if (options.bytes === String) object.buffer = ''
      else {
        object.buffer = []
        if (options.bytes !== Array)
          object.buffer = $util.newBuffer(object.buffer)
      }
      object.scale = 0
      object.repetition = ''
    }
    if (message.buffer != null && message.hasOwnProperty('buffer'))
      object.buffer =
        options.bytes === String
          ? $util.base64.encode(message.buffer, 0, message.buffer.length)
          : options.bytes === Array
          ? Array.prototype.slice.call(message.buffer)
          : message.buffer
    if (message.scale != null && message.hasOwnProperty('scale'))
      object.scale =
        options.json && !isFinite(message.scale)
          ? String(message.scale)
          : message.scale
    if (message.repetition != null && message.hasOwnProperty('repetition'))
      object.repetition = message.repetition
    return object
  }

  /**
   * Converts this PatternTexture to JSON.
   * @function toJSON
   * @memberof PatternTexture
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  PatternTexture.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return PatternTexture
})())

export const Fill = ($root.Fill = (() => {
  /**
   * Properties of a Fill.
   * @exports IFill
   * @interface IFill
   * @property {number|null} [type] Fill type
   * @property {string|null} [color] Fill color
   * @property {IGradient|null} [gradient] Fill gradient
   * @property {IPatternTexture|null} [patternTexture] Fill patternTexture
   * @property {number|null} [width] Fill width
   * @property {string|null} [lineCap] Fill lineCap
   * @property {string|null} [lineJoin] Fill lineJoin
   */

  /**
   * Constructs a new Fill.
   * @exports Fill
   * @classdesc Represents a Fill.
   * @implements IFill
   * @constructor
   * @param {IFill=} [properties] Properties to set
   */
  function Fill(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Fill type.
   * @member {number} type
   * @memberof Fill
   * @instance
   */
  Fill.prototype.type = 0

  /**
   * Fill color.
   * @member {string} color
   * @memberof Fill
   * @instance
   */
  Fill.prototype.color = ''

  /**
   * Fill gradient.
   * @member {IGradient|null|undefined} gradient
   * @memberof Fill
   * @instance
   */
  Fill.prototype.gradient = null

  /**
   * Fill patternTexture.
   * @member {IPatternTexture|null|undefined} patternTexture
   * @memberof Fill
   * @instance
   */
  Fill.prototype.patternTexture = null

  /**
   * Fill width.
   * @member {number} width
   * @memberof Fill
   * @instance
   */
  Fill.prototype.width = 0

  /**
   * Fill lineCap.
   * @member {string} lineCap
   * @memberof Fill
   * @instance
   */
  Fill.prototype.lineCap = ''

  /**
   * Fill lineJoin.
   * @member {string} lineJoin
   * @memberof Fill
   * @instance
   */
  Fill.prototype.lineJoin = ''

  /**
   * Creates a new Fill instance using the specified properties.
   * @function create
   * @memberof Fill
   * @static
   * @param {IFill=} [properties] Properties to set
   * @returns {Fill} Fill instance
   */
  Fill.create = function create(properties) {
    return new Fill(properties)
  }

  /**
   * Encodes the specified Fill message. Does not implicitly {@link Fill.verify|verify} messages.
   * @function encode
   * @memberof Fill
   * @static
   * @param {IFill} message Fill message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Fill.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.type != null && Object.hasOwnProperty.call(message, 'type'))
      writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.type)
    if (message.color != null && Object.hasOwnProperty.call(message, 'color'))
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.color)
    if (
      message.gradient != null &&
      Object.hasOwnProperty.call(message, 'gradient')
    )
      $root.Gradient.encode(
        message.gradient,
        writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
      ).ldelim()
    if (
      message.patternTexture != null &&
      Object.hasOwnProperty.call(message, 'patternTexture')
    )
      $root.PatternTexture.encode(
        message.patternTexture,
        writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
      ).ldelim()
    if (message.width != null && Object.hasOwnProperty.call(message, 'width'))
      writer.uint32(/* id 5, wireType 0 =*/ 40).int32(message.width)
    if (
      message.lineCap != null &&
      Object.hasOwnProperty.call(message, 'lineCap')
    )
      writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.lineCap)
    if (
      message.lineJoin != null &&
      Object.hasOwnProperty.call(message, 'lineJoin')
    )
      writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.lineJoin)
    return writer
  }

  /**
   * Encodes the specified Fill message, length delimited. Does not implicitly {@link Fill.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Fill
   * @static
   * @param {IFill} message Fill message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Fill.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Fill message from the specified reader or buffer.
   * @function decode
   * @memberof Fill
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Fill} Fill
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Fill.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Fill()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32()
          break
        case 2:
          message.color = reader.string()
          break
        case 3:
          message.gradient = $root.Gradient.decode(reader, reader.uint32())
          break
        case 4:
          message.patternTexture = $root.PatternTexture.decode(
            reader,
            reader.uint32(),
          )
          break
        case 5:
          message.width = reader.int32()
          break
        case 6:
          message.lineCap = reader.string()
          break
        case 7:
          message.lineJoin = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Fill message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Fill
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Fill} Fill
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Fill.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Fill message.
   * @function verify
   * @memberof Fill
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Fill.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.type != null && message.hasOwnProperty('type'))
      if (!$util.isInteger(message.type)) return 'type: integer expected'
    if (message.color != null && message.hasOwnProperty('color'))
      if (!$util.isString(message.color)) return 'color: string expected'
    if (message.gradient != null && message.hasOwnProperty('gradient')) {
      let error = $root.Gradient.verify(message.gradient)
      if (error) return 'gradient.' + error
    }
    if (
      message.patternTexture != null &&
      message.hasOwnProperty('patternTexture')
    ) {
      let error = $root.PatternTexture.verify(message.patternTexture)
      if (error) return 'patternTexture.' + error
    }
    if (message.width != null && message.hasOwnProperty('width'))
      if (!$util.isInteger(message.width)) return 'width: integer expected'
    if (message.lineCap != null && message.hasOwnProperty('lineCap'))
      if (!$util.isString(message.lineCap)) return 'lineCap: string expected'
    if (message.lineJoin != null && message.hasOwnProperty('lineJoin'))
      if (!$util.isString(message.lineJoin)) return 'lineJoin: string expected'
    return null
  }

  /**
   * Creates a Fill message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Fill
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Fill} Fill
   */
  Fill.fromObject = function fromObject(object) {
    if (object instanceof $root.Fill) return object
    let message = new $root.Fill()
    if (object.type != null) message.type = object.type | 0
    if (object.color != null) message.color = String(object.color)
    if (object.gradient != null) {
      if (typeof object.gradient !== 'object')
        throw TypeError('.Fill.gradient: object expected')
      message.gradient = $root.Gradient.fromObject(object.gradient)
    }
    if (object.patternTexture != null) {
      if (typeof object.patternTexture !== 'object')
        throw TypeError('.Fill.patternTexture: object expected')
      message.patternTexture = $root.PatternTexture.fromObject(
        object.patternTexture,
      )
    }
    if (object.width != null) message.width = object.width | 0
    if (object.lineCap != null) message.lineCap = String(object.lineCap)
    if (object.lineJoin != null) message.lineJoin = String(object.lineJoin)
    return message
  }

  /**
   * Creates a plain object from a Fill message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Fill
   * @static
   * @param {Fill} message Fill
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Fill.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.type = 0
      object.color = ''
      object.gradient = null
      object.patternTexture = null
      object.width = 0
      object.lineCap = ''
      object.lineJoin = ''
    }
    if (message.type != null && message.hasOwnProperty('type'))
      object.type = message.type
    if (message.color != null && message.hasOwnProperty('color'))
      object.color = message.color
    if (message.gradient != null && message.hasOwnProperty('gradient'))
      object.gradient = $root.Gradient.toObject(message.gradient, options)
    if (
      message.patternTexture != null &&
      message.hasOwnProperty('patternTexture')
    )
      object.patternTexture = $root.PatternTexture.toObject(
        message.patternTexture,
        options,
      )
    if (message.width != null && message.hasOwnProperty('width'))
      object.width = message.width
    if (message.lineCap != null && message.hasOwnProperty('lineCap'))
      object.lineCap = message.lineCap
    if (message.lineJoin != null && message.hasOwnProperty('lineJoin'))
      object.lineJoin = message.lineJoin
    return object
  }

  /**
   * Converts this Fill to JSON.
   * @function toJSON
   * @memberof Fill
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Fill.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Fill
})())

export const FontResource = ($root.FontResource = (() => {
  /**
   * Properties of a FontResource.
   * @exports IFontResource
   * @interface IFontResource
   * @property {Uint8Array|null} [font] FontResource font
   */

  /**
   * Constructs a new FontResource.
   * @exports FontResource
   * @classdesc Represents a FontResource.
   * @implements IFontResource
   * @constructor
   * @param {IFontResource=} [properties] Properties to set
   */
  function FontResource(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * FontResource font.
   * @member {Uint8Array} font
   * @memberof FontResource
   * @instance
   */
  FontResource.prototype.font = $util.newBuffer([])

  /**
   * Creates a new FontResource instance using the specified properties.
   * @function create
   * @memberof FontResource
   * @static
   * @param {IFontResource=} [properties] Properties to set
   * @returns {FontResource} FontResource instance
   */
  FontResource.create = function create(properties) {
    return new FontResource(properties)
  }

  /**
   * Encodes the specified FontResource message. Does not implicitly {@link FontResource.verify|verify} messages.
   * @function encode
   * @memberof FontResource
   * @static
   * @param {IFontResource} message FontResource message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  FontResource.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.font != null && Object.hasOwnProperty.call(message, 'font'))
      writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.font)
    return writer
  }

  /**
   * Encodes the specified FontResource message, length delimited. Does not implicitly {@link FontResource.verify|verify} messages.
   * @function encodeDelimited
   * @memberof FontResource
   * @static
   * @param {IFontResource} message FontResource message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  FontResource.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a FontResource message from the specified reader or buffer.
   * @function decode
   * @memberof FontResource
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {FontResource} FontResource
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  FontResource.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.FontResource()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.font = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a FontResource message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof FontResource
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {FontResource} FontResource
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  FontResource.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a FontResource message.
   * @function verify
   * @memberof FontResource
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  FontResource.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.font != null && message.hasOwnProperty('font'))
      if (
        !(
          (message.font && typeof message.font.length === 'number') ||
          $util.isString(message.font)
        )
      )
        return 'font: buffer expected'
    return null
  }

  /**
   * Creates a FontResource message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof FontResource
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {FontResource} FontResource
   */
  FontResource.fromObject = function fromObject(object) {
    if (object instanceof $root.FontResource) return object
    let message = new $root.FontResource()
    if (object.font != null)
      if (typeof object.font === 'string')
        $util.base64.decode(
          object.font,
          (message.font = $util.newBuffer($util.base64.length(object.font))),
          0,
        )
      else if (object.font.length) message.font = object.font
    return message
  }

  /**
   * Creates a plain object from a FontResource message. Also converts values to other types if specified.
   * @function toObject
   * @memberof FontResource
   * @static
   * @param {FontResource} message FontResource
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  FontResource.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults)
      if (options.bytes === String) object.font = ''
      else {
        object.font = []
        if (options.bytes !== Array) object.font = $util.newBuffer(object.font)
      }
    if (message.font != null && message.hasOwnProperty('font'))
      object.font =
        options.bytes === String
          ? $util.base64.encode(message.font, 0, message.font.length)
          : options.bytes === Array
          ? Array.prototype.slice.call(message.font)
          : message.font
    return object
  }

  /**
   * Converts this FontResource to JSON.
   * @function toJSON
   * @memberof FontResource
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  FontResource.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return FontResource
})())

export const Font = ($root.Font = (() => {
  /**
   * Properties of a Font.
   * @exports IFont
   * @interface IFont
   * @property {Array.<IFontResource>|null} [fonts] Font fonts
   * @property {number|null} [size] Font size
   * @property {number|null} [lineHeight] Font lineHeight
   */

  /**
   * Constructs a new Font.
   * @exports Font
   * @classdesc Represents a Font.
   * @implements IFont
   * @constructor
   * @param {IFont=} [properties] Properties to set
   */
  function Font(properties) {
    this.fonts = []
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Font fonts.
   * @member {Array.<IFontResource>} fonts
   * @memberof Font
   * @instance
   */
  Font.prototype.fonts = $util.emptyArray

  /**
   * Font size.
   * @member {number} size
   * @memberof Font
   * @instance
   */
  Font.prototype.size = 0

  /**
   * Font lineHeight.
   * @member {number} lineHeight
   * @memberof Font
   * @instance
   */
  Font.prototype.lineHeight = 0

  /**
   * Creates a new Font instance using the specified properties.
   * @function create
   * @memberof Font
   * @static
   * @param {IFont=} [properties] Properties to set
   * @returns {Font} Font instance
   */
  Font.create = function create(properties) {
    return new Font(properties)
  }

  /**
   * Encodes the specified Font message. Does not implicitly {@link Font.verify|verify} messages.
   * @function encode
   * @memberof Font
   * @static
   * @param {IFont} message Font message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Font.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.fonts != null && message.fonts.length)
      for (let i = 0; i < message.fonts.length; ++i)
        $root.FontResource.encode(
          message.fonts[i],
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
        ).ldelim()
    if (message.size != null && Object.hasOwnProperty.call(message, 'size'))
      writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.size)
    if (
      message.lineHeight != null &&
      Object.hasOwnProperty.call(message, 'lineHeight')
    )
      writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.lineHeight)
    return writer
  }

  /**
   * Encodes the specified Font message, length delimited. Does not implicitly {@link Font.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Font
   * @static
   * @param {IFont} message Font message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Font.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Font message from the specified reader or buffer.
   * @function decode
   * @memberof Font
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Font} Font
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Font.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Font()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (!(message.fonts && message.fonts.length)) message.fonts = []
          message.fonts.push($root.FontResource.decode(reader, reader.uint32()))
          break
        case 2:
          message.size = reader.int32()
          break
        case 3:
          message.lineHeight = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Font message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Font
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Font} Font
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Font.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Font message.
   * @function verify
   * @memberof Font
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Font.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.fonts != null && message.hasOwnProperty('fonts')) {
      if (!Array.isArray(message.fonts)) return 'fonts: array expected'
      for (let i = 0; i < message.fonts.length; ++i) {
        let error = $root.FontResource.verify(message.fonts[i])
        if (error) return 'fonts.' + error
      }
    }
    if (message.size != null && message.hasOwnProperty('size'))
      if (!$util.isInteger(message.size)) return 'size: integer expected'
    if (message.lineHeight != null && message.hasOwnProperty('lineHeight'))
      if (!$util.isInteger(message.lineHeight))
        return 'lineHeight: integer expected'
    return null
  }

  /**
   * Creates a Font message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Font
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Font} Font
   */
  Font.fromObject = function fromObject(object) {
    if (object instanceof $root.Font) return object
    let message = new $root.Font()
    if (object.fonts) {
      if (!Array.isArray(object.fonts))
        throw TypeError('.Font.fonts: array expected')
      message.fonts = []
      for (let i = 0; i < object.fonts.length; ++i) {
        if (typeof object.fonts[i] !== 'object')
          throw TypeError('.Font.fonts: object expected')
        message.fonts[i] = $root.FontResource.fromObject(object.fonts[i])
      }
    }
    if (object.size != null) message.size = object.size | 0
    if (object.lineHeight != null) message.lineHeight = object.lineHeight | 0
    return message
  }

  /**
   * Creates a plain object from a Font message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Font
   * @static
   * @param {Font} message Font
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Font.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.arrays || options.defaults) object.fonts = []
    if (options.defaults) {
      object.size = 0
      object.lineHeight = 0
    }
    if (message.fonts && message.fonts.length) {
      object.fonts = []
      for (let j = 0; j < message.fonts.length; ++j)
        object.fonts[j] = $root.FontResource.toObject(message.fonts[j], options)
    }
    if (message.size != null && message.hasOwnProperty('size'))
      object.size = message.size
    if (message.lineHeight != null && message.hasOwnProperty('lineHeight'))
      object.lineHeight = message.lineHeight
    return object
  }

  /**
   * Converts this Font to JSON.
   * @function toJSON
   * @memberof Font
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Font.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Font
})())

export const GlyphFont = ($root.GlyphFont = (() => {
  /**
   * Properties of a GlyphFont.
   * @exports IGlyphFont
   * @interface IGlyphFont
   * @property {string|null} [letter] GlyphFont letter
   * @property {IMetric|null} [adjustMetric] GlyphFont adjustMetric
   * @property {Object.<string,number>|null} [kerning] GlyphFont kerning
   */

  /**
   * Constructs a new GlyphFont.
   * @exports GlyphFont
   * @classdesc Represents a GlyphFont.
   * @implements IGlyphFont
   * @constructor
   * @param {IGlyphFont=} [properties] Properties to set
   */
  function GlyphFont(properties) {
    this.kerning = {}
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * GlyphFont letter.
   * @member {string} letter
   * @memberof GlyphFont
   * @instance
   */
  GlyphFont.prototype.letter = ''

  /**
   * GlyphFont adjustMetric.
   * @member {IMetric|null|undefined} adjustMetric
   * @memberof GlyphFont
   * @instance
   */
  GlyphFont.prototype.adjustMetric = null

  /**
   * GlyphFont kerning.
   * @member {Object.<string,number>} kerning
   * @memberof GlyphFont
   * @instance
   */
  GlyphFont.prototype.kerning = $util.emptyObject

  /**
   * Creates a new GlyphFont instance using the specified properties.
   * @function create
   * @memberof GlyphFont
   * @static
   * @param {IGlyphFont=} [properties] Properties to set
   * @returns {GlyphFont} GlyphFont instance
   */
  GlyphFont.create = function create(properties) {
    return new GlyphFont(properties)
  }

  /**
   * Encodes the specified GlyphFont message. Does not implicitly {@link GlyphFont.verify|verify} messages.
   * @function encode
   * @memberof GlyphFont
   * @static
   * @param {IGlyphFont} message GlyphFont message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GlyphFont.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.letter != null && Object.hasOwnProperty.call(message, 'letter'))
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.letter)
    if (
      message.adjustMetric != null &&
      Object.hasOwnProperty.call(message, 'adjustMetric')
    )
      $root.Metric.encode(
        message.adjustMetric,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim()
    if (
      message.kerning != null &&
      Object.hasOwnProperty.call(message, 'kerning')
    )
      for (let keys = Object.keys(message.kerning), i = 0; i < keys.length; ++i)
        writer
          .uint32(/* id 3, wireType 2 =*/ 26)
          .fork()
          .uint32(/* id 1, wireType 2 =*/ 10)
          .string(keys[i])
          .uint32(/* id 2, wireType 0 =*/ 16)
          .int32(message.kerning[keys[i]])
          .ldelim()
    return writer
  }

  /**
   * Encodes the specified GlyphFont message, length delimited. Does not implicitly {@link GlyphFont.verify|verify} messages.
   * @function encodeDelimited
   * @memberof GlyphFont
   * @static
   * @param {IGlyphFont} message GlyphFont message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GlyphFont.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a GlyphFont message from the specified reader or buffer.
   * @function decode
   * @memberof GlyphFont
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {GlyphFont} GlyphFont
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GlyphFont.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.GlyphFont(),
      key,
      value
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.letter = reader.string()
          break
        case 2:
          message.adjustMetric = $root.Metric.decode(reader, reader.uint32())
          break
        case 3:
          if (message.kerning === $util.emptyObject) message.kerning = {}
          let end2 = reader.uint32() + reader.pos
          key = ''
          value = 0
          while (reader.pos < end2) {
            let tag2 = reader.uint32()
            switch (tag2 >>> 3) {
              case 1:
                key = reader.string()
                break
              case 2:
                value = reader.int32()
                break
              default:
                reader.skipType(tag2 & 7)
                break
            }
          }
          message.kerning[key] = value
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a GlyphFont message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof GlyphFont
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {GlyphFont} GlyphFont
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GlyphFont.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a GlyphFont message.
   * @function verify
   * @memberof GlyphFont
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  GlyphFont.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.letter != null && message.hasOwnProperty('letter'))
      if (!$util.isString(message.letter)) return 'letter: string expected'
    if (
      message.adjustMetric != null &&
      message.hasOwnProperty('adjustMetric')
    ) {
      let error = $root.Metric.verify(message.adjustMetric)
      if (error) return 'adjustMetric.' + error
    }
    if (message.kerning != null && message.hasOwnProperty('kerning')) {
      if (!$util.isObject(message.kerning)) return 'kerning: object expected'
      let key = Object.keys(message.kerning)
      for (let i = 0; i < key.length; ++i)
        if (!$util.isInteger(message.kerning[key[i]]))
          return 'kerning: integer{k:string} expected'
    }
    return null
  }

  /**
   * Creates a GlyphFont message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof GlyphFont
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {GlyphFont} GlyphFont
   */
  GlyphFont.fromObject = function fromObject(object) {
    if (object instanceof $root.GlyphFont) return object
    let message = new $root.GlyphFont()
    if (object.letter != null) message.letter = String(object.letter)
    if (object.adjustMetric != null) {
      if (typeof object.adjustMetric !== 'object')
        throw TypeError('.GlyphFont.adjustMetric: object expected')
      message.adjustMetric = $root.Metric.fromObject(object.adjustMetric)
    }
    if (object.kerning) {
      if (typeof object.kerning !== 'object')
        throw TypeError('.GlyphFont.kerning: object expected')
      message.kerning = {}
      for (let keys = Object.keys(object.kerning), i = 0; i < keys.length; ++i)
        message.kerning[keys[i]] = object.kerning[keys[i]] | 0
    }
    return message
  }

  /**
   * Creates a plain object from a GlyphFont message. Also converts values to other types if specified.
   * @function toObject
   * @memberof GlyphFont
   * @static
   * @param {GlyphFont} message GlyphFont
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  GlyphFont.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.objects || options.defaults) object.kerning = {}
    if (options.defaults) {
      object.letter = ''
      object.adjustMetric = null
    }
    if (message.letter != null && message.hasOwnProperty('letter'))
      object.letter = message.letter
    if (message.adjustMetric != null && message.hasOwnProperty('adjustMetric'))
      object.adjustMetric = $root.Metric.toObject(message.adjustMetric, options)
    let keys2
    if (message.kerning && (keys2 = Object.keys(message.kerning)).length) {
      object.kerning = {}
      for (let j = 0; j < keys2.length; ++j)
        object.kerning[keys2[j]] = message.kerning[keys2[j]]
    }
    return object
  }

  /**
   * Converts this GlyphFont to JSON.
   * @function toJSON
   * @memberof GlyphFont
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  GlyphFont.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return GlyphFont
})())

export const GlyphImage = ($root.GlyphImage = (() => {
  /**
   * Properties of a GlyphImage.
   * @exports IGlyphImage
   * @interface IGlyphImage
   * @property {string|null} [letter] GlyphImage letter
   * @property {IMetric|null} [adjustMetric] GlyphImage adjustMetric
   * @property {Uint8Array|null} [buffer] GlyphImage buffer
   * @property {string|null} [fileName] GlyphImage fileName
   * @property {string|null} [fileType] GlyphImage fileType
   * @property {boolean|null} [selected] GlyphImage selected
   * @property {Object.<string,number>|null} [kerning] GlyphImage kerning
   */

  /**
   * Constructs a new GlyphImage.
   * @exports GlyphImage
   * @classdesc Represents a GlyphImage.
   * @implements IGlyphImage
   * @constructor
   * @param {IGlyphImage=} [properties] Properties to set
   */
  function GlyphImage(properties) {
    this.kerning = {}
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * GlyphImage letter.
   * @member {string} letter
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.letter = ''

  /**
   * GlyphImage adjustMetric.
   * @member {IMetric|null|undefined} adjustMetric
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.adjustMetric = null

  /**
   * GlyphImage buffer.
   * @member {Uint8Array} buffer
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.buffer = $util.newBuffer([])

  /**
   * GlyphImage fileName.
   * @member {string} fileName
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.fileName = ''

  /**
   * GlyphImage fileType.
   * @member {string} fileType
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.fileType = ''

  /**
   * GlyphImage selected.
   * @member {boolean} selected
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.selected = false

  /**
   * GlyphImage kerning.
   * @member {Object.<string,number>} kerning
   * @memberof GlyphImage
   * @instance
   */
  GlyphImage.prototype.kerning = $util.emptyObject

  /**
   * Creates a new GlyphImage instance using the specified properties.
   * @function create
   * @memberof GlyphImage
   * @static
   * @param {IGlyphImage=} [properties] Properties to set
   * @returns {GlyphImage} GlyphImage instance
   */
  GlyphImage.create = function create(properties) {
    return new GlyphImage(properties)
  }

  /**
   * Encodes the specified GlyphImage message. Does not implicitly {@link GlyphImage.verify|verify} messages.
   * @function encode
   * @memberof GlyphImage
   * @static
   * @param {IGlyphImage} message GlyphImage message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GlyphImage.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.letter != null && Object.hasOwnProperty.call(message, 'letter'))
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.letter)
    if (
      message.adjustMetric != null &&
      Object.hasOwnProperty.call(message, 'adjustMetric')
    )
      $root.Metric.encode(
        message.adjustMetric,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim()
    if (message.buffer != null && Object.hasOwnProperty.call(message, 'buffer'))
      writer.uint32(/* id 3, wireType 2 =*/ 26).bytes(message.buffer)
    if (
      message.fileName != null &&
      Object.hasOwnProperty.call(message, 'fileName')
    )
      writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.fileName)
    if (
      message.fileType != null &&
      Object.hasOwnProperty.call(message, 'fileType')
    )
      writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.fileType)
    if (
      message.selected != null &&
      Object.hasOwnProperty.call(message, 'selected')
    )
      writer.uint32(/* id 6, wireType 0 =*/ 48).bool(message.selected)
    if (
      message.kerning != null &&
      Object.hasOwnProperty.call(message, 'kerning')
    )
      for (let keys = Object.keys(message.kerning), i = 0; i < keys.length; ++i)
        writer
          .uint32(/* id 7, wireType 2 =*/ 58)
          .fork()
          .uint32(/* id 1, wireType 2 =*/ 10)
          .string(keys[i])
          .uint32(/* id 2, wireType 0 =*/ 16)
          .int32(message.kerning[keys[i]])
          .ldelim()
    return writer
  }

  /**
   * Encodes the specified GlyphImage message, length delimited. Does not implicitly {@link GlyphImage.verify|verify} messages.
   * @function encodeDelimited
   * @memberof GlyphImage
   * @static
   * @param {IGlyphImage} message GlyphImage message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  GlyphImage.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a GlyphImage message from the specified reader or buffer.
   * @function decode
   * @memberof GlyphImage
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {GlyphImage} GlyphImage
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GlyphImage.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.GlyphImage(),
      key,
      value
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.letter = reader.string()
          break
        case 2:
          message.adjustMetric = $root.Metric.decode(reader, reader.uint32())
          break
        case 3:
          message.buffer = reader.bytes()
          break
        case 4:
          message.fileName = reader.string()
          break
        case 5:
          message.fileType = reader.string()
          break
        case 6:
          message.selected = reader.bool()
          break
        case 7:
          if (message.kerning === $util.emptyObject) message.kerning = {}
          let end2 = reader.uint32() + reader.pos
          key = ''
          value = 0
          while (reader.pos < end2) {
            let tag2 = reader.uint32()
            switch (tag2 >>> 3) {
              case 1:
                key = reader.string()
                break
              case 2:
                value = reader.int32()
                break
              default:
                reader.skipType(tag2 & 7)
                break
            }
          }
          message.kerning[key] = value
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a GlyphImage message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof GlyphImage
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {GlyphImage} GlyphImage
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  GlyphImage.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a GlyphImage message.
   * @function verify
   * @memberof GlyphImage
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  GlyphImage.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.letter != null && message.hasOwnProperty('letter'))
      if (!$util.isString(message.letter)) return 'letter: string expected'
    if (
      message.adjustMetric != null &&
      message.hasOwnProperty('adjustMetric')
    ) {
      let error = $root.Metric.verify(message.adjustMetric)
      if (error) return 'adjustMetric.' + error
    }
    if (message.buffer != null && message.hasOwnProperty('buffer'))
      if (
        !(
          (message.buffer && typeof message.buffer.length === 'number') ||
          $util.isString(message.buffer)
        )
      )
        return 'buffer: buffer expected'
    if (message.fileName != null && message.hasOwnProperty('fileName'))
      if (!$util.isString(message.fileName)) return 'fileName: string expected'
    if (message.fileType != null && message.hasOwnProperty('fileType'))
      if (!$util.isString(message.fileType)) return 'fileType: string expected'
    if (message.selected != null && message.hasOwnProperty('selected'))
      if (typeof message.selected !== 'boolean')
        return 'selected: boolean expected'
    if (message.kerning != null && message.hasOwnProperty('kerning')) {
      if (!$util.isObject(message.kerning)) return 'kerning: object expected'
      let key = Object.keys(message.kerning)
      for (let i = 0; i < key.length; ++i)
        if (!$util.isInteger(message.kerning[key[i]]))
          return 'kerning: integer{k:string} expected'
    }
    return null
  }

  /**
   * Creates a GlyphImage message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof GlyphImage
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {GlyphImage} GlyphImage
   */
  GlyphImage.fromObject = function fromObject(object) {
    if (object instanceof $root.GlyphImage) return object
    let message = new $root.GlyphImage()
    if (object.letter != null) message.letter = String(object.letter)
    if (object.adjustMetric != null) {
      if (typeof object.adjustMetric !== 'object')
        throw TypeError('.GlyphImage.adjustMetric: object expected')
      message.adjustMetric = $root.Metric.fromObject(object.adjustMetric)
    }
    if (object.buffer != null)
      if (typeof object.buffer === 'string')
        $util.base64.decode(
          object.buffer,
          (message.buffer = $util.newBuffer(
            $util.base64.length(object.buffer),
          )),
          0,
        )
      else if (object.buffer.length) message.buffer = object.buffer
    if (object.fileName != null) message.fileName = String(object.fileName)
    if (object.fileType != null) message.fileType = String(object.fileType)
    if (object.selected != null) message.selected = Boolean(object.selected)
    if (object.kerning) {
      if (typeof object.kerning !== 'object')
        throw TypeError('.GlyphImage.kerning: object expected')
      message.kerning = {}
      for (let keys = Object.keys(object.kerning), i = 0; i < keys.length; ++i)
        message.kerning[keys[i]] = object.kerning[keys[i]] | 0
    }
    return message
  }

  /**
   * Creates a plain object from a GlyphImage message. Also converts values to other types if specified.
   * @function toObject
   * @memberof GlyphImage
   * @static
   * @param {GlyphImage} message GlyphImage
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  GlyphImage.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.objects || options.defaults) object.kerning = {}
    if (options.defaults) {
      object.letter = ''
      object.adjustMetric = null
      if (options.bytes === String) object.buffer = ''
      else {
        object.buffer = []
        if (options.bytes !== Array)
          object.buffer = $util.newBuffer(object.buffer)
      }
      object.fileName = ''
      object.fileType = ''
      object.selected = false
    }
    if (message.letter != null && message.hasOwnProperty('letter'))
      object.letter = message.letter
    if (message.adjustMetric != null && message.hasOwnProperty('adjustMetric'))
      object.adjustMetric = $root.Metric.toObject(message.adjustMetric, options)
    if (message.buffer != null && message.hasOwnProperty('buffer'))
      object.buffer =
        options.bytes === String
          ? $util.base64.encode(message.buffer, 0, message.buffer.length)
          : options.bytes === Array
          ? Array.prototype.slice.call(message.buffer)
          : message.buffer
    if (message.fileName != null && message.hasOwnProperty('fileName'))
      object.fileName = message.fileName
    if (message.fileType != null && message.hasOwnProperty('fileType'))
      object.fileType = message.fileType
    if (message.selected != null && message.hasOwnProperty('selected'))
      object.selected = message.selected
    let keys2
    if (message.kerning && (keys2 = Object.keys(message.kerning)).length) {
      object.kerning = {}
      for (let j = 0; j < keys2.length; ++j)
        object.kerning[keys2[j]] = message.kerning[keys2[j]]
    }
    return object
  }

  /**
   * Converts this GlyphImage to JSON.
   * @function toJSON
   * @memberof GlyphImage
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  GlyphImage.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return GlyphImage
})())

export const Layout = ($root.Layout = (() => {
  /**
   * Properties of a Layout.
   * @exports ILayout
   * @interface ILayout
   * @property {number|null} [padding] Layout padding
   * @property {number|null} [spacing] Layout spacing
   * @property {number|null} [width] Layout width
   * @property {number|null} [height] Layout height
   * @property {boolean|null} [auto] Layout auto
   * @property {boolean|null} [fixedSize] Layout fixedSize
   */

  /**
   * Constructs a new Layout.
   * @exports Layout
   * @classdesc Represents a Layout.
   * @implements ILayout
   * @constructor
   * @param {ILayout=} [properties] Properties to set
   */
  function Layout(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Layout padding.
   * @member {number} padding
   * @memberof Layout
   * @instance
   */
  Layout.prototype.padding = 0

  /**
   * Layout spacing.
   * @member {number} spacing
   * @memberof Layout
   * @instance
   */
  Layout.prototype.spacing = 0

  /**
   * Layout width.
   * @member {number} width
   * @memberof Layout
   * @instance
   */
  Layout.prototype.width = 0

  /**
   * Layout height.
   * @member {number} height
   * @memberof Layout
   * @instance
   */
  Layout.prototype.height = 0

  /**
   * Layout auto.
   * @member {boolean} auto
   * @memberof Layout
   * @instance
   */
  Layout.prototype.auto = false

  /**
   * Layout fixedSize.
   * @member {boolean} fixedSize
   * @memberof Layout
   * @instance
   */
  Layout.prototype.fixedSize = false

  /**
   * Creates a new Layout instance using the specified properties.
   * @function create
   * @memberof Layout
   * @static
   * @param {ILayout=} [properties] Properties to set
   * @returns {Layout} Layout instance
   */
  Layout.create = function create(properties) {
    return new Layout(properties)
  }

  /**
   * Encodes the specified Layout message. Does not implicitly {@link Layout.verify|verify} messages.
   * @function encode
   * @memberof Layout
   * @static
   * @param {ILayout} message Layout message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Layout.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (
      message.padding != null &&
      Object.hasOwnProperty.call(message, 'padding')
    )
      writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.padding)
    if (
      message.spacing != null &&
      Object.hasOwnProperty.call(message, 'spacing')
    )
      writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.spacing)
    if (message.width != null && Object.hasOwnProperty.call(message, 'width'))
      writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.width)
    if (message.height != null && Object.hasOwnProperty.call(message, 'height'))
      writer.uint32(/* id 4, wireType 0 =*/ 32).int32(message.height)
    if (message.auto != null && Object.hasOwnProperty.call(message, 'auto'))
      writer.uint32(/* id 5, wireType 0 =*/ 40).bool(message.auto)
    if (
      message.fixedSize != null &&
      Object.hasOwnProperty.call(message, 'fixedSize')
    )
      writer.uint32(/* id 6, wireType 0 =*/ 48).bool(message.fixedSize)
    return writer
  }

  /**
   * Encodes the specified Layout message, length delimited. Does not implicitly {@link Layout.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Layout
   * @static
   * @param {ILayout} message Layout message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Layout.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Layout message from the specified reader or buffer.
   * @function decode
   * @memberof Layout
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Layout} Layout
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Layout.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Layout()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.padding = reader.int32()
          break
        case 2:
          message.spacing = reader.int32()
          break
        case 3:
          message.width = reader.int32()
          break
        case 4:
          message.height = reader.int32()
          break
        case 5:
          message.auto = reader.bool()
          break
        case 6:
          message.fixedSize = reader.bool()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Layout message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Layout
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Layout} Layout
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Layout.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Layout message.
   * @function verify
   * @memberof Layout
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Layout.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.padding != null && message.hasOwnProperty('padding'))
      if (!$util.isInteger(message.padding)) return 'padding: integer expected'
    if (message.spacing != null && message.hasOwnProperty('spacing'))
      if (!$util.isInteger(message.spacing)) return 'spacing: integer expected'
    if (message.width != null && message.hasOwnProperty('width'))
      if (!$util.isInteger(message.width)) return 'width: integer expected'
    if (message.height != null && message.hasOwnProperty('height'))
      if (!$util.isInteger(message.height)) return 'height: integer expected'
    if (message.auto != null && message.hasOwnProperty('auto'))
      if (typeof message.auto !== 'boolean') return 'auto: boolean expected'
    if (message.fixedSize != null && message.hasOwnProperty('fixedSize'))
      if (typeof message.fixedSize !== 'boolean')
        return 'fixedSize: boolean expected'
    return null
  }

  /**
   * Creates a Layout message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Layout
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Layout} Layout
   */
  Layout.fromObject = function fromObject(object) {
    if (object instanceof $root.Layout) return object
    let message = new $root.Layout()
    if (object.padding != null) message.padding = object.padding | 0
    if (object.spacing != null) message.spacing = object.spacing | 0
    if (object.width != null) message.width = object.width | 0
    if (object.height != null) message.height = object.height | 0
    if (object.auto != null) message.auto = Boolean(object.auto)
    if (object.fixedSize != null) message.fixedSize = Boolean(object.fixedSize)
    return message
  }

  /**
   * Creates a plain object from a Layout message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Layout
   * @static
   * @param {Layout} message Layout
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Layout.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.padding = 0
      object.spacing = 0
      object.width = 0
      object.height = 0
      object.auto = false
      object.fixedSize = false
    }
    if (message.padding != null && message.hasOwnProperty('padding'))
      object.padding = message.padding
    if (message.spacing != null && message.hasOwnProperty('spacing'))
      object.spacing = message.spacing
    if (message.width != null && message.hasOwnProperty('width'))
      object.width = message.width
    if (message.height != null && message.hasOwnProperty('height'))
      object.height = message.height
    if (message.auto != null && message.hasOwnProperty('auto'))
      object.auto = message.auto
    if (message.fixedSize != null && message.hasOwnProperty('fixedSize'))
      object.fixedSize = message.fixedSize
    return object
  }

  /**
   * Converts this Layout to JSON.
   * @function toJSON
   * @memberof Layout
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Layout.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Layout
})())

export const Shadow = ($root.Shadow = (() => {
  /**
   * Properties of a Shadow.
   * @exports IShadow
   * @interface IShadow
   * @property {string|null} [color] Shadow color
   * @property {number|null} [blur] Shadow blur
   * @property {number|null} [offsetX] Shadow offsetX
   * @property {number|null} [offsetY] Shadow offsetY
   */

  /**
   * Constructs a new Shadow.
   * @exports Shadow
   * @classdesc Represents a Shadow.
   * @implements IShadow
   * @constructor
   * @param {IShadow=} [properties] Properties to set
   */
  function Shadow(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Shadow color.
   * @member {string} color
   * @memberof Shadow
   * @instance
   */
  Shadow.prototype.color = ''

  /**
   * Shadow blur.
   * @member {number} blur
   * @memberof Shadow
   * @instance
   */
  Shadow.prototype.blur = 0

  /**
   * Shadow offsetX.
   * @member {number} offsetX
   * @memberof Shadow
   * @instance
   */
  Shadow.prototype.offsetX = 0

  /**
   * Shadow offsetY.
   * @member {number} offsetY
   * @memberof Shadow
   * @instance
   */
  Shadow.prototype.offsetY = 0

  /**
   * Creates a new Shadow instance using the specified properties.
   * @function create
   * @memberof Shadow
   * @static
   * @param {IShadow=} [properties] Properties to set
   * @returns {Shadow} Shadow instance
   */
  Shadow.create = function create(properties) {
    return new Shadow(properties)
  }

  /**
   * Encodes the specified Shadow message. Does not implicitly {@link Shadow.verify|verify} messages.
   * @function encode
   * @memberof Shadow
   * @static
   * @param {IShadow} message Shadow message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Shadow.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.color != null && Object.hasOwnProperty.call(message, 'color'))
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.color)
    if (message.blur != null && Object.hasOwnProperty.call(message, 'blur'))
      writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.blur)
    if (
      message.offsetX != null &&
      Object.hasOwnProperty.call(message, 'offsetX')
    )
      writer.uint32(/* id 3, wireType 0 =*/ 24).sint32(message.offsetX)
    if (
      message.offsetY != null &&
      Object.hasOwnProperty.call(message, 'offsetY')
    )
      writer.uint32(/* id 4, wireType 0 =*/ 32).sint32(message.offsetY)
    return writer
  }

  /**
   * Encodes the specified Shadow message, length delimited. Does not implicitly {@link Shadow.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Shadow
   * @static
   * @param {IShadow} message Shadow message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Shadow.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Shadow message from the specified reader or buffer.
   * @function decode
   * @memberof Shadow
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Shadow} Shadow
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Shadow.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Shadow()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.color = reader.string()
          break
        case 2:
          message.blur = reader.int32()
          break
        case 3:
          message.offsetX = reader.sint32()
          break
        case 4:
          message.offsetY = reader.sint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Shadow message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Shadow
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Shadow} Shadow
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Shadow.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Shadow message.
   * @function verify
   * @memberof Shadow
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Shadow.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.color != null && message.hasOwnProperty('color'))
      if (!$util.isString(message.color)) return 'color: string expected'
    if (message.blur != null && message.hasOwnProperty('blur'))
      if (!$util.isInteger(message.blur)) return 'blur: integer expected'
    if (message.offsetX != null && message.hasOwnProperty('offsetX'))
      if (!$util.isInteger(message.offsetX)) return 'offsetX: integer expected'
    if (message.offsetY != null && message.hasOwnProperty('offsetY'))
      if (!$util.isInteger(message.offsetY)) return 'offsetY: integer expected'
    return null
  }

  /**
   * Creates a Shadow message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Shadow
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Shadow} Shadow
   */
  Shadow.fromObject = function fromObject(object) {
    if (object instanceof $root.Shadow) return object
    let message = new $root.Shadow()
    if (object.color != null) message.color = String(object.color)
    if (object.blur != null) message.blur = object.blur | 0
    if (object.offsetX != null) message.offsetX = object.offsetX | 0
    if (object.offsetY != null) message.offsetY = object.offsetY | 0
    return message
  }

  /**
   * Creates a plain object from a Shadow message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Shadow
   * @static
   * @param {Shadow} message Shadow
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Shadow.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.color = ''
      object.blur = 0
      object.offsetX = 0
      object.offsetY = 0
    }
    if (message.color != null && message.hasOwnProperty('color'))
      object.color = message.color
    if (message.blur != null && message.hasOwnProperty('blur'))
      object.blur = message.blur
    if (message.offsetX != null && message.hasOwnProperty('offsetX'))
      object.offsetX = message.offsetX
    if (message.offsetY != null && message.hasOwnProperty('offsetY'))
      object.offsetY = message.offsetY
    return object
  }

  /**
   * Converts this Shadow to JSON.
   * @function toJSON
   * @memberof Shadow
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Shadow.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Shadow
})())

export const Style = ($root.Style = (() => {
  /**
   * Properties of a Style.
   * @exports IStyle
   * @interface IStyle
   * @property {IFont|null} [font] Style font
   * @property {IFill|null} [fill] Style fill
   * @property {boolean|null} [useStroke] Style useStroke
   * @property {IFill|null} [stroke] Style stroke
   * @property {boolean|null} [useShadow] Style useShadow
   * @property {IShadow|null} [shadow] Style shadow
   * @property {string|null} [bgColor] Style bgColor
   */

  /**
   * Constructs a new Style.
   * @exports Style
   * @classdesc Represents a Style.
   * @implements IStyle
   * @constructor
   * @param {IStyle=} [properties] Properties to set
   */
  function Style(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Style font.
   * @member {IFont|null|undefined} font
   * @memberof Style
   * @instance
   */
  Style.prototype.font = null

  /**
   * Style fill.
   * @member {IFill|null|undefined} fill
   * @memberof Style
   * @instance
   */
  Style.prototype.fill = null

  /**
   * Style useStroke.
   * @member {boolean} useStroke
   * @memberof Style
   * @instance
   */
  Style.prototype.useStroke = false

  /**
   * Style stroke.
   * @member {IFill|null|undefined} stroke
   * @memberof Style
   * @instance
   */
  Style.prototype.stroke = null

  /**
   * Style useShadow.
   * @member {boolean} useShadow
   * @memberof Style
   * @instance
   */
  Style.prototype.useShadow = false

  /**
   * Style shadow.
   * @member {IShadow|null|undefined} shadow
   * @memberof Style
   * @instance
   */
  Style.prototype.shadow = null

  /**
   * Style bgColor.
   * @member {string} bgColor
   * @memberof Style
   * @instance
   */
  Style.prototype.bgColor = ''

  /**
   * Creates a new Style instance using the specified properties.
   * @function create
   * @memberof Style
   * @static
   * @param {IStyle=} [properties] Properties to set
   * @returns {Style} Style instance
   */
  Style.create = function create(properties) {
    return new Style(properties)
  }

  /**
   * Encodes the specified Style message. Does not implicitly {@link Style.verify|verify} messages.
   * @function encode
   * @memberof Style
   * @static
   * @param {IStyle} message Style message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Style.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.font != null && Object.hasOwnProperty.call(message, 'font'))
      $root.Font.encode(
        message.font,
        writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
      ).ldelim()
    if (message.fill != null && Object.hasOwnProperty.call(message, 'fill'))
      $root.Fill.encode(
        message.fill,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim()
    if (
      message.useStroke != null &&
      Object.hasOwnProperty.call(message, 'useStroke')
    )
      writer.uint32(/* id 3, wireType 0 =*/ 24).bool(message.useStroke)
    if (message.stroke != null && Object.hasOwnProperty.call(message, 'stroke'))
      $root.Fill.encode(
        message.stroke,
        writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
      ).ldelim()
    if (
      message.useShadow != null &&
      Object.hasOwnProperty.call(message, 'useShadow')
    )
      writer.uint32(/* id 5, wireType 0 =*/ 40).bool(message.useShadow)
    if (message.shadow != null && Object.hasOwnProperty.call(message, 'shadow'))
      $root.Shadow.encode(
        message.shadow,
        writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
      ).ldelim()
    if (
      message.bgColor != null &&
      Object.hasOwnProperty.call(message, 'bgColor')
    )
      writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.bgColor)
    return writer
  }

  /**
   * Encodes the specified Style message, length delimited. Does not implicitly {@link Style.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Style
   * @static
   * @param {IStyle} message Style message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Style.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Style message from the specified reader or buffer.
   * @function decode
   * @memberof Style
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Style} Style
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Style.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Style()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.font = $root.Font.decode(reader, reader.uint32())
          break
        case 2:
          message.fill = $root.Fill.decode(reader, reader.uint32())
          break
        case 3:
          message.useStroke = reader.bool()
          break
        case 4:
          message.stroke = $root.Fill.decode(reader, reader.uint32())
          break
        case 5:
          message.useShadow = reader.bool()
          break
        case 6:
          message.shadow = $root.Shadow.decode(reader, reader.uint32())
          break
        case 7:
          message.bgColor = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Style message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Style
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Style} Style
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Style.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Style message.
   * @function verify
   * @memberof Style
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Style.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.font != null && message.hasOwnProperty('font')) {
      let error = $root.Font.verify(message.font)
      if (error) return 'font.' + error
    }
    if (message.fill != null && message.hasOwnProperty('fill')) {
      let error = $root.Fill.verify(message.fill)
      if (error) return 'fill.' + error
    }
    if (message.useStroke != null && message.hasOwnProperty('useStroke'))
      if (typeof message.useStroke !== 'boolean')
        return 'useStroke: boolean expected'
    if (message.stroke != null && message.hasOwnProperty('stroke')) {
      let error = $root.Fill.verify(message.stroke)
      if (error) return 'stroke.' + error
    }
    if (message.useShadow != null && message.hasOwnProperty('useShadow'))
      if (typeof message.useShadow !== 'boolean')
        return 'useShadow: boolean expected'
    if (message.shadow != null && message.hasOwnProperty('shadow')) {
      let error = $root.Shadow.verify(message.shadow)
      if (error) return 'shadow.' + error
    }
    if (message.bgColor != null && message.hasOwnProperty('bgColor'))
      if (!$util.isString(message.bgColor)) return 'bgColor: string expected'
    return null
  }

  /**
   * Creates a Style message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Style
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Style} Style
   */
  Style.fromObject = function fromObject(object) {
    if (object instanceof $root.Style) return object
    let message = new $root.Style()
    if (object.font != null) {
      if (typeof object.font !== 'object')
        throw TypeError('.Style.font: object expected')
      message.font = $root.Font.fromObject(object.font)
    }
    if (object.fill != null) {
      if (typeof object.fill !== 'object')
        throw TypeError('.Style.fill: object expected')
      message.fill = $root.Fill.fromObject(object.fill)
    }
    if (object.useStroke != null) message.useStroke = Boolean(object.useStroke)
    if (object.stroke != null) {
      if (typeof object.stroke !== 'object')
        throw TypeError('.Style.stroke: object expected')
      message.stroke = $root.Fill.fromObject(object.stroke)
    }
    if (object.useShadow != null) message.useShadow = Boolean(object.useShadow)
    if (object.shadow != null) {
      if (typeof object.shadow !== 'object')
        throw TypeError('.Style.shadow: object expected')
      message.shadow = $root.Shadow.fromObject(object.shadow)
    }
    if (object.bgColor != null) message.bgColor = String(object.bgColor)
    return message
  }

  /**
   * Creates a plain object from a Style message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Style
   * @static
   * @param {Style} message Style
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Style.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) {
      object.font = null
      object.fill = null
      object.useStroke = false
      object.stroke = null
      object.useShadow = false
      object.shadow = null
      object.bgColor = ''
    }
    if (message.font != null && message.hasOwnProperty('font'))
      object.font = $root.Font.toObject(message.font, options)
    if (message.fill != null && message.hasOwnProperty('fill'))
      object.fill = $root.Fill.toObject(message.fill, options)
    if (message.useStroke != null && message.hasOwnProperty('useStroke'))
      object.useStroke = message.useStroke
    if (message.stroke != null && message.hasOwnProperty('stroke'))
      object.stroke = $root.Fill.toObject(message.stroke, options)
    if (message.useShadow != null && message.hasOwnProperty('useShadow'))
      object.useShadow = message.useShadow
    if (message.shadow != null && message.hasOwnProperty('shadow'))
      object.shadow = $root.Shadow.toObject(message.shadow, options)
    if (message.bgColor != null && message.hasOwnProperty('bgColor'))
      object.bgColor = message.bgColor
    return object
  }

  /**
   * Converts this Style to JSON.
   * @function toJSON
   * @memberof Style
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Style.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Style
})())

export const Ui = ($root.Ui = (() => {
  /**
   * Properties of an Ui.
   * @exports IUi
   * @interface IUi
   * @property {string|null} [previewText] Ui previewText
   */

  /**
   * Constructs a new Ui.
   * @exports Ui
   * @classdesc Represents an Ui.
   * @implements IUi
   * @constructor
   * @param {IUi=} [properties] Properties to set
   */
  function Ui(properties) {
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Ui previewText.
   * @member {string} previewText
   * @memberof Ui
   * @instance
   */
  Ui.prototype.previewText = ''

  /**
   * Creates a new Ui instance using the specified properties.
   * @function create
   * @memberof Ui
   * @static
   * @param {IUi=} [properties] Properties to set
   * @returns {Ui} Ui instance
   */
  Ui.create = function create(properties) {
    return new Ui(properties)
  }

  /**
   * Encodes the specified Ui message. Does not implicitly {@link Ui.verify|verify} messages.
   * @function encode
   * @memberof Ui
   * @static
   * @param {IUi} message Ui message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Ui.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (
      message.previewText != null &&
      Object.hasOwnProperty.call(message, 'previewText')
    )
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.previewText)
    return writer
  }

  /**
   * Encodes the specified Ui message, length delimited. Does not implicitly {@link Ui.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Ui
   * @static
   * @param {IUi} message Ui message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Ui.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes an Ui message from the specified reader or buffer.
   * @function decode
   * @memberof Ui
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Ui} Ui
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Ui.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Ui()
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.previewText = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes an Ui message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Ui
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Ui} Ui
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Ui.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies an Ui message.
   * @function verify
   * @memberof Ui
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Ui.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.previewText != null && message.hasOwnProperty('previewText'))
      if (!$util.isString(message.previewText))
        return 'previewText: string expected'
    return null
  }

  /**
   * Creates an Ui message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Ui
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Ui} Ui
   */
  Ui.fromObject = function fromObject(object) {
    if (object instanceof $root.Ui) return object
    let message = new $root.Ui()
    if (object.previewText != null)
      message.previewText = String(object.previewText)
    return message
  }

  /**
   * Creates a plain object from an Ui message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Ui
   * @static
   * @param {Ui} message Ui
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Ui.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.defaults) object.previewText = ''
    if (message.previewText != null && message.hasOwnProperty('previewText'))
      object.previewText = message.previewText
    return object
  }

  /**
   * Converts this Ui to JSON.
   * @function toJSON
   * @memberof Ui
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Ui.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Ui
})())

export const Project = ($root.Project = (() => {
  /**
   * Properties of a Project.
   * @exports IProject
   * @interface IProject
   * @property {number|Long|null} [id] Project id
   * @property {string|null} [name] Project name
   * @property {string|null} [text] Project text
   * @property {Object.<string,IGlyphFont>|null} [glyphs] Project glyphs
   * @property {Array.<IGlyphImage>|null} [glyphImages] Project glyphImages
   * @property {IStyle|null} [style] Project style
   * @property {ILayout|null} [layout] Project layout
   * @property {IMetric|null} [globalAdjustMetric] Project globalAdjustMetric
   * @property {IUi|null} [ui] Project ui
   */

  /**
   * Constructs a new Project.
   * @exports Project
   * @classdesc Represents a Project.
   * @implements IProject
   * @constructor
   * @param {IProject=} [properties] Properties to set
   */
  function Project(properties) {
    this.glyphs = {}
    this.glyphImages = []
    if (properties)
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
  }

  /**
   * Project id.
   * @member {number|Long} id
   * @memberof Project
   * @instance
   */
  Project.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, false) : 0

  /**
   * Project name.
   * @member {string} name
   * @memberof Project
   * @instance
   */
  Project.prototype.name = ''

  /**
   * Project text.
   * @member {string} text
   * @memberof Project
   * @instance
   */
  Project.prototype.text = ''

  /**
   * Project glyphs.
   * @member {Object.<string,IGlyphFont>} glyphs
   * @memberof Project
   * @instance
   */
  Project.prototype.glyphs = $util.emptyObject

  /**
   * Project glyphImages.
   * @member {Array.<IGlyphImage>} glyphImages
   * @memberof Project
   * @instance
   */
  Project.prototype.glyphImages = $util.emptyArray

  /**
   * Project style.
   * @member {IStyle|null|undefined} style
   * @memberof Project
   * @instance
   */
  Project.prototype.style = null

  /**
   * Project layout.
   * @member {ILayout|null|undefined} layout
   * @memberof Project
   * @instance
   */
  Project.prototype.layout = null

  /**
   * Project globalAdjustMetric.
   * @member {IMetric|null|undefined} globalAdjustMetric
   * @memberof Project
   * @instance
   */
  Project.prototype.globalAdjustMetric = null

  /**
   * Project ui.
   * @member {IUi|null|undefined} ui
   * @memberof Project
   * @instance
   */
  Project.prototype.ui = null

  /**
   * Creates a new Project instance using the specified properties.
   * @function create
   * @memberof Project
   * @static
   * @param {IProject=} [properties] Properties to set
   * @returns {Project} Project instance
   */
  Project.create = function create(properties) {
    return new Project(properties)
  }

  /**
   * Encodes the specified Project message. Does not implicitly {@link Project.verify|verify} messages.
   * @function encode
   * @memberof Project
   * @static
   * @param {IProject} message Project message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Project.encode = function encode(message, writer) {
    if (!writer) writer = $Writer.create()
    if (message.id != null && Object.hasOwnProperty.call(message, 'id'))
      writer.uint32(/* id 1, wireType 0 =*/ 8).int64(message.id)
    if (message.name != null && Object.hasOwnProperty.call(message, 'name'))
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.name)
    if (message.text != null && Object.hasOwnProperty.call(message, 'text'))
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.text)
    if (message.glyphs != null && Object.hasOwnProperty.call(message, 'glyphs'))
      for (
        let keys = Object.keys(message.glyphs), i = 0;
        i < keys.length;
        ++i
      ) {
        writer
          .uint32(/* id 4, wireType 2 =*/ 34)
          .fork()
          .uint32(/* id 1, wireType 2 =*/ 10)
          .string(keys[i])
        $root.GlyphFont.encode(
          message.glyphs[keys[i]],
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
        )
          .ldelim()
          .ldelim()
      }
    if (message.glyphImages != null && message.glyphImages.length)
      for (let i = 0; i < message.glyphImages.length; ++i)
        $root.GlyphImage.encode(
          message.glyphImages[i],
          writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
        ).ldelim()
    if (message.style != null && Object.hasOwnProperty.call(message, 'style'))
      $root.Style.encode(
        message.style,
        writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
      ).ldelim()
    if (message.layout != null && Object.hasOwnProperty.call(message, 'layout'))
      $root.Layout.encode(
        message.layout,
        writer.uint32(/* id 7, wireType 2 =*/ 58).fork(),
      ).ldelim()
    if (
      message.globalAdjustMetric != null &&
      Object.hasOwnProperty.call(message, 'globalAdjustMetric')
    )
      $root.Metric.encode(
        message.globalAdjustMetric,
        writer.uint32(/* id 8, wireType 2 =*/ 66).fork(),
      ).ldelim()
    if (message.ui != null && Object.hasOwnProperty.call(message, 'ui'))
      $root.Ui.encode(
        message.ui,
        writer.uint32(/* id 9, wireType 2 =*/ 74).fork(),
      ).ldelim()
    return writer
  }

  /**
   * Encodes the specified Project message, length delimited. Does not implicitly {@link Project.verify|verify} messages.
   * @function encodeDelimited
   * @memberof Project
   * @static
   * @param {IProject} message Project message or plain object to encode
   * @param {$protobuf.Writer} [writer] Writer to encode to
   * @returns {$protobuf.Writer} Writer
   */
  Project.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim()
  }

  /**
   * Decodes a Project message from the specified reader or buffer.
   * @function decode
   * @memberof Project
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @param {number} [length] Message length if known beforehand
   * @returns {Project} Project
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Project.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
    let end = length === undefined ? reader.len : reader.pos + length,
      message = new $root.Project(),
      key,
      value
    while (reader.pos < end) {
      let tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int64()
          break
        case 2:
          message.name = reader.string()
          break
        case 3:
          message.text = reader.string()
          break
        case 4:
          if (message.glyphs === $util.emptyObject) message.glyphs = {}
          let end2 = reader.uint32() + reader.pos
          key = ''
          value = null
          while (reader.pos < end2) {
            let tag2 = reader.uint32()
            switch (tag2 >>> 3) {
              case 1:
                key = reader.string()
                break
              case 2:
                value = $root.GlyphFont.decode(reader, reader.uint32())
                break
              default:
                reader.skipType(tag2 & 7)
                break
            }
          }
          message.glyphs[key] = value
          break
        case 5:
          if (!(message.glyphImages && message.glyphImages.length))
            message.glyphImages = []
          message.glyphImages.push(
            $root.GlyphImage.decode(reader, reader.uint32()),
          )
          break
        case 6:
          message.style = $root.Style.decode(reader, reader.uint32())
          break
        case 7:
          message.layout = $root.Layout.decode(reader, reader.uint32())
          break
        case 8:
          message.globalAdjustMetric = $root.Metric.decode(
            reader,
            reader.uint32(),
          )
          break
        case 9:
          message.ui = $root.Ui.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  }

  /**
   * Decodes a Project message from the specified reader or buffer, length delimited.
   * @function decodeDelimited
   * @memberof Project
   * @static
   * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
   * @returns {Project} Project
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  Project.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader)) reader = new $Reader(reader)
    return this.decode(reader, reader.uint32())
  }

  /**
   * Verifies a Project message.
   * @function verify
   * @memberof Project
   * @static
   * @param {Object.<string,*>} message Plain object to verify
   * @returns {string|null} `null` if valid, otherwise the reason why it is not
   */
  Project.verify = function verify(message) {
    if (typeof message !== 'object' || message === null)
      return 'object expected'
    if (message.id != null && message.hasOwnProperty('id'))
      if (
        !$util.isInteger(message.id) &&
        !(
          message.id &&
          $util.isInteger(message.id.low) &&
          $util.isInteger(message.id.high)
        )
      )
        return 'id: integer|Long expected'
    if (message.name != null && message.hasOwnProperty('name'))
      if (!$util.isString(message.name)) return 'name: string expected'
    if (message.text != null && message.hasOwnProperty('text'))
      if (!$util.isString(message.text)) return 'text: string expected'
    if (message.glyphs != null && message.hasOwnProperty('glyphs')) {
      if (!$util.isObject(message.glyphs)) return 'glyphs: object expected'
      let key = Object.keys(message.glyphs)
      for (let i = 0; i < key.length; ++i) {
        let error = $root.GlyphFont.verify(message.glyphs[key[i]])
        if (error) return 'glyphs.' + error
      }
    }
    if (message.glyphImages != null && message.hasOwnProperty('glyphImages')) {
      if (!Array.isArray(message.glyphImages))
        return 'glyphImages: array expected'
      for (let i = 0; i < message.glyphImages.length; ++i) {
        let error = $root.GlyphImage.verify(message.glyphImages[i])
        if (error) return 'glyphImages.' + error
      }
    }
    if (message.style != null && message.hasOwnProperty('style')) {
      let error = $root.Style.verify(message.style)
      if (error) return 'style.' + error
    }
    if (message.layout != null && message.hasOwnProperty('layout')) {
      let error = $root.Layout.verify(message.layout)
      if (error) return 'layout.' + error
    }
    if (
      message.globalAdjustMetric != null &&
      message.hasOwnProperty('globalAdjustMetric')
    ) {
      let error = $root.Metric.verify(message.globalAdjustMetric)
      if (error) return 'globalAdjustMetric.' + error
    }
    if (message.ui != null && message.hasOwnProperty('ui')) {
      let error = $root.Ui.verify(message.ui)
      if (error) return 'ui.' + error
    }
    return null
  }

  /**
   * Creates a Project message from a plain object. Also converts values to their respective internal types.
   * @function fromObject
   * @memberof Project
   * @static
   * @param {Object.<string,*>} object Plain object
   * @returns {Project} Project
   */
  Project.fromObject = function fromObject(object) {
    if (object instanceof $root.Project) return object
    let message = new $root.Project()
    if (object.id != null)
      if ($util.Long)
        (message.id = $util.Long.fromValue(object.id)).unsigned = false
      else if (typeof object.id === 'string')
        message.id = parseInt(object.id, 10)
      else if (typeof object.id === 'number') message.id = object.id
      else if (typeof object.id === 'object')
        message.id = new $util.LongBits(
          object.id.low >>> 0,
          object.id.high >>> 0,
        ).toNumber()
    if (object.name != null) message.name = String(object.name)
    if (object.text != null) message.text = String(object.text)
    if (object.glyphs) {
      if (typeof object.glyphs !== 'object')
        throw TypeError('.Project.glyphs: object expected')
      message.glyphs = {}
      for (let keys = Object.keys(object.glyphs), i = 0; i < keys.length; ++i) {
        if (typeof object.glyphs[keys[i]] !== 'object')
          throw TypeError('.Project.glyphs: object expected')
        message.glyphs[keys[i]] = $root.GlyphFont.fromObject(
          object.glyphs[keys[i]],
        )
      }
    }
    if (object.glyphImages) {
      if (!Array.isArray(object.glyphImages))
        throw TypeError('.Project.glyphImages: array expected')
      message.glyphImages = []
      for (let i = 0; i < object.glyphImages.length; ++i) {
        if (typeof object.glyphImages[i] !== 'object')
          throw TypeError('.Project.glyphImages: object expected')
        message.glyphImages[i] = $root.GlyphImage.fromObject(
          object.glyphImages[i],
        )
      }
    }
    if (object.style != null) {
      if (typeof object.style !== 'object')
        throw TypeError('.Project.style: object expected')
      message.style = $root.Style.fromObject(object.style)
    }
    if (object.layout != null) {
      if (typeof object.layout !== 'object')
        throw TypeError('.Project.layout: object expected')
      message.layout = $root.Layout.fromObject(object.layout)
    }
    if (object.globalAdjustMetric != null) {
      if (typeof object.globalAdjustMetric !== 'object')
        throw TypeError('.Project.globalAdjustMetric: object expected')
      message.globalAdjustMetric = $root.Metric.fromObject(
        object.globalAdjustMetric,
      )
    }
    if (object.ui != null) {
      if (typeof object.ui !== 'object')
        throw TypeError('.Project.ui: object expected')
      message.ui = $root.Ui.fromObject(object.ui)
    }
    return message
  }

  /**
   * Creates a plain object from a Project message. Also converts values to other types if specified.
   * @function toObject
   * @memberof Project
   * @static
   * @param {Project} message Project
   * @param {$protobuf.IConversionOptions} [options] Conversion options
   * @returns {Object.<string,*>} Plain object
   */
  Project.toObject = function toObject(message, options) {
    if (!options) options = {}
    let object = {}
    if (options.arrays || options.defaults) object.glyphImages = []
    if (options.objects || options.defaults) object.glyphs = {}
    if (options.defaults) {
      if ($util.Long) {
        let long = new $util.Long(0, 0, false)
        object.id =
          options.longs === String
            ? long.toString()
            : options.longs === Number
            ? long.toNumber()
            : long
      } else object.id = options.longs === String ? '0' : 0
      object.name = ''
      object.text = ''
      object.style = null
      object.layout = null
      object.globalAdjustMetric = null
      object.ui = null
    }
    if (message.id != null && message.hasOwnProperty('id'))
      if (typeof message.id === 'number')
        object.id = options.longs === String ? String(message.id) : message.id
      else
        object.id =
          options.longs === String
            ? $util.Long.prototype.toString.call(message.id)
            : options.longs === Number
            ? new $util.LongBits(
                message.id.low >>> 0,
                message.id.high >>> 0,
              ).toNumber()
            : message.id
    if (message.name != null && message.hasOwnProperty('name'))
      object.name = message.name
    if (message.text != null && message.hasOwnProperty('text'))
      object.text = message.text
    let keys2
    if (message.glyphs && (keys2 = Object.keys(message.glyphs)).length) {
      object.glyphs = {}
      for (let j = 0; j < keys2.length; ++j)
        object.glyphs[keys2[j]] = $root.GlyphFont.toObject(
          message.glyphs[keys2[j]],
          options,
        )
    }
    if (message.glyphImages && message.glyphImages.length) {
      object.glyphImages = []
      for (let j = 0; j < message.glyphImages.length; ++j)
        object.glyphImages[j] = $root.GlyphImage.toObject(
          message.glyphImages[j],
          options,
        )
    }
    if (message.style != null && message.hasOwnProperty('style'))
      object.style = $root.Style.toObject(message.style, options)
    if (message.layout != null && message.hasOwnProperty('layout'))
      object.layout = $root.Layout.toObject(message.layout, options)
    if (
      message.globalAdjustMetric != null &&
      message.hasOwnProperty('globalAdjustMetric')
    )
      object.globalAdjustMetric = $root.Metric.toObject(
        message.globalAdjustMetric,
        options,
      )
    if (message.ui != null && message.hasOwnProperty('ui'))
      object.ui = $root.Ui.toObject(message.ui, options)
    return object
  }

  /**
   * Converts this Project to JSON.
   * @function toJSON
   * @memberof Project
   * @instance
   * @returns {Object.<string,*>} JSON object
   */
  Project.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
  }

  return Project
})())

export { $root as default }
