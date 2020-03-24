import { PRNG } from '@scio/storyletry-prng'

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
  constructor(read: Read<Content, Interruption>, test: Test<Content>) {
    this.read = read
    this.test = test
  }
}

export default Storylet
