export function getInitials(
  name: string | undefined = "",
  maxCharsToReturn: number = 2
) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, maxCharsToReturn)
    .join("")
    .toUpperCase()
}

export const formatCodeToText = (text: string) => {
  return text
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/([A-Z])/g, " $1")
}
