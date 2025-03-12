export function trimTitle(title: string | undefined) {
  return title ? title.replaceAll(/\s+/gm, ' ').trim() : ''
}

export function getTrimmedTitle(element: HTMLElement) {
  return trimTitle(element.textContent!)
}

/**
 * 将文本字符串分割为唯一标签数组
 * @param text - 输入的标签文本，可以是 undefined
 * @returns 处理后的唯一标签数组
 *
 * 处理规则：
 * 1. 使用中英文逗号（,，）作为分隔符
 * 2. 去除所有多余的空白字符（空格、换行、制表符等）
 * 3. 去重并过滤空标签
 *
 * @example
 * splitTags('tag1, tag2，tag 3')  // ['tag1', 'tag2', 'tag 3']
 * splitTags('  tag1  ,  tag1  ') // ['tag1']
 * splitTags(undefined)           // []
 */
export function splitTags(text: string | undefined) {
  if (!text) {
    return []
  }

  return [
    ...new Set(
      text
        .replaceAll(/[\n\r\t\s]+/g, ' ') // 将所有空白字符替换为单个空格
        .split(/[,，]/) // 使用中英文逗号分割
        .map((tag) => tag.trim()) // 确保每个标签都没有首尾空格
        .filter(Boolean) // 过滤空字符串
    ),
  ]
}
