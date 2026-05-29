export function getInitials(name: string | undefined = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

export const formatCodeToText = (text: string) => {
  return text
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/([A-Z])/g, " $1")
}
