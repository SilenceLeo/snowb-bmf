/* eslint-disable */
import * as $protobuf from 'protobufjs'

import Long = require('long')
/** Properties of a Metric. */
export interface IMetric {
  /** Metric xAdvance */
  xAdvance?: number | null

  /** Metric xOffset */
  xOffset?: number | null

  /** Metric yOffset */
  yOffset?: number | null
}

/** Represents a Metric. */
export class Metric implements IMetric {
  /**
   * Constructs a new Metric.
   * @param [properties] Properties to set
   */
  constructor(properties?: IMetric)

  /** Metric xAdvance. */
  public xAdvance: number

  /** Metric xOffset. */
  public xOffset: number

  /** Metric yOffset. */
  public yOffset: number

  /**
   * Creates a new Metric instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Metric instance
   */
  public static create(properties?: IMetric): Metric

  /**
   * Encodes the specified Metric message. Does not implicitly {@link Metric.verify|verify} messages.
   * @param message Metric message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IMetric,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Metric message, length delimited. Does not implicitly {@link Metric.verify|verify} messages.
   * @param message Metric message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IMetric,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Metric message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Metric
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Metric

  /**
   * Decodes a Metric message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Metric
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Metric

  /**
   * Verifies a Metric message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Metric message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Metric
   */
  public static fromObject(object: { [k: string]: any }): Metric

  /**
   * Creates a plain object from a Metric message. Also converts values to other types if specified.
   * @param message Metric
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Metric,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Metric to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Metric
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a GradientColor. */
export interface IGradientColor {
  /** GradientColor id */
  id?: number | null

  /** GradientColor offset */
  offset?: number | null

  /** GradientColor color */
  color?: string | null
}

/** Represents a GradientColor. */
export class GradientColor implements IGradientColor {
  /**
   * Constructs a new GradientColor.
   * @param [properties] Properties to set
   */
  constructor(properties?: IGradientColor)

  /** GradientColor id. */
  public id: number

  /** GradientColor offset. */
  public offset: number

  /** GradientColor color. */
  public color: string

  /**
   * Creates a new GradientColor instance using the specified properties.
   * @param [properties] Properties to set
   * @returns GradientColor instance
   */
  public static create(properties?: IGradientColor): GradientColor

  /**
   * Encodes the specified GradientColor message. Does not implicitly {@link GradientColor.verify|verify} messages.
   * @param message GradientColor message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IGradientColor,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified GradientColor message, length delimited. Does not implicitly {@link GradientColor.verify|verify} messages.
   * @param message GradientColor message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IGradientColor,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a GradientColor message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns GradientColor
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): GradientColor

  /**
   * Decodes a GradientColor message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns GradientColor
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array,
  ): GradientColor

  /**
   * Verifies a GradientColor message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a GradientColor message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns GradientColor
   */
  public static fromObject(object: { [k: string]: any }): GradientColor

  /**
   * Creates a plain object from a GradientColor message. Also converts values to other types if specified.
   * @param message GradientColor
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: GradientColor,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this GradientColor to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for GradientColor
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Gradient. */
export interface IGradient {
  /** Gradient type */
  type?: number | null

  /** Gradient angle */
  angle?: number | null

  /** Gradient palette */
  palette?: IGradientColor[] | null
}

/** Represents a Gradient. */
export class Gradient implements IGradient {
  /**
   * Constructs a new Gradient.
   * @param [properties] Properties to set
   */
  constructor(properties?: IGradient)

  /** Gradient type. */
  public type: number

  /** Gradient angle. */
  public angle: number

  /** Gradient palette. */
  public palette: IGradientColor[]

  /**
   * Creates a new Gradient instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Gradient instance
   */
  public static create(properties?: IGradient): Gradient

  /**
   * Encodes the specified Gradient message. Does not implicitly {@link Gradient.verify|verify} messages.
   * @param message Gradient message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IGradient,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Gradient message, length delimited. Does not implicitly {@link Gradient.verify|verify} messages.
   * @param message Gradient message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IGradient,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Gradient message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Gradient
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Gradient

  /**
   * Decodes a Gradient message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Gradient
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Gradient

  /**
   * Verifies a Gradient message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Gradient message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Gradient
   */
  public static fromObject(object: { [k: string]: any }): Gradient

  /**
   * Creates a plain object from a Gradient message. Also converts values to other types if specified.
   * @param message Gradient
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Gradient,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Gradient to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Gradient
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a PatternTexture. */
export interface IPatternTexture {
  /** PatternTexture buffer */
  buffer?: Uint8Array | null

  /** PatternTexture scale */
  scale?: number | null

  /** PatternTexture repetition */
  repetition?: string | null
}

/** Represents a PatternTexture. */
export class PatternTexture implements IPatternTexture {
  /**
   * Constructs a new PatternTexture.
   * @param [properties] Properties to set
   */
  constructor(properties?: IPatternTexture)

  /** PatternTexture buffer. */
  public buffer: Uint8Array

  /** PatternTexture scale. */
  public scale: number

  /** PatternTexture repetition. */
  public repetition: string

  /**
   * Creates a new PatternTexture instance using the specified properties.
   * @param [properties] Properties to set
   * @returns PatternTexture instance
   */
  public static create(properties?: IPatternTexture): PatternTexture

  /**
   * Encodes the specified PatternTexture message. Does not implicitly {@link PatternTexture.verify|verify} messages.
   * @param message PatternTexture message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IPatternTexture,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified PatternTexture message, length delimited. Does not implicitly {@link PatternTexture.verify|verify} messages.
   * @param message PatternTexture message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IPatternTexture,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a PatternTexture message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns PatternTexture
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): PatternTexture

  /**
   * Decodes a PatternTexture message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns PatternTexture
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array,
  ): PatternTexture

  /**
   * Verifies a PatternTexture message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a PatternTexture message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns PatternTexture
   */
  public static fromObject(object: { [k: string]: any }): PatternTexture

  /**
   * Creates a plain object from a PatternTexture message. Also converts values to other types if specified.
   * @param message PatternTexture
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: PatternTexture,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this PatternTexture to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for PatternTexture
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Fill. */
export interface IFill {
  /** Fill type */
  type?: number | null

  /** Fill color */
  color?: string | null

  /** Fill gradient */
  gradient?: IGradient | null

  /** Fill patternTexture */
  patternTexture?: IPatternTexture | null

  /** Fill width */
  width?: number | null

  /** Fill lineCap */
  lineCap?: string | null

  /** Fill lineJoin */
  lineJoin?: string | null

  /** Fill strokeType */
  strokeType?: number | null
}

/** Represents a Fill. */
export class Fill implements IFill {
  /**
   * Constructs a new Fill.
   * @param [properties] Properties to set
   */
  constructor(properties?: IFill)

  /** Fill type. */
  public type: number

  /** Fill color. */
  public color: string

  /** Fill gradient. */
  public gradient?: IGradient | null

  /** Fill patternTexture. */
  public patternTexture?: IPatternTexture | null

  /** Fill width. */
  public width: number

  /** Fill lineCap. */
  public lineCap: string

  /** Fill lineJoin. */
  public lineJoin: string

  /** Fill strokeType. */
  public strokeType: number

  /**
   * Creates a new Fill instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Fill instance
   */
  public static create(properties?: IFill): Fill

  /**
   * Encodes the specified Fill message. Does not implicitly {@link Fill.verify|verify} messages.
   * @param message Fill message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IFill,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Fill message, length delimited. Does not implicitly {@link Fill.verify|verify} messages.
   * @param message Fill message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IFill,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Fill message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Fill
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Fill

  /**
   * Decodes a Fill message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Fill
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Fill

  /**
   * Verifies a Fill message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Fill message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Fill
   */
  public static fromObject(object: { [k: string]: any }): Fill

  /**
   * Creates a plain object from a Fill message. Also converts values to other types if specified.
   * @param message Fill
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Fill,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Fill to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Fill
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a FontResource. */
export interface IFontResource {
  /** FontResource font */
  font?: Uint8Array | null
}

/** Represents a FontResource. */
export class FontResource implements IFontResource {
  /**
   * Constructs a new FontResource.
   * @param [properties] Properties to set
   */
  constructor(properties?: IFontResource)

  /** FontResource font. */
  public font: Uint8Array

  /**
   * Creates a new FontResource instance using the specified properties.
   * @param [properties] Properties to set
   * @returns FontResource instance
   */
  public static create(properties?: IFontResource): FontResource

  /**
   * Encodes the specified FontResource message. Does not implicitly {@link FontResource.verify|verify} messages.
   * @param message FontResource message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IFontResource,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified FontResource message, length delimited. Does not implicitly {@link FontResource.verify|verify} messages.
   * @param message FontResource message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IFontResource,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a FontResource message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns FontResource
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): FontResource

  /**
   * Decodes a FontResource message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns FontResource
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array,
  ): FontResource

  /**
   * Verifies a FontResource message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a FontResource message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns FontResource
   */
  public static fromObject(object: { [k: string]: any }): FontResource

  /**
   * Creates a plain object from a FontResource message. Also converts values to other types if specified.
   * @param message FontResource
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: FontResource,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this FontResource to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for FontResource
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Font. */
export interface IFont {
  /** Font fonts */
  fonts?: IFontResource[] | null

  /** Font size */
  size?: number | null

  /** Font lineHeight */
  lineHeight?: number | null

  /** Font sharp */
  sharp?: number | null
}

/** Represents a Font. */
export class Font implements IFont {
  /**
   * Constructs a new Font.
   * @param [properties] Properties to set
   */
  constructor(properties?: IFont)

  /** Font fonts. */
  public fonts: IFontResource[]

  /** Font size. */
  public size: number

  /** Font lineHeight. */
  public lineHeight: number

  /** Font sharp. */
  public sharp: number

  /**
   * Creates a new Font instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Font instance
   */
  public static create(properties?: IFont): Font

  /**
   * Encodes the specified Font message. Does not implicitly {@link Font.verify|verify} messages.
   * @param message Font message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IFont,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Font message, length delimited. Does not implicitly {@link Font.verify|verify} messages.
   * @param message Font message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IFont,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Font message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Font
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Font

  /**
   * Decodes a Font message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Font
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Font

  /**
   * Verifies a Font message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Font message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Font
   */
  public static fromObject(object: { [k: string]: any }): Font

  /**
   * Creates a plain object from a Font message. Also converts values to other types if specified.
   * @param message Font
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Font,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Font to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Font
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a GlyphFont. */
export interface IGlyphFont {
  /** GlyphFont letter */
  letter?: string | null

  /** GlyphFont adjustMetric */
  adjustMetric?: IMetric | null

  /** GlyphFont kerning */
  kerning?: { [k: string]: number } | null

  /** GlyphFont page */
  page?: number | null
}

/** Represents a GlyphFont. */
export class GlyphFont implements IGlyphFont {
  /**
   * Constructs a new GlyphFont.
   * @param [properties] Properties to set
   */
  constructor(properties?: IGlyphFont)

  /** GlyphFont letter. */
  public letter: string

  /** GlyphFont adjustMetric. */
  public adjustMetric?: IMetric | null

  /** GlyphFont kerning. */
  public kerning: { [k: string]: number }

  /** GlyphFont page. */
  public page: number

  /**
   * Creates a new GlyphFont instance using the specified properties.
   * @param [properties] Properties to set
   * @returns GlyphFont instance
   */
  public static create(properties?: IGlyphFont): GlyphFont

  /**
   * Encodes the specified GlyphFont message. Does not implicitly {@link GlyphFont.verify|verify} messages.
   * @param message GlyphFont message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IGlyphFont,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified GlyphFont message, length delimited. Does not implicitly {@link GlyphFont.verify|verify} messages.
   * @param message GlyphFont message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IGlyphFont,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a GlyphFont message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns GlyphFont
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): GlyphFont

  /**
   * Decodes a GlyphFont message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns GlyphFont
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array,
  ): GlyphFont

  /**
   * Verifies a GlyphFont message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a GlyphFont message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns GlyphFont
   */
  public static fromObject(object: { [k: string]: any }): GlyphFont

  /**
   * Creates a plain object from a GlyphFont message. Also converts values to other types if specified.
   * @param message GlyphFont
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: GlyphFont,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this GlyphFont to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for GlyphFont
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a GlyphImage. */
export interface IGlyphImage {
  /** GlyphImage letter */
  letter?: string | null

  /** GlyphImage adjustMetric */
  adjustMetric?: IMetric | null

  /** GlyphImage buffer */
  buffer?: Uint8Array | null

  /** GlyphImage fileName */
  fileName?: string | null

  /** GlyphImage fileType */
  fileType?: string | null

  /** GlyphImage selected */
  selected?: boolean | null

  /** GlyphImage kerning */
  kerning?: { [k: string]: number } | null

  /** GlyphImage page */
  page?: number | null
}

/** Represents a GlyphImage. */
export class GlyphImage implements IGlyphImage {
  /**
   * Constructs a new GlyphImage.
   * @param [properties] Properties to set
   */
  constructor(properties?: IGlyphImage)

  /** GlyphImage letter. */
  public letter: string

  /** GlyphImage adjustMetric. */
  public adjustMetric?: IMetric | null

  /** GlyphImage buffer. */
  public buffer: Uint8Array

  /** GlyphImage fileName. */
  public fileName: string

  /** GlyphImage fileType. */
  public fileType: string

  /** GlyphImage selected. */
  public selected: boolean

  /** GlyphImage kerning. */
  public kerning: { [k: string]: number }

  /** GlyphImage page. */
  public page: number

  /**
   * Creates a new GlyphImage instance using the specified properties.
   * @param [properties] Properties to set
   * @returns GlyphImage instance
   */
  public static create(properties?: IGlyphImage): GlyphImage

  /**
   * Encodes the specified GlyphImage message. Does not implicitly {@link GlyphImage.verify|verify} messages.
   * @param message GlyphImage message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IGlyphImage,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified GlyphImage message, length delimited. Does not implicitly {@link GlyphImage.verify|verify} messages.
   * @param message GlyphImage message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IGlyphImage,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a GlyphImage message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns GlyphImage
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): GlyphImage

  /**
   * Decodes a GlyphImage message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns GlyphImage
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(
    reader: $protobuf.Reader | Uint8Array,
  ): GlyphImage

  /**
   * Verifies a GlyphImage message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a GlyphImage message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns GlyphImage
   */
  public static fromObject(object: { [k: string]: any }): GlyphImage

  /**
   * Creates a plain object from a GlyphImage message. Also converts values to other types if specified.
   * @param message GlyphImage
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: GlyphImage,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this GlyphImage to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for GlyphImage
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Layout. */
export interface ILayout {
  /** Layout padding */
  padding?: number | null

  /** Layout spacing */
  spacing?: number | null

  /** Layout width */
  width?: number | null

  /** Layout height */
  height?: number | null

  /** Layout auto */
  auto?: boolean | null

  /** Layout fixedSize */
  fixedSize?: boolean | null

  /** Layout page */
  page?: number | null
}

/** Represents a Layout. */
export class Layout implements ILayout {
  /**
   * Constructs a new Layout.
   * @param [properties] Properties to set
   */
  constructor(properties?: ILayout)

  /** Layout padding. */
  public padding: number

  /** Layout spacing. */
  public spacing: number

  /** Layout width. */
  public width: number

  /** Layout height. */
  public height: number

  /** Layout auto. */
  public auto: boolean

  /** Layout fixedSize. */
  public fixedSize: boolean

  /** Layout page. */
  public page: number

  /**
   * Creates a new Layout instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Layout instance
   */
  public static create(properties?: ILayout): Layout

  /**
   * Encodes the specified Layout message. Does not implicitly {@link Layout.verify|verify} messages.
   * @param message Layout message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: ILayout,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Layout message, length delimited. Does not implicitly {@link Layout.verify|verify} messages.
   * @param message Layout message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: ILayout,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Layout message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Layout
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Layout

  /**
   * Decodes a Layout message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Layout
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Layout

  /**
   * Verifies a Layout message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Layout message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Layout
   */
  public static fromObject(object: { [k: string]: any }): Layout

  /**
   * Creates a plain object from a Layout message. Also converts values to other types if specified.
   * @param message Layout
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Layout,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Layout to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Layout
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Shadow. */
export interface IShadow {
  /** Shadow color */
  color?: string | null

  /** Shadow blur */
  blur?: number | null

  /** Shadow offsetX */
  offsetX?: number | null

  /** Shadow offsetY */
  offsetY?: number | null
}

/** Represents a Shadow. */
export class Shadow implements IShadow {
  /**
   * Constructs a new Shadow.
   * @param [properties] Properties to set
   */
  constructor(properties?: IShadow)

  /** Shadow color. */
  public color: string

  /** Shadow blur. */
  public blur: number

  /** Shadow offsetX. */
  public offsetX: number

  /** Shadow offsetY. */
  public offsetY: number

  /**
   * Creates a new Shadow instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Shadow instance
   */
  public static create(properties?: IShadow): Shadow

  /**
   * Encodes the specified Shadow message. Does not implicitly {@link Shadow.verify|verify} messages.
   * @param message Shadow message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IShadow,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Shadow message, length delimited. Does not implicitly {@link Shadow.verify|verify} messages.
   * @param message Shadow message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IShadow,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Shadow message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Shadow
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Shadow

  /**
   * Decodes a Shadow message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Shadow
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Shadow

  /**
   * Verifies a Shadow message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Shadow message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Shadow
   */
  public static fromObject(object: { [k: string]: any }): Shadow

  /**
   * Creates a plain object from a Shadow message. Also converts values to other types if specified.
   * @param message Shadow
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Shadow,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Shadow to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Shadow
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Style. */
export interface IStyle {
  /** Style font */
  font?: IFont | null

  /** Style fill */
  fill?: IFill | null

  /** Style useStroke */
  useStroke?: boolean | null

  /** Style stroke */
  stroke?: IFill | null

  /** Style useShadow */
  useShadow?: boolean | null

  /** Style shadow */
  shadow?: IShadow | null

  /** Style bgColor */
  bgColor?: string | null
}

/** Represents a Style. */
export class Style implements IStyle {
  /**
   * Constructs a new Style.
   * @param [properties] Properties to set
   */
  constructor(properties?: IStyle)

  /** Style font. */
  public font?: IFont | null

  /** Style fill. */
  public fill?: IFill | null

  /** Style useStroke. */
  public useStroke: boolean

  /** Style stroke. */
  public stroke?: IFill | null

  /** Style useShadow. */
  public useShadow: boolean

  /** Style shadow. */
  public shadow?: IShadow | null

  /** Style bgColor. */
  public bgColor: string

  /**
   * Creates a new Style instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Style instance
   */
  public static create(properties?: IStyle): Style

  /**
   * Encodes the specified Style message. Does not implicitly {@link Style.verify|verify} messages.
   * @param message Style message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IStyle,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Style message, length delimited. Does not implicitly {@link Style.verify|verify} messages.
   * @param message Style message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IStyle,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Style message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Style
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Style

  /**
   * Decodes a Style message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Style
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Style

  /**
   * Verifies a Style message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Style message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Style
   */
  public static fromObject(object: { [k: string]: any }): Style

  /**
   * Creates a plain object from a Style message. Also converts values to other types if specified.
   * @param message Style
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Style,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Style to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Style
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of an Ui. */
export interface IUi {
  /** Ui previewText */
  previewText?: string | null

  /** Ui xFractional */
  xFractional?: number | null
}

/** Represents an Ui. */
export class Ui implements IUi {
  /**
   * Constructs a new Ui.
   * @param [properties] Properties to set
   */
  constructor(properties?: IUi)

  /** Ui previewText. */
  public previewText: string

  /** Ui xFractional. */
  public xFractional: number

  /**
   * Creates a new Ui instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Ui instance
   */
  public static create(properties?: IUi): Ui

  /**
   * Encodes the specified Ui message. Does not implicitly {@link Ui.verify|verify} messages.
   * @param message Ui message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IUi,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Ui message, length delimited. Does not implicitly {@link Ui.verify|verify} messages.
   * @param message Ui message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IUi,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes an Ui message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Ui
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Ui

  /**
   * Decodes an Ui message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Ui
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Ui

  /**
   * Verifies an Ui message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates an Ui message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Ui
   */
  public static fromObject(object: { [k: string]: any }): Ui

  /**
   * Creates a plain object from an Ui message. Also converts values to other types if specified.
   * @param message Ui
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Ui,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Ui to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Ui
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}

/** Properties of a Project. */
export interface IProject {
  /** Project id */
  id?: number | Long | null

  /** Project name */
  name?: string | null

  /** Project text */
  text?: string | null

  /** Project glyphs */
  glyphs?: { [k: string]: IGlyphFont } | null

  /** Project glyphImages */
  glyphImages?: IGlyphImage[] | null

  /** Project style */
  style?: IStyle | null

  /** Project layout */
  layout?: ILayout | null

  /** Project globalAdjustMetric */
  globalAdjustMetric?: IMetric | null

  /** Project ui */
  ui?: IUi | null
}

/** Represents a Project. */
export class Project implements IProject {
  /**
   * Constructs a new Project.
   * @param [properties] Properties to set
   */
  constructor(properties?: IProject)

  /** Project id. */
  public id: number | Long

  /** Project name. */
  public name: string

  /** Project text. */
  public text: string

  /** Project glyphs. */
  public glyphs: { [k: string]: IGlyphFont }

  /** Project glyphImages. */
  public glyphImages: IGlyphImage[]

  /** Project style. */
  public style?: IStyle | null

  /** Project layout. */
  public layout?: ILayout | null

  /** Project globalAdjustMetric. */
  public globalAdjustMetric?: IMetric | null

  /** Project ui. */
  public ui?: IUi | null

  /**
   * Creates a new Project instance using the specified properties.
   * @param [properties] Properties to set
   * @returns Project instance
   */
  public static create(properties?: IProject): Project

  /**
   * Encodes the specified Project message. Does not implicitly {@link Project.verify|verify} messages.
   * @param message Project message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encode(
    message: IProject,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Encodes the specified Project message, length delimited. Does not implicitly {@link Project.verify|verify} messages.
   * @param message Project message or plain object to encode
   * @param [writer] Writer to encode to
   * @returns Writer
   */
  public static encodeDelimited(
    message: IProject,
    writer?: $protobuf.Writer,
  ): $protobuf.Writer

  /**
   * Decodes a Project message from the specified reader or buffer.
   * @param reader Reader or buffer to decode from
   * @param [length] Message length if known beforehand
   * @returns Project
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decode(
    reader: $protobuf.Reader | Uint8Array,
    length?: number,
  ): Project

  /**
   * Decodes a Project message from the specified reader or buffer, length delimited.
   * @param reader Reader or buffer to decode from
   * @returns Project
   * @throws {Error} If the payload is not a reader or valid buffer
   * @throws {$protobuf.util.ProtocolError} If required fields are missing
   */
  public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): Project

  /**
   * Verifies a Project message.
   * @param message Plain object to verify
   * @returns `null` if valid, otherwise the reason why it is not
   */
  public static verify(message: { [k: string]: any }): string | null

  /**
   * Creates a Project message from a plain object. Also converts values to their respective internal types.
   * @param object Plain object
   * @returns Project
   */
  public static fromObject(object: { [k: string]: any }): Project

  /**
   * Creates a plain object from a Project message. Also converts values to other types if specified.
   * @param message Project
   * @param [options] Conversion options
   * @returns Plain object
   */
  public static toObject(
    message: Project,
    options?: $protobuf.IConversionOptions,
  ): { [k: string]: any }

  /**
   * Converts this Project to JSON.
   * @returns JSON object
   */
  public toJSON(): { [k: string]: any }

  /**
   * Gets the default type url for Project
   * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
   * @returns The default type url
   */
  public static getTypeUrl(typeUrlPrefix?: string): string
}
