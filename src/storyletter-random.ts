import { Storylet } from './storylet'
import { Context } from './context'
import { Reading } from './reading'
import { Test } from './test'
import { END } from './end'

type StoryletRandom<Content, Interruption> = {
  weight: number,
  storylet: Storylet<Content, Interruption>,
}

export class StoryletterRandom<Content, Interruption> implements Storylet<Content, Interruption> {

  readonly substorylets: StoryletRandom<Content, Interruption>[]
  readonly test: Test

  constructor(substorylets: StoryletRandom<Content, Interruption>[], test: Test) {
    this.substorylets = substorylets
    this.test = test
  }

  read(context: Context<Content>): Reading<Content, Interruption> {

    if (context.index.length > 0) { // delegate if needed

      const reading = this.substorylets[context.index[0]].storylet.read({ ...context, index: context.index.slice(1) })

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

      if (context.response === undefined) { // if there's no response of tested substorylets, provide it
        return this.read({
          ...context,
          response: [],
        })
      } else { // else, get on with it

        const options = this.substorylets
          .map(({ weight }, i) => ({ weight, value: i }))
          .filter(({ value }) => !(context.response as number[]).includes(value))

        const choice = context.prng.pickWeighted(options)
        const option = this.substorylets[choice].storylet
        if (option.test(context) > 0) { // if picked substorylet is valid, delegate
          return this.read({
            ...context,
            index: [choice],
            response: undefined,
          })
        } else { // else, recurse with it checked out
          return this.read({
            ...context,
            index: [],
            response: [...context.response as number[], choice],
          })
        }

      }

    }
  }

  static create<Content, Interruption>(substorylets: StoryletRandom<Content, Interruption>[], test: number | Test) {
    // TODO: guard overloaded factory functions
    return
  }

}