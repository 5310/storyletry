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
export const makeRead = <Content, Interruption>(read: Read<Content, Interruption> | Content): Read<Content, Interruption> =>
  typeof read === 'function' ? read as Read<Content, Interruption> : ({ state, story, index }) => ({
    state,
    story: [...story, read],
    index: [],
    request: END
  })

export type Test<Content> = (context: Context<Content>) => number
export const makeTest = <Content>(test: Test<Content> | number): Test<Content> =>
  typeof test === 'number' ? () => test : test

export type Storylet<Content, Interruption> = {
  readonly read: Read<Content, Interruption>,
  readonly test: Test<Content>,
}
export const makeStorylet =
  <Content, Interruption>(
    read: Read<Content, Interruption> | Content,
    test: Test<Content> | number
  ): Storylet<Content, Interruption> => ({
    read: makeRead(read),
    test: makeTest(test),
  })

export default makeStorylet