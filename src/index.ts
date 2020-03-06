import { PRNG } from './prng'

// tslint:disable-next-line: no-console
const log = console.log

const prng = new PRNG('test')
log(prng)
log(prng.number(0, 1000))