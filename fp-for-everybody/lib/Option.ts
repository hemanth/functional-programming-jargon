export type Some<T> = {
  readonly kind: "Option/Some" // after we explain tagged unions this will make more sense.
  readonly value: T
}

export type None = {
  readonly kind: "Option/None"
}


export const isNone = (opt: Option<unknown>): opt is None => opt.kind === 'Option/None'

export type Option<T> = Some<T> | None

export const none: None =  { kind: 'Option/None' }

export const some = <T>(value: T): Some<T> => ({kind: "Option/Some", value})

export const map = <T, U>(f: (x: T) => U) => (opt: Option<T>): Option<U> =>
    isNone(opt) ? opt :  some(f(opt.value))

export const chain = <T, U>(f: (x: T) => Option<U>) =>
  (opt: Option<T>): Option<U> =>
    isNone(opt) ? opt : f(opt.value)