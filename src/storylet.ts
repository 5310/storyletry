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
type Choice<Content> = {
  path: number[],
  choices: {
    slug: Content,
    choice: number,
  }[],
}
type Test<Content> = (context: Context<Content>) => number
type Read<Content> = (context: Context<Content>) => Reading<Content>

export class Storylet<Content> {
  readonly #read: Reading<Content>
  constructor(test: Test<Content>, read: Reading<Content>) {
    this.test = test
    this.#read = read
  }
  test: Test<Content>
  read(context: Context<Content>): Reading<Content> {
    if (this.test(context) <= 0) throw new Error('Storylet fails its test and cannot be read')
    return
  }
}