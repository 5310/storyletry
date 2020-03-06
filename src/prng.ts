import hash from '@sindresorhus/string-hash'
import ParkMiller from 'park-miller'

export type weightedSample = {
  weight: number
  value: weightedSample[] | any
}

export class PRNG {

  readonly seed: string
  #prng: ParkMiller

  constructor(seed: string) {
    this.seed = seed
    this.#prng = new ParkMiller(hash(seed))
  }

  unit(): number {
    return this.#prng.float()
  }

  number(min: number, max: number): number {
    return this.#prng.floatInRange(min, max)
  }

  integer(min: number, max: number): number {
    return this.#prng.integerInRange(min, max)
  }

  boolean(p: number = 0.5) {
    return this.unit() < p
  }

  pick(array: []) {
    return array[this.integer(0, array.length)]
  }

  shuffle(array: []) {
    const array_ = [...array]
    let length = array.length
    while (length) {
      const i = Math.floor(this.unit() * length--)
      const temp = array_[length]
      array_[length] = array_[i]
      array_[i] = temp
    }
    return array_
  }

  pickWeighted(dist: weightedSample[]): any {
    let totalWeight = 0
    for (const sample of dist) {
      if (sample.weight <= 0) throw new Error('Weight cannot be negative.')
      totalWeight += sample.weight
    }
    let r = this.number(0, totalWeight)
    for (const sample of dist) {
      if (sample.weight >= r) {
        // Recursively pick weighed samples
        // Can't be bothered to turn this into a class, and assetions won't help me with arrays, so this would have to do...
        if (Array.isArray(sample.value)) {
          for (const subsample of sample.value) if (typeof subsample.weight !== 'number' || typeof subsample.value === 'undefined') return sample.value
          return this.pickWeighted(sample.value)
        } else return sample.value
      }
      r -= sample.weight
    }
  }

}