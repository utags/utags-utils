import { trimTitle, getTrimmedTitle, splitTags } from './index.js'

describe('trimTitle', () => {
  test('should remove excess whitespace', () => {
    expect(trimTitle('hello   world')).toBe('hello world')
    expect(trimTitle('  hello  world  ')).toBe('hello world')
    expect(trimTitle('\n\thello \n world\t')).toBe('hello world')
  })

  test('should return empty string when input is undefined', () => {
    expect(trimTitle(undefined)).toBe('')
  })

  test('should handle various whitespace characters', () => {
    expect(trimTitle('\r\n\t hello \f\v world \r\n')).toBe('hello world')
    expect(trimTitle('\u00A0hello\u2000world\u3000')).toBe('hello world')
    expect(trimTitle('\u2028hello\u2029world')).toBe('hello world')
  })

  test('should handle consecutive whitespace characters', () => {
    expect(trimTitle('hello\n\n\nworld')).toBe('hello world')
    expect(trimTitle('hello\t\t\tworld')).toBe('hello world')
    expect(trimTitle('hello\r\n\t \r\nworld')).toBe('hello world')
  })

  test('should handle empty strings', () => {
    expect(trimTitle('')).toBe('')
    expect(trimTitle('   ')).toBe('')
    expect(trimTitle('\n\t\r')).toBe('')
  })

  test('should handle null values', () => {
    expect(trimTitle(null)).toBe('')
  })

  test('should preserve non-whitespace characters', () => {
    expect(trimTitle('hello-world')).toBe('hello-world')
    expect(trimTitle('  hello_world  ')).toBe('hello_world')
    expect(trimTitle('\thello@world\n')).toBe('hello@world')
  })

  test('should handle Chinese and special characters', () => {
    expect(trimTitle('  你好  世界  ')).toBe('你好 世界')
    expect(trimTitle('\n你好\t世界\r')).toBe('你好 世界')
    expect(trimTitle('你好    世界')).toBe('你好 世界')
  })
})

describe('getTrimmedTitle', () => {
  test('should return processed text content of the element', () => {
    const element = document.createElement('div')
    element.textContent = '  hello  world  '
    expect(getTrimmedTitle(element)).toBe('hello world')
  })
})

describe('splitTags', () => {
  test('should correctly split tags', () => {
    expect(splitTags('tag1,tag2,tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1，tag2，tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags(' tag1 , tag2 ,tag3 ')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags(' tag1 , , tag2 ,, ,tag3 ')).toEqual([
      'tag1',
      'tag2',
      'tag3',
    ])
  })

  test('should handle whitespace characters', () => {
    expect(splitTags('\ntag1\t,\rtag2\n,\ttag3')).toEqual([
      'tag1',
      'tag2',
      'tag3',
    ])
    expect(splitTags('   tag1   ,   tag2   ')).toEqual(['tag1', 'tag2'])
  })

  test('should handle duplicate tags', () => {
    expect(splitTags('tag1,tag1,tag1')).toEqual(['tag1'])
    expect(splitTags('tag1，tag1,tag1')).toEqual(['tag1'])
  })

  test('should handle empty input', () => {
    expect(splitTags(undefined)).toEqual([])
    expect(splitTags('')).toEqual([])
    expect(splitTags('   ')).toEqual([])
    expect(splitTags(',,,，，，')).toEqual([])
  })

  test('should handle special characters', () => {
    expect(splitTags('标签1,tag-2,tag_3,tag 4，,tag - 5')).toEqual([
      '标签1',
      'tag-2',
      'tag_3',
      'tag 4',
      'tag - 5',
    ])
    expect(splitTags('tag@1,tag#2,tag$3')).toEqual(['tag@1', 'tag#2', 'tag$3'])
  })

  test('should handle mixed delimiters', () => {
    expect(splitTags('tag1,tag2，tag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1，，tag2,,tag3')).toEqual(['tag1', 'tag2', 'tag3'])
  })

  test('should handle multiple spaces between words', () => {
    expect(splitTags('tag  1,tag   2,tag    3')).toEqual([
      'tag 1',
      'tag 2',
      'tag 3',
    ])
    expect(splitTags('hello  world,javascript   react')).toEqual([
      'hello world',
      'javascript react',
    ])
    expect(splitTags('multi     space,between    words')).toEqual([
      'multi space',
      'between words',
    ])
  })

  test('should handle tab characters', () => {
    expect(splitTags('tag\t1,tag\t\t2,tag\t\t\t3')).toEqual([
      'tag 1',
      'tag 2',
      'tag 3',
    ])
    expect(splitTags('hello\tworld,javascript\t\treact')).toEqual([
      'hello world',
      'javascript react',
    ])
    expect(splitTags('tab\tbetween\t\twords')).toEqual(['tab between words'])
  })

  test('should handle line breaks as delimiters', () => {
    expect(splitTags('tag1\ntag2\ntag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1\r\ntag2\r\ntag3')).toEqual(['tag1', 'tag2', 'tag3'])
    expect(splitTags('tag1\n\ntag2\n\n\ntag3')).toEqual([
      'tag1',
      'tag2',
      'tag3',
    ])
  })

  test('should handle mixed whitespace characters and delimiters', () => {
    expect(splitTags('tag  1\ntag\t\t2，tag   3')).toEqual([
      'tag 1',
      'tag 2',
      'tag 3',
    ])
    expect(splitTags('hello  world\n\njavascript\t\treact，vue')).toEqual([
      'hello world',
      'javascript react',
      'vue',
    ])
  })

  test('should handle complex mixed cases', () => {
    expect(splitTags('前端\n后端，UI\tUX,  人工  智能')).toEqual([
      '前端',
      '后端',
      'UI UX',
      '人工 智能',
    ])
    expect(splitTags('React  Native\nVue.js，Angular\t\tJS')).toEqual([
      'React Native',
      'Vue.js',
      'Angular JS',
    ])
  })
})
