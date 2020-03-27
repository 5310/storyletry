import { PRNG } from '@scio/storyletry-prng'
import {
  END,
  QUESTION,
  Choice,
  Storylet,
} from '@scio/storyletry-storylet'
import * as readline from 'readline'

const write = (s: string = '') => process.stdout.write(s + '\n')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const read = (prompt: string): Promise<string> =>
  new Promise<string>(resolve => {
    rl.question(prompt, resolve)
  })

export class StorytellerConsole {

  readonly story: Storylet<string, never>
  readonly seed: string

  constructor(story: Storylet<string, never>, seed: string = '') {
    this.story = story
    this.seed = seed
  }

  async run() {
    let step = 0
    let prng = new PRNG(this.seed + step)
    let state = {}
    let response

    do {

      const reading = this.story.read({
        prng,
        state,
        story: [],
        index: [],
        response
      })

      step++
      state = reading.state
      response = undefined

      reading.story.forEach(section => {
        write(section)
        write()
      })

      if (reading.request === END) break
      else {

        prng = new PRNG(this.seed + step)

        if (reading.request === QUESTION) {
          response = read('    ?: ')
        }

        if (Array.isArray(reading.request)) {
          reading.request.forEach((choice, i) => {
            write(`    ${i} ${choice.slug}`)
          })
          const answer = await read('    ?: ')
          write()
          response = (reading.request as Choice<string>[])[parseInt(answer, 10)].value
        }

      }

    } while (true)
  }
}

export default StorytellerConsole