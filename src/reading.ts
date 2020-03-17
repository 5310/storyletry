import { End } from './end'
import { Choice } from './choice'
import { Question } from './question'

export type Reading<Content, Interruption> = {
  readonly state: object,
  readonly story: Content[],
  readonly index: number[],
  readonly request: Choice<Content>[] | Interruption | Question | End,
}