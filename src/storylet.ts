import { PRNG } from './prng'

export type Context<Content> = {
  prng: PRNG,
  state: object,
  path: number[],
}
export type Reading<Content> = {
  state: object,
  content: Content[],
  interrupt?: Choice<Content> | boolean,
}
export type Choice<Content> = {
  slug: Content,
  choice: number,
}
export type Test<Content> = (context: Context<Content>) => number
export type Read<Content> = (context: Context<Content>) => Reading<Content>

export default class Storylet<Content> {
  test: Test<Content>
  read: Read<Content>

  constructor(test: Test<Content>, read: Read<Content>) {
    this.test = test
    this.read = read
  }

  static create<Content>(test: number | Test<Content>, read: Content | Content[] | Read<Content>) {
    return
  }
}