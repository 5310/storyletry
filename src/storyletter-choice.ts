import { Storylet } from './storylet'
import { Context } from './context'
import { Reading } from './reading'
import { Test } from './test'
import { END } from './end'

export type StoryletChoice<Content, Interruption> = {
  slug: (context: Context<Content>) => Content,
  storylet: Storylet<Content, Interruption>,
}

export class StoryletterChoice<Content, Interruption> implements Storylet<Content, Interruption> {

  readonly substorylets: StoryletChoice<Content, Interruption>[]
  readonly test: Test

  constructor(substorylets: StoryletChoice<Content, Interruption>[], test: Test) {
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

      if (context.response !== undefined) { // delegate if choice given

        return this.read({ ...context, index: [context.response as number], response: undefined })

      } else { // else, compile choices

        const options = this.substorylets
          .map(({ slug, storylet }, index) => ({ index, score: storylet.test(context), slug }))
        const maxScore = options.reduce((acc, { score }) => score > acc ? score : acc, 0)
        const choices = options // FIXME: Why can't I use Array.prototype.flatMap() in TypeScript?
          .filter(({ score }) => score > 0 && score === maxScore)
          .map(({ index, slug }) => ({ slug: slug(context), value: index }))

        return {
          state: context.state,
          story: context.story,
          index: [],
          request: options.length > 0 ? choices : END,
        }

      }

    }
  }

  // static create<Content, Interruption>(substorylets: StoryletChoice<Content, Interruption>[], test: number | Test) {
  //   return
  // }

}