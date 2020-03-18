import { Storylet, Context, Reading, Test, END } from './storylet'

type StoryletRandom<Content, Interruption> = {
  weight: number,
  storylet: Storylet<Content, Interruption>,
}

export class StoryletterRandom<Content, Interruption> implements Storylet<Content, Interruption> {

  readonly story: StoryletRandom<Content, Interruption>[]
  readonly test: Test<Content>

  constructor(
    story: (StoryletRandom<Content, Interruption> | Storylet<Content, Interruption>)[],
    test: Test<Content> | number
  ) {
    this.story = story
      .map(s => 'weight' in s
        ? s as StoryletRandom<Content, Interruption>
        : { weight: 1, storylet: s as Storylet<Content, Interruption> }
      )
    this.test = typeof test === 'number' ? () => test : test
  }

  read(context: Context<Content>): Reading<Content, Interruption> {

    if (context.index.length > 0) { // delegate if needed

      const reading = this.story[context.index[0]].storylet.read({ ...context, index: context.index.slice(1) })

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

      if (context.response === undefined) { // if there's no response with tested stories, provide it
        return this.read({
          ...context,
          response: [],
        })
      } else { // else, get on with it

        const options = this.story
          .map(({ weight }, i) => ({ weight, value: i }))
          .filter(({ value }) => !(context.response as number[]).includes(value))

        if (options.length === 0) { // if all possible options exhausted, give up
          return {
            state: context.state,
            story: context.story,
            index: [],
            request: END,
          }
        } else { // else, continue to pick a random option
          const choice = context.prng.pickWeighted(options)
          const option = this.story[choice].storylet
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
  }

}

export default StoryletterRandom