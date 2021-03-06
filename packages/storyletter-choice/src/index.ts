import { Storylet, Context, Reading, Test, Slug, Edit, END } from '@scio/storyletry-storylet'

export type StoryletChoice<Content, Interruption> = {
  slug: Slug<Content>,
  storylet: Storylet<Content, Interruption>,
}

export class StoryletterChoice<Content, Interruption> implements Storylet<Content, Interruption> {

  readonly story: StoryletChoice<Content, Interruption>[]
  readonly test: Test<Content>
  readonly edit: Edit<Content, Interruption>

  constructor(
    story: StoryletChoice<Content, Interruption>[],
    test: Test<Content>,
    edit?: Edit<Content, Interruption>,
  ) {
    this.story = story
    this.test = test
    this.edit = edit !== undefined ? edit : (_: Reading<Content, Interruption>) => _
  }

  read(context: Context<Content>): Reading<Content, Interruption> {

    if (context.index.length > 0) { // delegate if needed

      const reading = this.edit(this.story[context.index[0]].storylet.read({ ...context, index: context.index.slice(1) }))

      // if delegate wants to end, recurse
      if (reading.request === END) return reading

      // if delegate has any other request, bubble
      if (reading.request !== undefined) return {
        ...reading,
        story: [...context.story, ...reading.story],
        index: [context.index[0], ...reading.index]
      }

      // if delegate doesn't want anything particular, recurse
      return this.read({
        ...context,
        state: reading.state,
        story: [...context.story, ...reading.story],
        index: [],
        response: undefined,
      })

    } else { // else, "read" yourself

      if (context.response !== undefined) { // delegate if choice given

        return this.read({ ...context, index: [context.response as number], response: undefined })

      } else { // else, compile choices

        const options = this.story
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

    return {
      state: context.state,
      story: context.story,
      index: [],
      request: END,
    }

  }

}

export default StoryletterChoice
