import { Storylet } from './storylet'
import { Context } from './context'
import { Reading } from './reading'
import { Test } from './test'
import { END } from './end'

export class StoryletterSequence<Content, Interruption> implements Storylet<Content, Interruption> {

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
        response: context.index[0]++,
      })

      // if delegate has any other request, bubble
      if (reading.request !== undefined) return {
        ...reading,
        story: [...context.story, ...reading.story],
        index: [context.index[0], ...reading.index]
      }

    } else { // else, "read" yourself

      if (context.response !== undefined) { // delegate if index persisted
        const index = context.response as number
        if (index >= this.substorylets.length) {
          return {
            state: context.state,
            story: context.story,
            index: [],
            request: END,
          }
        } else {
          const substorylet = this.substorylets[index]
          if (substorylet.test(context) > 0) {
            return this.read({
              ...context,
              index: [context.response as number],
              response: undefined,
            })
          } else {
            return this.read({
              ...context,
              response: (context.response as number)++,
            })
          }
        }
      } else { // else, start at 0
        return this.read({
          ...context,
          response: 0,
        })
      }

    }
  }

  // static create<Content, Interruption>(substorylets: Storylet<Content, Interruption>[], test: number | Test) {
  //   return
  // }

}