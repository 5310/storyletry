import Prando from 'prando'
/**
 * A sample with an arbitrary value and weight
 * 
 * @property weight must be positive
 * @property value
 */
export type WeightedSample<T> = {
  readonly weight: number
  readonly value: WeightedSample<T>[] | T
}

export class PRNG {

  readonly seed: string
  #prng: Prando

  constructor(seed: string) {
    this.seed = seed
    this.#prng = new Prando(seed)
  }

  /**
   * @returns A random number in unit range; 0 inclusive, and 1 exclusive
   */
  unit(): number {
    return this.#prng.next()
  }

  /**
   * @param min The minimum limit of the range; inclusive
   * @param max The maximum limit of the range; exclusive
   * @returns A random number within min and max
   */
  number(min: number, max: number): number {
    return this.#prng.next(min, max)
  }

  /**
   * @param min The minimum limit of the range; inclusive
   * @param max The maximum limit of the range; exclusive
   * @returns A random floored integer within min and max
   */
  integer(min: number, max: number): number {
    return this.#prng.nextInt(min, max)
  }

  /**
   * @param p The odds of the boolean to return true [default 0.5]
   * @returns A boolean value generated per the given odds
   */
  boolean(p: number = 0.5): boolean {
    return this.unit() < p
  }

  /**
   * @param array An array to pick from
   * @returns A random element from the array
   */
  pick<T>(array: T[]): T {
    return this.#prng.nextArrayItem(array)
  }

  /**
   * @param array An array to shuffle immutably
   * @returns A shuffled array
   */
  shuffle<T>(array: T[]): T[] {
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

  /**
   * Picks a value from the distribution of discretely weighted values
   * where the chance of picking any value is proportional to its weight over the sum of all other weights.
   *
   * @param dist A distribution of weighted values
   * @returns A random value picked as per the weights
   */
  pickWeighted<T>(dist: WeightedSample<T>[]): any {
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

export default PRNG