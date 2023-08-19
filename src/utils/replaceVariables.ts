export default function replaceVariables(
  template: string,
  variables: Record<string, unknown>,
): string {
  return template.replace(/\$\w+\$/gi, (match: string): string => {
    const key = match.replace(/\$/g, '')
    const value = variables[key]
    return value === undefined ? '' : String(value)
  })
}
