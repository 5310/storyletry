import { Context } from './context'
import { Reading } from './reading'

export type Read<Content, Interruption> = (context: Context<Content>) => Reading<Content, Interruption>