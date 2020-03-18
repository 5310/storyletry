import { PRNG } from './prng'

export type Context<Content> = {
  readonly prng: PRNG,
  readonly state: object,
  readonly story: Content[],
  readonly index: number[],
  readonly response?: unknown,
}

export type End = 'END'
export const END: End = 'END'

export type Question = 'QUESTION'
export const QUESTION: Question = 'QUESTION'

export type Choice<Content> = {
  readonly slug: Content,
  readonly value: number,
}

export type Reading<Content, Interruption> = {
  readonly state: object,
  readonly story: Content[],
  readonly index: number[],
  readonly request: Choice<Content>[] | Interruption | Question | End,
}

export type Read<Content, Interruption> = (context: Context<Content>) => Reading<Content, Interruption>

export type Test<Content> = (context: Context<Content>) => number

export class Storylet<Content, Interruption> {
  readonly read: Read<Content, Interruption>
  readonly test: Test<Content>
  constructor(
    read: Read<Content, Interruption> | Content,
    test: Test<Content> | number
  ) {
    this.read = typeof read === 'function'
      ? read as Read<Content, Interruption>
      : ({ state, story }) => ({
        state,
        story: [...story, read],
        index: [],
        request: END
      })
    this.test = typeof test === 'number' ? () => test : test
  }
}

export default Storylet