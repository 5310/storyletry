import { Read } from './read'

export type Story<Content, Interruption> = {
  readonly read: Read<Content, Interruption>
}