import {
  Context,
  END,
  Reading,
  Read,
  Test,
  Slug,
  Edit,
  Storylet,
} from '@scio/storyletry-storylet'
import {
  StoryletChoice,
  StoryletterChoice,
} from '@scio/storyletry-storyletter-choice'
import {
  StoryletRandom,
  StoryletterRandom,
} from '@scio/storyletry-storyletter-random'
import {
  StoryletterSequence
} from '@scio/storyletry-storyletter-sequence'

export const test = <Content>(t: Test<Content> | number): Test<Content> => typeof t === 'number' ? () => t : t

export const read = <Content, Interruption>(r: Read<Content, Interruption> | Content): Read<Content, Interruption> =>
  typeof r === 'function'
    ? r as Read<Content, Interruption>
    : ({ state, story: s }) => ({
      state,
      story: [...s, r],
      index: [],
      request: END
    })

export const stringReading = (context: Context<string>) => (strings: string[], ...keys: any[]): Reading<string, never> => ({
  state: context.state,
  story: [strings.map((s, i) => s + keys[i]).join('')],
  index: [],
  request: END,
})

export const slug = <Content, Interruption>(s: Slug<Content> | Content): Slug<Content> =>
  typeof s === 'function'
    ? s as Slug<Content>
    : (context: Context<Content>) => s

export const story = <Content, Interruption>(
  r: Read<Content, Interruption> | Content,
  t: Test<Content> | number,
): Storylet<Content, Interruption> =>
  new Storylet<Content, Interruption>(read(r), test(t))

export const choiceStory = <Content, Interruption>(
  l: (context: Context<Content>) => Content | Content,
  r: Read<Content, Interruption> | Content,
  t: Test<Content> | number,
): StoryletChoice<Content, Interruption> =>
  ({
    slug: slug(l),
    storylet: story(r, t),
  })

export const choice = <Content, Interruption>(
  s: StoryletChoice<Content, Interruption>[],
  t: Test<Content> | number,
  e?: Edit<Content, Interruption>,
): StoryletterChoice<Content, Interruption> =>
  new StoryletterChoice<Content, Interruption>(
    s.map(z => Array.isArray(z) ? { slug: slug(z[0]), storylet: z[1] } : z),
    test(t),
    e,
  )

export const random = <Content, Interruption>(
  s: (StoryletRandom<Content, Interruption> | Storylet<Content, Interruption>)[],
  t: Test<Content> | number,
  e?: Edit<Content, Interruption>,
): StoryletterRandom<Content, Interruption> =>
  new StoryletterRandom<Content, Interruption>(
    s.map(z => 'weight' in s
      ? z as StoryletRandom<Content, Interruption>
      : { weight: 1, storylet: z as Storylet<Content, Interruption> }
    ),
    test(t),
    e,
  )

export const sequence = <Content, Interruption>(
  s: Storylet<Content, Interruption>[],
  t: Test<Content> | number,
  e?: Edit<Content, Interruption>,
): StoryletterSequence<Content, Interruption> =>
  new StoryletterSequence<Content, Interruption>(s, test(t), e)