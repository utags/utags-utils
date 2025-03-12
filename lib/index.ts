export function trimTitle(title: string | undefined) {
  return title ? title.replaceAll(/\s+/gm, " ").trim() : ""
}

export function getTrimmedTitle(element: HTMLElement) {
  return trimTitle(element.textContent!)
}

export function splitTags(text: string | undefined) {
  if (!text) {
    return []
  }

  return text
    .trim()
    .replaceAll(/[\n\r\t]/gm, " ")
    .split(/\s*[,，]\s*/)
}
