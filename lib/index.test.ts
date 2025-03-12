import { trimTitle, getTrimmedTitle, splitTags } from './index.js'

describe('trimTitle', () => {
  test('应该移除多余的空格', () => {
    expect(trimTitle('hello   world')).toBe('hello world')
    expect(trimTitle('  hello  world  ')).toBe('hello world')
    expect(trimTitle('\n\thello \n world\t')).toBe('hello world')
  })

  test('当输入为 undefined 时应返回空字符串', () => {
    expect(trimTitle(undefined)).toBe('')
  })
})

describe('getTrimmedTitle', () => {
  test('应该返回处理后的元素文本内容', () => {
    const element = document.createElement('div')
    element.textContent = '  hello  world  '
    expect(getTrimmedTitle(element)).toBe('hello world')
  })
})

describe('splitTags', () => {
  test('应该正确分割标签', () => {
    expect(splitTags('tag1,tag2,tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1，tag2，tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags(' tag1 , tag2 ,tag3 ')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags(' tag1 , , tag2 ,, ,tag3 ')).toEqual([
      'tag1',
      'tag2',
      'tag3',
    ])
  })

  test('应该处理空白字符', () => {
    expect(splitTags('\ntag1\t,\rtag2\n,\ttag3')).toEqual([
      'tag1',
      'tag2',
      'tag3',
    ])
    expect(splitTags('   tag1   ,   tag2   ')).toEqual(['tag1', 'tag2'])
  })

  test('应该处理重复标签', () => {
    expect(splitTags('tag1,tag1,tag1')).toEqual(['tag1'])
    expect(splitTags('tag1，tag1,tag1')).toEqual(['tag1'])
  })

  test('应该处理空输入', () => {
    expect(splitTags(undefined)).toEqual([])
    expect(splitTags('')).toEqual([])
    expect(splitTags('   ')).toEqual([])
    expect(splitTags(',,,，，，')).toEqual([])
  })

  test('应该处理特殊字符', () => {
    expect(splitTags('标签1,tag-2,tag_3,tag 4，,tag - 5')).toEqual([
      '标签1',
      'tag-2',
      'tag_3',
      'tag 4',
      'tag - 5',
    ])
    expect(splitTags('tag@1,tag#2,tag$3')).toEqual(['tag@1', 'tag#2', 'tag$3'])
  })

  test('应该处理混合分隔符', () => {
    expect(splitTags('tag1,tag2，tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1，，tag2,,tag3')).toEqual(['tag1', 'tag2', 'tag3'])
  })
})
