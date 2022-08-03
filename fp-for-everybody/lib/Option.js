/** type Some a = {
 *    kind: "Option/Some"
 *    value: a
 *  }
 */

/** type None = {kind: "Option/None"} */

/** type Option a = Some a | None */

/** none: None */
export const none = { kind: 'Option/None' }

export const isNone = (opt) => opt.kind === 'Option/None'

/** some :: a -> Option a */
export const some = (value) => ({ kind: 'Option/Some', value })

/** map :: (a -> b) -> Option a -> Option b */
export const map = (f) => (optT) => isNone(optT) ? none : some(f(optT.value))

/** chain :: (a -> Option b) -> Option a -> Option b */
export const chain = (f) => (optT) =>
  isNone(optT) ? optT : f(optT.value)
