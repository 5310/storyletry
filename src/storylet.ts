import { Story } from './story'
import { Read } from './read'
import { Test } from './test'

export class Storylet<Content, Interruption> implements Story<Content, Interruption> {

  readonly read: Read<Content, Interruption>
  readonly test: Test

  constructor(read: Read<Content, Interruption>, test: Test) {
    this.read = read
    this.test = test
  }

  static create<Content, Interruption>(read: Content | Content[] | Read<Content, Interruption>, test: number | Test) {
    return
  }

}