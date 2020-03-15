import { PRNG } from './prng'

export type Context = {
  prng: PRNG,
  state: object,
  index: number[],
  response: unknown,
}
export type Choice<Content> = {
  slug: Content,
  index: number,
}
export type End = 'END'
export type Reading<Content, Question> = {
  state: object,
  story: Content[],
  index?: number[],
  request?: End | Choice<Content> | Question,
}
export type Test = (context: Context) => number
export type Read<Content, Question> = (context: Context) => Reading<Content, Question>

export default class Storylet<Content, Question> {
  test: Test
  read: Read<Content, Question>

  constructor(test: Test, read: Read<Content, Question>) {
    this.test = test
    this.read = read
  }

  static create<Content, Question>(test: number | Test, read: Content | Content[] | Read<Content, Question>) {
    return
  }
}