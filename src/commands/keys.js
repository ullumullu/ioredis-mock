import patternMatchesString from '../commands-utils/patternMatchesString'

export function keys(globString) {
  return this.data.keys().filter(key => patternMatchesString(globString, key))
}

export function keysBuffer(globString) {
  const vals = keys.call(this, globString)
  return vals.map(Buffer.from)
}
