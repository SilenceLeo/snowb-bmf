---
title: Font Stroke and Outline Styles
description: A comprehensive guide to applying and customizing font strokes (outlines). Learn to use width, color, position, and line styles to create professional and readable text.
---

A stroke (or outline) is a powerful tool for enhancing font characters. It adds definition, improves readability against busy backgrounds, and allows for a wide range of visual styles.

## Applying a Stroke

To add a stroke, enable the **Stroke** option in the style editor. Once active, you can customize its appearance with the following properties.

## Core Stroke Properties

### Stroke Width and Position
- **Width**: Sets the thickness of the outline in pixels. A thicker stroke has more visual weight but can obscure details on small fonts.
- **Stroke Type**: Controls where the stroke is drawn relative to the character's edge.
  - **Outer**: The stroke is drawn entirely outside the character, preserving its original shape and making it appear larger. This is the most common type for improving readability.
  - **Middle**: The stroke is centered on the character's edge, creating a balanced outline.
  - **Inner**: The stroke is drawn inside the character's boundary, which can make the character itself appear thinner.

### Line Caps and Joins
These settings control the appearance of corners and line endings, which is especially important for stylized or script fonts.
- **Line Cap**: Determines the style for the ends of open paths.
  - **Butt**: Flat, squared-off ends.
  - **Round**: Soft, rounded ends.
  - **Square**: Squared-off ends that extend slightly.
- **Line Join**: Defines how corners are rendered where lines meet.
  - **Miter**: Sharp, pointed corners.
  - **Round**: Smooth, rounded corners.
  - **Bevel**: Flat, angled corners.

## Stroke Fill and Color

Go beyond basic outlines by customizing the stroke's fill.
- **Solid Color**: Applies a single, uniform color.
- **Gradient**: Creates a smooth color transition.
- **Image Pattern**: Fills the stroke with a repeating texture or image.

## Best Practices for Strokes

- **Contrast is Key**: Ensure high contrast between the stroke and the font's main fill for maximum readability.
- **Size Matters**: Use thinner strokes for smaller font sizes to prevent the outline from overwhelming the character shape.
- **Outer for Readability**: The **Outer** stroke type is generally the best choice for making text stand out from a background.