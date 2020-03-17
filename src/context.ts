import { PRNG } from './prng'

export type Context<Content> = {
  readonly prng: PRNG,
  readonly state: object,
  readonly story: Content[],
  readonly index: number[],
  readonly response?: unknown,
}