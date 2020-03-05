import * as Randoma from 'randoma'

export type weightedDist = {
  weight: number
  value: weightedDist[] | any
}

export class PRNG {

  readonly seed: string
  #randoma: Randoma

  constructor(seed: string) {
    this.seed = seed
    this.#randoma = new Randoma({ seed })
  }

  unit(): number {
    return this.#randoma.float()
  }

  number(min: number, max: number): number {
    return this.#randoma.floatInRange(min, max)
  }

  integer(min: number, max: number): number {
    return this.#randoma.integerInRange(min, max)
  }

  pick(array: []) {
    return this.#randoma.arrayItem(array)
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

  weighted(dist: weightedDist[]): any {
    let totalWeight = 0
    for (const sample of dist) {
      if (sample.weight <= 0) throw new Error('Weight cannot be negative.')
      totalWeight += sample.weight
    }
    let r = this.number(0, totalWeight)
    for (const sample of dist) {
      if (sample.weight >= r) {
        if (Array.isArray(sample.value)) {
          for (const subsample of sample.value) if (typeof subsample.weight !== 'number' || typeof subsample.value === 'undefined') return sample.value
          return this.weighted(sample.value)
        } else return sample.value
      }
      r -= sample.weight
    }
  }

}