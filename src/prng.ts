import Prando from 'prando'

export type weightedSample = {
  weight: number
  value: weightedSample[] | any
}

export class PRNG {

  readonly seed: string
  #prng: Prando

  constructor(seed: string) {
    this.seed = seed
    this.#prng = new Prando(seed)
  }

  unit(): number {
    return this.#prng.next()
  }

  number(min: number, max: number): number {
    return this.#prng.next(min, max)
  }

  integer(min: number, max: number): number {
    return this.#prng.nextInt(min, max)
  }

  boolean(p: number = 0.5) {
    return this.unit() < p
  }

  pick(array: []) {
    return this.#prng.nextArrayItem(array)
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