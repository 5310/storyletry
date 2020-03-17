import { Storylet } from './storylet'
import { Context } from './context'
import { Reading } from './reading'
import { Test } from './test'
import { END } from './end'

export class StoryletterRandom<Content, Interruption> implements Storylet<Content, Interruption> {

  readonly substorylets: Storylet<Content, Interruption>[]
  readonly test: Test

  constructor(substorylets: Storylet<Content, Interruption>[], test: Test) {
    this.substorylets = substorylets
    this.test = test
  }

  read(context: Context<Content>): Reading<Content, Interruption> {

    if (context.index.length > 0) { // delegate if needed

      const reading = this.substorylets[context.index[0]].read({ ...context, index: context.index.slice(1) })

      // if delegate wants to end, recurse
      if (reading.request === END) return this.read({
        ...context,
        state: reading.state,
        story: [...context.story, ...reading.story],
        index: [],
        response: undefined,
      })

      // if delegate has any other request, bubble
      if (reading.request !== undefined) return {
        ...reading,
        story: [...context.story, ...reading.story],
        index: [context.index[0], ...reading.index]
      }

    } else { // else, "read" yourself
      const options = context.prng.shuffle(this.substorylets)
      for (let i = 0; i < this.substorylets.length; i++) { // annoyingly, for of returns strings and you can't cast them
        if (this.substorylets[i].test(context) > 0) {
          return this.read({
            ...context,
            index: [i],
            response: undefined,
          })
        } // annoyingly, for of returns strings and you can't cast them
      }
    }
  }

  // static create<Content, Interruption>(substorylets: Storylet<Content, Interruption>[], test: number | Test) {
  //   return
  // }

}