# Functional Programming Jargon

Functional programming (FP) provides many advantages, and its popularity has been increasing as a result. However, each programming paradigm comes with its own unique jargon and FP is no exception. By providing a glossary, we hope to make learning FP easier.

Examples are presented in JavaScript (ES2015). [Why JavaScript?](https://github.com/hemanth/functional-programming-jargon/wiki/Why-JavaScript%3F)

Where applicable, this document uses terms defined in the [Fantasy Land spec](https://github.com/fantasyland/fantasy-land).

> 🌐 **Interactive Graph**: [hemanth.github.io/functional-programming-jargon](https://hemanth.github.io/functional-programming-jargon)
> 🤖 **Agent / LLM Spec**: [hemanth.github.io/functional-programming-jargon/llms.txt](https://hemanth.github.io/functional-programming-jargon/llms.txt)

__Translations__
* [Portuguese](https://github.com/alexmoreno/jargoes-programacao-funcional)
* [Spanish](https://github.com/idcmardelplata/functional-programming-jargon/tree/master)
* [Chinese](https://github.com/shfshanyue/fp-jargon-zh)
* [Bahasa Indonesia](https://github.com/wisn/jargon-pemrograman-fungsional)
* [Python World](https://github.com/jmesyou/functional-programming-jargon.py)
* [Scala World](https://github.com/ikhoon/functional-programming-jargon.scala)
* [Rust World](https://github.com/JasonShin/functional-programming-jargon.rs)
* [Korean](https://github.com/sphilee/functional-programming-jargon)
* [Polish](https://github.com/Deloryn/functional-programming-jargon)
* [Haskell Turkish](https://github.com/mrtkp9993/functional-programming-jargon)
* [Haskell Russian](https://github.com/epogrebnyak/functional-programming-jargon)
* [Julia World](https://github.com/Moelf/functional-programming-jargon.jl)
* [French](https://github.com/marcwrobel/functional-programming-jargon-fr)

__Table of Contents__
<!-- RM(noparent,notop) -->

* [Arity](#arity)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Closure](#closure)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Auto Currying](#auto-currying)
* [Function Composition](#function-composition)
* [Continuation](#continuation)
* [IO](#io)
* [Trampoline](#trampoline)
* [Thunk](#thunk)
* [Algebraic Effects](#algebraic-effects)
* [Pure Function](#pure-function)
* [Side effects](#side-effects)
* [Idempotence](#idempotence)
* [Point-Free Style](#point-free-style)
* [Predicate](#predicate)
* [Contracts](#contracts)
* [Category](#category)
* [Semigroupoid](#semigroupoid)
* [Value](#value)
* [Constant](#constant)
  * [Constant Function](#constant-function)
  * [Constant Functor](#constant-functor)
  * [Constant Monad](#constant-monad)
* [Functor](#functor)
* [Pointed Functor](#pointed-functor)
* [Lift](#lift)
* [Referential Transparency](#referential-transparency)
* [Equational Reasoning](#equational-reasoning)
* [Memoization](#memoization)
* [Lambda](#lambda)
* [Lambda Calculus](#lambda-calculus)
* [Functional Combinator](#functional-combinator)
* [Lazy evaluation](#lazy-evaluation)
* [Monoid](#monoid)
* [Monad](#monad)
* [Comonad](#comonad)
* [Kleisli Composition](#kleisli-composition)
* [Free Monad](#free-monad)
* [Monad Transformer](#monad-transformer)
* [Applicative Functor](#applicative-functor)
* [Bifunctor](#bifunctor)
* [Contravariant Functor](#contravariant-functor)
* [Profunctor](#profunctor)
* [Alternative](#alternative)
* [Morphism](#morphism)
  * [Homomorphism](#homomorphism)
  * [Endomorphism](#endomorphism)
  * [Isomorphism](#isomorphism)
  * [Catamorphism](#catamorphism)
  * [Anamorphism](#anamorphism)
  * [Hylomorphism](#hylomorphism)
  * [Paramorphism](#paramorphism)
  * [Apomorphism](#apomorphism)
* [Natural Transformation](#natural-transformation)
* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Foldable](#foldable)
* [Traversable](#traversable)
* [Lens](#lens)
* [Prism](#prism)
* [Iso](#iso)
* [Traversal](#traversal)
* [Type Signatures](#type-signatures)
* [Algebraic data type](#algebraic-data-type)
  * [Sum type](#sum-type)
  * [Product type](#product-type)
* [Option](#option)
* [Either](#either)
* [Function](#function)
* [Partial function](#partial-function)
  * [Dealing with partial functions](#dealing-with-partial-functions)
* [Total Function](#total-function)
* [Functional Programming Libraries in JavaScript](#functional-programming-libraries-in-javascript)


<!-- /RM -->

## Arity

The number of arguments a function takes. From words like unary, binary, ternary, etc.

```js
const sum = (a, b) => a + b
// The arity of sum is 2 (binary)
const inc = a => a + 1
// The arity of inc is 1 (unary)
const zero = () => 0
// The arity of zero is 0 (nullary)
```

__Further reading__

* [Arity](https://en.wikipedia.org/wiki/Arity) on Wikipedia

## Higher-Order Functions (HOF)

A function which takes a function as an argument and/or returns a function.

```js
const filter = (predicate, xs) => xs.filter(predicate)
```

```js
const is = (type) => (x) => Object(x) instanceof type
```

```js
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Closure

A closure is a scope which captures local variables of a function for access even after the execution has moved out of the block in which it is defined.
This allows the values in the closure to be accessed by returned functions.

```js
const addTo = x => y => x + y
const addToFive = addTo(5)
addToFive(3) // => 8
```

In this case the `x` is retained in `addToFive`'s closure with the value `5`. `addToFive` can then be called with the `y`
to get back the sum.

__Further reading/Sources__
* [Lambda Vs Closure](http://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [JavaScript Closures highly voted discussion](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

## Partial Application

Partially applying a function means creating a new function by pre-filling some of the arguments to the original function.

```js
// Helper to create partially applied functions
// Takes a function and some arguments
const partial = (f, ...args) =>
  // returns a function that takes the rest of the arguments
  (...moreArgs) =>
    // and calls the original function with all of them
    f(...args, ...moreArgs)

// Something to apply
const add3 = (a, b, c) => a + b + c

// Partially applying `2` and `3` to `add3` gives you a one-argument function
const fivePlus = partial(add3, 2, 3) // (c) => 2 + 3 + c

fivePlus(4) // 9
```

You can also use `Function.prototype.bind` to partially apply a function in JS:

```js
const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
```

Partial application helps create simpler functions from more complex ones by baking in data when you have it. [Curried](#currying) functions are automatically partially applied.

## Currying

The process of converting a function that takes multiple arguments into a function that takes them one at a time.

Each time the function is called it only accepts one argument and returns a function that takes one argument until all arguments are passed.

```js
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12
```

## Auto Currying

Transforming a function that takes multiple arguments into one that if given less than its correct number of arguments returns a function that takes the rest. When the function gets the correct number of arguments it is then evaluated.

Lodash & Ramda have a `curry` function that works this way.

```js
const add = (x, y) => x + y

const curriedAdd = _.curry(add)
curriedAdd(1, 2) // 3
curriedAdd(1) // (y) => 1 + y
curriedAdd(1)(2) // 3
```

__Further reading__
* [Favoring Curry](http://fr.umio.us/favoring-curry/)
* [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

## Function Composition

The act of putting two functions together to form a third function where the output of one function is the input of the other. This is one of the most important ideas of functional programming.

```js
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // '121'
```

## Continuation

At any given point in a program, the part of the code that's yet to be executed is known as a continuation.

```js
const printAsString = (num) => console.log(`Given ${num}`)

const addOneAndContinue = (num, cc) => {
  const result = num + 1
  cc(result)
}

addOneAndContinue(2, printAsString) // 'Given 3'
```

Continuations are often seen in asynchronous programming when the program needs to wait to receive data before it can continue. The response is often passed off to the rest of the program, which is the continuation, once it's been received.

```js
const continueProgramWith = (data) => {
  // Continues program with data
}

readFileAsync('path/to/file', (err, response) => {
  if (err) {
    // handle error
    return
  }
  continueProgramWith(response)
})
```

## IO

A pure data structure that encapsulates a side effect. Instead of performing the effect immediately, `IO` wraps the action in a nullary function ([thunk](#thunk)), allowing effectful operations to be transformed, chained, and composed as pure [values](#value) without actually executing them until explicitly triggered.

```js
const IO = (run) => ({
  run,
  map: (f) => IO(() => f(run())),
  chain: (f) => IO(() => f(run()).run())
})

// Pure description - nothing executes yet
const readTimestamp = IO(() => Date.now())
const formatted = readTimestamp.map((ts) => new Date(ts).toISOString())

// Side effect executes only when calling .run()
formatted.run()
```

__Further reading__
* [IO container](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch8.html#pure-functional-magic) in Mostly Adequate Guide

## Trampoline

A mechanism that enables deep or mutually recursive functions to run without exceeding the maximum call stack limit.

In environments without Tail Call Optimization (TCO), recursive calls return a function (a thunk) instead of invoking themselves directly. The trampoline runs a while-loop that unwinds each thunk until a final value is reached.

```js
const trampoline = (fn) => (...args) => {
  let result = fn(...args)
  while (typeof result === 'function') {
    result = result()
  }
  return result
}

// Without trampoline: sumBelow(1000000) throws "Maximum call stack size exceeded"
const sumBelow = (n, acc = 0) =>
  n === 0
    ? acc
    : () => sumBelow(n - 1, acc + n) // returns a thunk instead of recursing directly

const safeSum = trampoline(sumBelow)
safeSum(1000000) // 500000500000
```

__Further reading__
* [Trampolining in JavaScript](https://raganwald.com/2013/03/28/trampolines-in-javascript.html)

## Thunk

A nullary function (a function taking zero arguments) that wraps an expression to delay its evaluation until called. Thunks are the fundamental mechanism for implementing [lazy evaluation](#lazy-evaluation), [trampolines](#trampoline), and deferred side effects.

```js
// An eager calculation executes immediately:
// const data = expensiveCalculation()

// A thunk wraps the expression in a function, deferring execution:
const thunk = () => 42 * 2

// The expression is only evaluated when explicitly called:
thunk() // 84
```

__Further reading__
* [Thunk](https://en.wikipedia.org/wiki/Thunk) on Wikipedia

## Algebraic Effects

A computational effect system that separates the invocation of an effect from its handling. Rather than coupling a function directly to its runtime environment, the function "performs" an effect operation (such as reading state, requesting configuration, or logging). An enclosing "handler" intercepts the performed effect and supplies the result, with the ability to resume or abort the computation—generalizing exceptions, async/await, and generators without requiring complex monad transformer stacks.

```js
// Generators model delimited continuations / algebraic effects:
const perform = (effect) => ({ [Symbol.for('effect')]: true, effect })

// Program performs effects without knowing who handles them:
function * fetchUserProfile (userId) {
  const config = yield perform({ type: 'ask_config' })
  yield perform({ type: 'log', message: `Fetching user ${userId} from ${config.apiUrl}` })
  return { id: userId, name: 'Alice' }
}

// Effect handler interprets effects and resumes the computation:
const handle = (generator, handlers) => {
  const iter = generator()
  const step = (value) => {
    const { done, value: yielded } = iter.next(value)
    if (done) return yielded
    if (yielded && yielded[Symbol.for('effect')]) {
      const { type } = yielded.effect
      if (handlers[type]) {
        return handlers[type](yielded.effect, (resumeVal) => step(resumeVal))
      }
    }
    return step(yielded)
  }
  return step()
}

// Running with an interpreter / handler:
handle(
  () => fetchUserProfile(42),
  {
    ask_config: (effect, resume) => resume({ apiUrl: 'https://api.test.local' }),
    log: (effect, resume) => {
      console.log(effect.message)
      return resume()
    }
  }
)
```

__Further reading__
* [Algebraic Effects for the Rest of Us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)
* [What is Algebraic Effects?](https://koka-lang.github.io/koka/doc/book.html#why-effects)

## Pure Function

A function is pure if the return value is only determined by its input values, and does not produce side effects. The function must always return the same result when given the same input.

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

As opposed to each of the following:

```js
window.name = 'Brianne'

const greet = () => `Hi, ${window.name}`

greet() // "Hi, Brianne"
```

The above example's output is based on data stored outside of the function...

```js
let greeting

const greet = (name) => {
  greeting = `Hi, ${name}`
}

greet('Brianne')
greeting // "Hi, Brianne"
```

... and this one modifies state outside of the function.

## Side effects

A function or expression is said to have a side effect if apart from returning a value, it interacts with (reads from or writes to) external mutable state.

```js
const differentEveryTime = new Date()
```

```js
console.log('IO is a side effect!')
```

## Idempotence

A function is idempotent if reapplying it to its result does not produce a different result.

```js
Math.abs(Math.abs(10))
```

```js
sort(sort(sort([2, 1])))
```

## Point-Free Style

Writing functions where the definition does not explicitly identify the arguments used. This style usually requires [currying](#currying) or other [Higher-Order functions](#higher-order-functions-hof). A.K.A Tacit programming.

```js
// Given
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

// Then

// Not point-free - `numbers` is an explicit argument
const incrementAll = (numbers) => map(add(1))(numbers)

// Point-free - The list is an implicit argument
const incrementAll2 = map(add(1))
```

Point-free function definitions look just like normal assignments without `function` or `=>`. It's worth mentioning that point-free functions are not necessarily better than their counterparts, as they can be more difficult to understand when complex.

## Predicate

A predicate is a function that returns true or false for a given value. A common use of a predicate is as the callback for array filter.

```js
const predicate = (a) => a > 2

;[1, 2, 3, 4].filter(predicate) // [3, 4]
```

## Contracts

A contract specifies the obligations and guarantees of the behavior from a function or expression at runtime. This acts as a set of rules that are expected from the input and output of a function or expression, and errors are generally reported whenever a contract is violated.

```js
// Define our contract : int -> boolean
const contract = (input) => {
  if (typeof input === 'number') return true
  throw new Error('Contract violated: expected int -> boolean')
}

const addOne = (num) => contract(num) && num + 1

addOne(2) // 3
addOne('some string') // Contract violated: expected int -> boolean
```

## Category

A category in category theory is a collection of objects and morphisms between them. In programming, typically types
act as the objects and functions as morphisms.

To be a valid category, three rules must be met:

1. There must be an identity morphism that maps an object to itself.
    Where `a` is an object in some category,
    there must be a function from `a -> a`.
2. Morphisms must compose.
    Where `a`, `b`, and `c` are objects in some category,
    and `f` is a morphism from `a -> b`, and `g` is a morphism from `b -> c`;
    `g(f(x))` must be equivalent to `(g • f)(x)`.
3. Composition must be associative
    `f • (g • h)` is the same as `(f • g) • h`.

Since these rules govern composition at very abstract level, category theory is great at uncovering new ways of composing things.

As an example we can define a category Max as a class:

```js

class Max {
  constructor (a) {
    this.a = a
  }

  id () {
    return this
  }

  compose (b) {
    return this.a > b.a ? this : b
  }

  toString () {
    return `Max(${this.a})`
  }
}

new Max(2).compose(new Max(3)).compose(new Max(5)).id().id() // => Max(5)
```

__Further reading__

* [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

## Semigroupoid

An algebraic structure with objects and morphisms that can be associatively composed, but does not guarantee the existence of an identity morphism for each object.

A semigroupoid satisfies the associativity property for [composition](#function-composition):
`f.compose(g).compose(h) === f.compose(g.compose(h))`

Every [category](#category) is a semigroupoid, but a semigroupoid does not require an identity (`id`) morphism. Functions under composition form a natural semigroupoid:

```js
const Semigroupoid = (fn) => ({
  run: fn,
  compose: (other) => Semigroupoid((x) => fn(other.run(x)))
})

const toUpper = Semigroupoid((s) => s.toUpperCase())
const exclaim = Semigroupoid((s) => `${s}!`)

const loudGreeting = exclaim.compose(toUpper)
loudGreeting.run('hello') // 'HELLO!'
```

__Further reading__
* [Semigroupoid](https://github.com/fantasyland/fantasy-land#semigroupoid) in Fantasy Land

## Value

Anything that can be assigned to a variable.

```js
5
Object.freeze({ name: 'John', age: 30 }) // The `freeze` function enforces immutability.
;(a) => a
;[1]
undefined
```

## Constant

A variable that cannot be reassigned once defined.

```js
const five = 5
const john = Object.freeze({ name: 'John', age: 30 })
```

Constants are [referentially transparent](#referential-transparency). That is, they can be replaced with the values that they represent without affecting the result.

With the above two constants the following expression will always return `true`.

```js
john.age + five === ({ name: 'John', age: 30 }).age + 5
```

### Constant Function

A [curried](#currying) function that ignores its second argument:

```js
const constant = a => () => a

;[1, 2].map(constant(0)) // => [0, 0]
```

### Constant Functor

Object whose `map` doesn't transform the contents. See [Functor](#functor).

```js
Constant(1).map(n => n + 1) // => Constant(1)
```

### Constant Monad

Object whose `chain` doesn't transform the contents. See [Monad](#monad).

```js
Constant(1).chain(n => Constant(n + 1)) // => Constant(1)
```

## Functor

An object that implements a `map` function that takes a function which is run on the contents of that object. A functor must adhere to two rules:

__Preserves identity__

```js
object.map(x => x)
```

is equivalent to just `object`.

__Composable__

```js
object.map(x => g(f(x)))
```

is equivalent to

```js
object.map(f).map(g)
```

(`f`, `g` are arbitrary composable functions)

The reference implementation of [Option](#option) is a functor as it satisfies the rules:

```js
Some(1).map(x => x) // = Some(1)
```

and

```js
const f = x => x + 1
const g = x => x * 2

Some(1).map(x => g(f(x))) // = Some(4)
Some(1).map(f).map(g) // = Some(4)
```

## Pointed Functor

An object with an `of` function that puts _any_ single value into it.

ES2015 adds `Array.of` making arrays a pointed functor.

```js
Array.of(1) // [1]
```

## Lift

Lifting is when you take a value and put it into an object like a [functor](#pointed-functor). If you lift a function into an [Applicative Functor](#applicative-functor) then you can make it work on values that are also in that functor.

Some implementations have a function called `lift`, or `liftA2` to make it easier to run functions on functors.

```js
const liftA2 = (f) => (a, b) => a.map(f).ap(b) // note it's `ap` and not `map`.

const mult = a => b => a * b

const liftedMult = liftA2(mult) // this function now works on functors like array

liftedMult([1, 2], [3]) // [3, 6]
liftA2(a => b => a + b)([1, 2], [30, 40]) // [31, 41, 32, 42]
```

Lifting a one-argument function and applying it does the same thing as `map`.

```js
const increment = (x) => x + 1

lift(increment)([2]) // [3]
;[2].map(increment) // [3]
```

Lifting simple values can be simply creating the object.

```js
Array.of(1) // => [1]
```

## Referential Transparency

An expression that can be replaced with its value without changing the
behavior of the program is said to be referentially transparent.

Given the function greet:

```js
const greet = () => 'Hello World!'
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referentially transparent. This would be broken if greet depended on external
state like configuration or a database call. See also [Pure Function](#pure-function) and
[Equational Reasoning](#equational-reasoning).

## Equational Reasoning

When an application is composed of expressions and devoid of side effects,
truths about the system can be derived from the parts. You can also be confident
about details of your system without having to go through every function.

```js
const grainToDogs = compose(chickenIntoDogs, grainIntoChicken)
const grainToCats = compose(dogsIntoCats, grainToDogs)
```

In the example above, if you know that `chickenIntoDogs` and `grainIntoChicken`
are [pure](#pure-function) then you know that the composition is pure. This can be taken further
when more is known about the functions (associative, commutative, idempotent, etc...).

## Memoization

An optimization technique that caches the return value of a function based on its input parameters. Memoization is only valid and safe for [pure functions](#pure-function) possessing [referential transparency](#referential-transparency), because calling the function with identical arguments must always yield identical results without producing observable [side effects](#side-effects).

```js
const memoize = (fn) => {
  const cache = new Map()
  return (arg) => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg))
    }
    return cache.get(arg)
  }
}

const factorial = memoize((n) => (n <= 1 ? 1 : n * factorial(n - 1)))
factorial(5) // Calculated: 120
factorial(5) // Retrieved from cache: 120
```

__Further reading__
* [Memoization](https://en.wikipedia.org/wiki/Memoization) on Wikipedia

## Lambda

An anonymous function that can be treated like a value.

```js
;(function (a) {
  return a + 1
})

;(a) => a + 1
```

Lambdas are often passed as arguments to Higher-Order functions:

```js
;[1, 2].map((a) => a + 1) // [2, 3]
```

You can assign a lambda to a variable:

```js
const add1 = (a) => a + 1
```

## Lambda Calculus

A branch of mathematics that uses functions to create a [universal model of computation](https://en.wikipedia.org/wiki/Lambda_calculus).

## Functional Combinator

A higher-order function, usually curried, which returns a new function changed in some way. Functional combinators are often used in [Point-Free Style](#point-free-style) to write especially terse programs.

```js
// The "C" combinator takes a curried two-argument function and returns one which calls the original function with the arguments reversed.
const C = (f) => (a) => (b) => f(b)(a)

const divide = (a) => (b) => a / b

const divideBy = C(divide)

const divBy10 = divideBy(10)

divBy10(30) // => 3
```

See also [List of Functional Combinators in JavaScript](https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45) which includes links to more references.

## Lazy evaluation

Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

```js
const rand = function * () {
  while (1 < 2) {
    yield Math.random()
  }
}
```

```js
const randIter = rand()
randIter.next() // Each execution gives a random value, expression is evaluated on need.
```

## Monoid

An object with a function that "combines" that object with another of the same type (semigroup) which has an "identity" value.

One simple monoid is the addition of numbers:

```js
1 + 1 // 2
```

In this case number is the object and `+` is the function.

When any value is combined with the "identity" value the result must be the original value. The identity must also be commutative.

The identity value for addition is `0`.

```js
1 + 0 // 1
0 + 1 // 1
1 + 0 === 0 + 1
```

It's also required that the grouping of operations will not affect the result (associativity):

```js
1 + (2 + 3) === (1 + 2) + 3 // true
```

Array concatenation also forms a monoid:

```js
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

The identity value is empty array `[]`:

```js
;[1, 2].concat([]) // [1, 2]
```

As a counterexample, subtraction does not form a monoid because there is no commutative identity value:

```js
0 - 4 === 4 - 0 // false
```

## Monad

A monad is an object with [`of`](#pointed-functor) and `chain` functions. `chain` is like [`map`](#functor) except it un-nests the resulting nested object.

```js
// Implementation
Array.prototype.chain = function (f) {
  return this.reduce((acc, it) => acc.concat(f(it)), [])
}

// Usage
Array.of('cat,dog', 'fish,bird').chain((a) => a.split(',')) // ['cat', 'dog', 'fish', 'bird']

// Contrast to map
Array.of('cat,dog', 'fish,bird').map((a) => a.split(',')) // [['cat', 'dog'], ['fish', 'bird']]
```

`of` is also known as `return` in other functional languages.
`chain` is also known as `flatmap` and `bind` in other languages.

## Comonad

An object that has `extract` and `extend` functions.

```js
const CoIdentity = (v) => ({
  val: v,
  extract () {
    return this.val
  },
  extend (f) {
    return CoIdentity(f(this))
  }
})
```

`extract` takes a value out of a functor:

```js
CoIdentity(1).extract() // 1
```

`extend` runs a function on the comonad. The function should return the same type as the comonad:

```js
CoIdentity(1).extend((co) => co.extract() + 1) // CoIdentity(2)
```

## Kleisli Composition

An operation for composing two [monad](#monad)-returning functions (Kleisli Arrows) where they have compatible types. In Haskell this is the `>=>` operator.

Using [Option](#option):

```js
// safeParseNum :: String -> Option Number
const safeParseNum = (b) => {
  const n = parseNumber(b)
  return isNaN(n) ? None() : Some(n)
}

// validatePositive :: Number -> Option Number
const validatePositive = (a) => a > 0 ? Some(a) : None()

// kleisliCompose :: Monad M => ((b -> M c), (a -> M b)) -> a -> M c
const kleisliCompose = (g, f) => (x) => f(x).chain(g)

// parseAndValidate :: String -> Option Number
const parseAndValidate = kleisliCompose(validatePositive, safeParseNum)

parseAndValidate('1') // => Some(1)
parseAndValidate('asdf') // => None
parseAndValidate('999') // => Some(999)
```

This works because:

 * [option](#option) is a [monad](#monad),
 * both `validatePositive` and `safeParseNum` return the same kind of monad (Option),
 * the type of `validatePositive`'s argument matches `safeParseNum`'s unwrapped return.

## Free Monad

A Free Monad is a construction that builds a [monad](#monad) out of any [functor](#functor) without adding any domain-specific behavior. It cleanly separates the description of a program (an Abstract Syntax Tree of commands) from its execution (an interpreter that evaluates the AST).

A Free Monad has two cases:
* `Pure`: wraps a final value and terminates computation.
* `Free`: wraps a functor containing the next step of the computation.

```js
// Free monad constructors:
const Pure = (x) => ({
  isPure: true,
  value: x,
  map: (f) => Pure(f(x)),
  chain: (f) => f(x)
})

const Free = (fn) => ({
  isPure: false,
  functor: fn,
  map: (f) => Free(fn.map((next) => next.map(f))),
  chain: (f) => Free(fn.map((next) => next.chain(f)))
})

// Lift an instruction functor into a Free monad:
const liftF = (cmd) => Free(cmd.map(Pure))

// Functor representing logging instructions:
const Log = (msg, next) => ({
  type: 'log',
  msg,
  next,
  map: (f) => Log(msg, f(next))
})

// Program: purely describes actions without executing them:
const logMsg = (msg) => liftF(Log(msg, null))
const program = logMsg('Starting').chain(() => logMsg('Done')).chain(() => Pure(42))

// Interpreter: executes the instruction tree:
const interpret = (freeMonad) => {
  if (freeMonad.isPure) return freeMonad.value
  const { type, msg, next } = freeMonad.functor
  if (type === 'log') {
    console.log(msg)
    return interpret(next)
  }
}

interpret(program) // Logs 'Starting', 'Done', returns 42
```

__Further reading__
* [Free Monads in JavaScript](https://medium.com/@gcanti/free-monads-in-javascript-f5df234d3d2a)

## Monad Transformer

While [functors](#functor) and [applicative functors](#applicative-functor) compose naturally, [monads](#monad) do not compose generally without knowing their specific types. A Monad Transformer is a type constructor that takes an existing monad and produces a new monad with combined capabilities (such as combining error handling, asynchronous tasks, and state).

Monad transformers typically end in `T` (e.g. `MaybeT`, `ReaderT`, `StateT`).

```js
// MaybeT wraps any outer monad M to add optionality:
const MaybeT = (M) => {
  const of = (value) => MaybeTInstance(M.of({ isSome: true, value }))
  const none = () => MaybeTInstance(M.of({ isSome: false }))

  const MaybeTInstance = (run) => ({
    run,
    chain: (f) =>
      MaybeTInstance(
        run.chain((opt) => (opt.isSome ? f(opt.value).run : M.of(opt)))
      ),
    map: (f) =>
      MaybeTInstance(
        run.map((opt) => (opt.isSome ? { isSome: true, value: f(opt.value) } : opt))
      )
  })

  return { of, none, from: MaybeTInstance }
}

// Identity monad:
const Id = (x) => ({
  value: x,
  map: (f) => Id(f(x)),
  chain: (f) => f(x)
})
Id.of = Id

// Combine Id monad with Maybe effect:
const MaybeId = MaybeT(Id)

const findUser = (id) =>
  id === 1 ? MaybeId.of({ name: 'Alice', age: 30 }) : MaybeId.none()

const getAge = (id) =>
  findUser(id)
    .chain((user) => MaybeId.of(user.age))
    .run

getAge(1).value // { isSome: true, value: 30 }
getAge(2).value // { isSome: false }
```

__Further reading__
* [Monad Transformers Step by Step](https://page.mi.fu-berlin.de/scravy/realworldhaskell/materialien/monad-transformers-step-by-step.pdf)

## Applicative Functor

An applicative functor is an object with an `ap` function. `ap` applies a function in the object to a value in another object of the same type.

```js
// Implementation
Array.prototype.ap = function (xs) {
  return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
}

// Example usage
;[(a) => a + 1].ap([1]) // [2]
```

This is useful if you have two objects and you want to apply a binary function to their contents.

```js
// Arrays that you want to combine
const arg1 = [1, 3]
const arg2 = [4, 5]

// combining function - must be curried for this to work
const add = (x) => (y) => x + y

const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]
```

This gives you an array of functions that you can call `ap` on to get the result:

```js
partiallyAppliedAdds.ap(arg2) // [5, 6, 7, 8]
```

## Bifunctor

A structure with two independent type parameters that can map over both of them simultaneously. A Bifunctor provides `bimap`, which takes two functions and maps the first over the first type parameter and the second over the second type parameter.

```js
const Pair = (first, second) => ({
  first,
  second,
  bimap: (f, g) => Pair(f(first), g(second)),
  firstMap: (f) => Pair(f(first), second),
  secondMap: (g) => Pair(first, g(second))
})

const score = Pair('alice', 10)
score.bimap((name) => name.toUpperCase(), (points) => points * 2)
// Pair('ALICE', 20)
```

__Further reading__
* [Bifunctor](https://github.com/fantasyland/fantasy-land#bifunctor) in Fantasy Land

## Contravariant Functor

A structure similar to a [functor](#functor), but whose transformation flows in the opposite direction. While a covariant functor transforms a producer `F<A>` into `F<B>` via `(a -> b)`, a contravariant functor transforms a consumer `F<A>` into `F<B>` via `(b -> a)` using `cmap` (or `contramap`).

Contravariant functors are commonly used to model predicates, validators, encoders, and sorting comparators by preprocessing inputs before feeding them to the consumer.

```js
// Predicate wraps a test function (x) -> Boolean
const Predicate = (test) => ({
  test,
  // cmap :: (b -> a) -> Predicate a -> Predicate b
  cmap: (f) => Predicate((x) => test(f(x)))
})

// An existing predicate checking if a string is long
const isLongString = Predicate((s) => s.length > 5)

// Contramap pre-processes a User object into a string (user.bio)
const hasLongBio = isLongString.cmap((user) => user.bio)

hasLongBio.test({ bio: 'Hello World' }) // true
hasLongBio.test({ bio: 'Hi' }) // false
```

__Further reading__
* [Contravariant Functor](https://github.com/fantasyland/fantasy-land#contravariant) in Fantasy Land

## Profunctor

A Profunctor is a [bifunctor](#bifunctor) that is **contravariant** in its first argument and **covariant** in its second argument.

Given a structure `P<A, B>` representing a computation that consumes `A` and produces `B`, `promap` takes two functions `(a' -> a)` and `(b -> b')` to yield `P<A', B'>`.

Functions `(a -> b)` are canonical profunctors: you can pre-process the input `(a' -> a)` and post-process the output `(b -> b')`. Profunctors form the mathematical foundation of profunctor optics.

```js
// Functions are natural profunctors:
const Profunctor = (fn) => ({
  run: fn,
  // promap :: (a' -> a) -> (b -> b') -> P a b -> P a' b'
  promap: (f, g) => Profunctor((x) => g(fn(f(x))))
})

// An existing function: String -> Number
const stringLength = Profunctor((str) => str.length)

// Pre-process input (trim whitespace) and post-process output (check if even):
const isTrimmedLengthEven = stringLength.promap(
  (raw) => raw.trim(), // contravariant: pre-process input
  (len) => len % 2 === 0 // covariant: post-process output
)

isTrimmedLengthEven.run('   code   ') // 4 is even -> true
isTrimmedLengthEven.run(' hello ') // 5 is odd -> false
```

__Further reading__
* [Profunctor](https://github.com/fantasyland/fantasy-land#profunctor) in Fantasy Land

## Alternative

An [applicative functor](#applicative-functor) that also forms a [monoid](#monoid), providing a binary choice operator `alt` (often written `<|>`) and an identity element for failure recovery and fallback logic.

When combining computations with `alt`, the structure typically represents "first success wins," falling back to subsequent alternatives if the previous computation failed or returned empty.

```js
const AltOption = {
  Some: (x) => ({
    alt: (_other) => AltOption.Some(x),
    value: x
  }),
  None: () => ({
    alt: (other) => other,
    value: null
  })
}

// Fallback configuration chain: first valid value wins
const primaryConfig = AltOption.None()
const secondaryConfig = AltOption.Some({ port: 8080 })
const defaultConfig = AltOption.Some({ port: 3000 })

const finalConfig = primaryConfig.alt(secondaryConfig).alt(defaultConfig)
finalConfig.value // { port: 8080 }
```

__Further reading__
* [Alt](https://github.com/fantasyland/fantasy-land#alt) in Fantasy Land
* [Alternative](https://github.com/fantasyland/fantasy-land#alternative) in Fantasy Land

## Morphism

A relationship between objects within a [category](#category). In the context of functional programming all functions are morphisms.

### Homomorphism

A function where there is a structural property that is the same in the input as well as the output.

For example, in a [Monoid](#monoid) homomorphism both the input and the output are monoids even if their types are different.

```js
// toList :: [number] -> string
const toList = (a) => a.join(', ')
```

`toList` is a homomorphism because:
* array is a monoid - has a `concat` operation and an identity value (`[]`),
* string is a monoid - has a `concat` operation and an identity value (`''`).

In this way, a homomorphism relates to whatever property you care about in the input and output of a transformation.

[Endomorphisms](#endomorphism) and [Isomorphisms](#isomorphism) are examples of homomorphisms.

__Further Reading__
* [Homomorphism | Learning Functional Programming in Go](https://subscription.packtpub.com/book/application-development/9781787281394/11/ch11lvl1sec90/homomorphism#:~:text=A%20homomorphism%20is%20a%20correspondence,pointing%20to%20it%20from%20A.)

### Endomorphism

A function where the input type is the same as the output. Since the types are identical, endomorphisms are also [homomorphisms](#homomorphism).

```js
// uppercase :: String -> String
const uppercase = (str) => str.toUpperCase()

// decrement :: Number -> Number
const decrement = (x) => x - 1
```

### Isomorphism

A morphism made of a pair of transformations between 2 types of objects that is structural in nature and no data is lost.

For example, 2D coordinates could be stored as an array `[2,3]` or object `{x: 2, y: 3}`.

```js
// Providing functions to convert in both directions makes the 2D coordinate structures isomorphic.
const pairToCoords = (pair) => ({ x: pair[0], y: pair[1] })

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({ x: 1, y: 2 })) // {x: 1, y: 2}
```

Isomorphisms are an interesting example of [morphism](#morphism) because more than single function is necessary for it to be satisfied. Isomorphisms are also [homomorphisms](#homomorphism) since both input and output types share the property of being reversible.

### Catamorphism

A function which deconstructs a structure into a single value. `reduceRight` is an example of a catamorphism for array structures.

```js
// sum is a catamorphism from [Number] -> Number
const sum = xs => xs.reduceRight((acc, x) => acc + x, 0)

sum([1, 2, 3, 4, 5]) // 15
```

### Anamorphism

A function that builds up a structure by repeatedly applying a function to its argument. `unfold` is an example which generates an array from a function and a seed value. This is the opposite of a [catamorphism](#catamorphism). You can think of this as an anamorphism builds up a structure and catamorphism breaks it down.

```js
const unfold = (f, seed) => {
  function go (f, seed, acc) {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}
```

```js
const countDown = n => unfold((n) => {
  return n <= 0 ? undefined : [n, n - 1]
}, n)

countDown(5) // [5, 4, 3, 2, 1]
```

### Hylomorphism

The function which composes an [anamorphism](#anamorphism) followed by a [catamorphism](#catamorphism).

```js
const sumUpToX = (x) => sum(countDown(x))
sumUpToX(5) // 15
```

### Paramorphism

A function just like `reduceRight`. However, there's a difference:

In paramorphism, your reducer's arguments are the current value, the reduction of all previous values, and the list of values that formed that reduction.

```js
// Obviously not safe for lists containing `undefined`,
// but good enough to make the point.
const para = (reducer, accumulator, elements) => {
  if (elements.length === 0) { return accumulator }

  const head = elements[0]
  const tail = elements.slice(1)

  return reducer(head, tail, para(reducer, accumulator, tail))
}

const suffixes = list => para(
  (x, xs, suffxs) => [xs, ...suffxs],
  [],
  list
)

suffixes([1, 2, 3, 4, 5]) // [[2, 3, 4, 5], [3, 4, 5], [4, 5], [5], []]
```

The third parameter in the reducer (in the above example, `[x, ... xs]`) is kind of like having a history of what got you to your current acc value.

### Apomorphism

The opposite of paramorphism, just as anamorphism is the opposite of catamorphism. With paramorphism, you retain access to the accumulator and what has been accumulated, apomorphism lets you `unfold` with the potential to return early.

## Natural Transformation

A structure-preserving mapping between two [functors](#functor), transforming `F<A>` into `G<A>` without altering or inspecting the underlying value `A`.

In functional programming, a natural transformation is a function that changes the container type while preserving the contents and obeying the naturality law: `nat(fa.map(f)) === nat(fa).map(f)`.

```js
// nat :: F a -> G a
// e.g. Array to Option (taking the head element)
const listToOption = (arr) => (arr.length > 0 ? { value: arr[0], isSome: true } : { value: null, isSome: false })

const double = (x) => x * 2

// Naturality law: transforming after map equals mapping after transform
const arrayTransformed = listToOption([1, 2, 3].map(double)) // { value: 2, isSome: true }
const mappedOption = { value: double(listToOption([1, 2, 3]).value), isSome: true } // { value: 2, isSome: true }
arrayTransformed.value === mappedOption.value // true
```

__Further reading__
* [Natural transformation](https://en.wikipedia.org/wiki/Natural_transformation) on Wikipedia

## Setoid

An object that has an `equals` function which can be used to compare other objects of the same type.

Make array a setoid:

```js
Array.prototype.equals = function (arr) {
  const len = this.length
  if (len !== arr.length) {
    return false
  }
  for (let i = 0; i < len; i++) {
    if (this[i] !== arr[i]) {
      return false
    }
  }
  return true
}

;[1, 2].equals([1, 2]) // true
;[1, 2].equals([0]) // false
```

## Semigroup

An object that has a `concat` function that combines it with another object of the same type.

```js
;[1].concat([2]) // [1, 2]
```

## Foldable

An object that has a `reduce` function that applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

```js
const sum = (list) => list.reduce((acc, val) => acc + val, 0)
sum([1, 2, 3]) // 6
```

## Traversable

A [Foldable](#foldable) and [Functor](#functor) that can turn a collection of wrapped values inside-out via `sequence` or `traverse`, transforming `F<G<A>>` into `G<F<A>>`.

This is commonly used to take a list of asynchronous operations or nullable values and pull the wrapper effect to the outside.

```js
// sequence transforms a list of Promises into a Promise of a list
// [Promise<1>, Promise<2>] -> Promise<[1, 2]>
const promiseSequence = (promises) =>
  promises.reduce(
    (acc, p) => acc.then((arr) => p.then((val) => [...arr, val])),
    Promise.resolve([])
  )

promiseSequence([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log) // [1, 2, 3]
```

__Further reading__
* [Traversable](https://github.com/fantasyland/fantasy-land#traversable) in Fantasy Land

## Lens

A lens is a structure (often an object or function) that pairs a getter and a non-mutating setter for some other data
structure.

```js
// Using [Ramda's lens](http://ramdajs.com/docs/#lens)
const nameLens = R.lens(
  // getter for name property on an object
  (obj) => obj.name,
  // setter for name property
  (val, obj) => Object.assign({}, obj, { name: val })
)
```

Having the pair of get and set for a given data structure enables a few key features.

```js
const person = { name: 'Gertrude Blanch' }

// invoke the getter
R.view(nameLens, person) // 'Gertrude Blanch'

// invoke the setter
R.set(nameLens, 'Shafi Goldwasser', person) // {name: 'Shafi Goldwasser'}

// run a function on the value in the structure
R.over(nameLens, uppercase, person) // {name: 'GERTRUDE BLANCH'}
```

Lenses are also composable. This allows easy immutable updates to deeply nested data.

```js
// This lens focuses on the first item in a non-empty array
const firstLens = R.lens(
  // get first item in array
  xs => xs[0],
  // non-mutating setter for first item in array
  (val, [__, ...xs]) => [val, ...xs]
)

const people = [{ name: 'Gertrude Blanch' }, { name: 'Shafi Goldwasser' }]

// Despite what you may assume, lenses compose left-to-right.
R.over(compose(firstLens, nameLens), uppercase, people) // [{'name': 'GERTRUDE BLANCH'}, {'name': 'Shafi Goldwasser'}]
```

Other implementations:
* [partial.lenses](https://github.com/calmm-js/partial.lenses) - Tasty syntax sugar and a lot of powerful features
* [nanoscope](http://www.kovach.me/nanoscope/) - Fluent-interface

## Prism

An optic that focuses on a sub-case or variant of a [sum type](#sum-type). Unlike a [Lens](#lens), which always assumes the target field exists on a product structure, a Prism may fail to match because the target variant might not be present.

A Prism consists of a `preview` function (which returns an [Option](#option) or null) and a `review` function (which reconstructs the whole data structure from the focused part).

```js
const Prism = (preview, review) => ({
  preview,
  review
})

// A prism focusing on numeric string values
const integerPrism = Prism(
  (str) => (/^-?\d+$/.test(str) ? Number(str) : null),
  (num) => String(num)
)

integerPrism.preview('42') // 42
integerPrism.preview('hello') // null
integerPrism.review(42) // '42'
```

__Further reading__
* [Optics / Prism](https://github.com/flunc/optics) on GitHub

## Iso

An optic that defines a lossless, reversible two-way mapping between two representations of the same information (`s` and `a`). An Iso consists of a `to` function (`s -> a`) and a `from` function (`a -> s`) such that `from(to(x)) === x` and `to(from(y)) === y`.

Isos form the foundation of reversible transformations like temperature conversions, coordinate systems, or encoding/decoding data structures.

```js
const Iso = (to, from) => ({
  to,
  from
})

// Conversion between Celsius and Fahrenheit
const tempIso = Iso(
  (c) => (c * 9) / 5 + 32, // to Fahrenheit
  (f) => ((f - 32) * 5) / 9 // from Fahrenheit
)

tempIso.to(100) // 212
tempIso.from(212) // 100
```

__Further reading__
* [Isomorphism](https://en.wikipedia.org/wiki/Isomorphism) on Wikipedia
* [Optics / Iso](https://github.com/flunc/optics) on GitHub

## Traversal

An optic that focuses on zero, one, or multiple values (`0..*`) inside a data structure simultaneously.

While a [Lens](#lens) focuses on exactly 1 value and a [Prism](#prism) focuses on 0 or 1 value, a Traversal generalizes optics to collections, trees, or filtered subsets.

A traversal provides:
* `getAll`: extracts all focused values into an array.
* `modify`: immutably transforms every focused value using a mapping function.

```js
const Traversal = (getAll, modify) => ({
  getAll,
  modify
})

// Traversal focusing only on even numbers in an array:
const evenTraversal = Traversal(
  (arr) => arr.filter((n) => n % 2 === 0),
  (f, arr) => arr.map((n) => (n % 2 === 0 ? f(n) : n))
)

const numbers = [1, 2, 3, 4, 5, 6]

evenTraversal.getAll(numbers) // [2, 4, 6]
evenTraversal.modify((n) => n * 10, numbers) // [1, 20, 3, 40, 5, 60]
```

__Further reading__
* [Optics - Traversals](https://github.com/calmm-js/partial.lenses#traversal)

## Type Signatures

Often functions in JavaScript will include comments that indicate the types of their arguments and return values.

There's quite a bit of variance across the community, but they often follow the following patterns:

```js
// functionName :: firstArgType -> secondArgType -> returnType

// add :: Number -> Number -> Number
const add = (x) => (y) => x + y

// increment :: Number -> Number
const increment = (x) => x + 1
```

If a function accepts another function as an argument it is wrapped in parentheses.

```js
// call :: (a -> b) -> a -> b
const call = (f) => (x) => f(x)
```

The letters `a`, `b`, `c`, `d` are used to signify that the argument can be of any type. The following version of `map` takes a function that transforms a value of some type `a` into another type `b`, an array of values of type `a`, and returns an array of values of type `b`.

```js
// map :: (a -> b) -> [a] -> [b]
const map = (f) => (list) => list.map(f)
```

__Further reading__
* [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
* [Mostly Adequate Guide](https://web.archive.org/web/20170602130913/https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) on Stack Overflow

## Algebraic data type

A composite type made from putting other types together. Two common classes of algebraic types are [sum](#sum-type) and [product](#product-type).

### Sum type

A Sum type is the combination of two types together into another one. It is called sum because the number of possible values in the result type is the sum of the input types.

JavaScript doesn't have types like this, but we can use `Set`s to pretend:

```js
// imagine that rather than sets here we have types that can only have these values
const bools = new Set([true, false])
const halfTrue = new Set(['half-true'])

// The weakLogic type contains the sum of the values from bools and halfTrue
const weakLogicValues = new Set([...bools, ...halfTrue])
```

Sum types are sometimes called union types, discriminated unions, or tagged unions.

There's a [couple](https://github.com/paldepind/union-type) [libraries](https://github.com/puffnfresh/daggy) in JS which help with defining and using union types.

Flow includes [union types](https://flow.org/en/docs/types/unions/) and TypeScript has [Enums](https://www.typescriptlang.org/docs/handbook/enums.html) to serve the same role.

### Product type

A **product** type combines types together in a way you're probably more familiar with:

```js
// point :: (Number, Number) -> {x: Number, y: Number}
const point = (x, y) => ({ x, y })
```
It's called a product because the total possible values of the data structure is the product of the different values. Many languages have a tuple type which is the simplest formulation of a product type.

__Further reading__
* [Set theory](https://en.wikipedia.org/wiki/Set_theory) on Wikipedia

## Option

Option is a [sum type](#sum-type) with two cases often called `Some` and `None`.

Option is useful for composing functions that might not return a value.

```js
// Naive definition

const Some = (v) => ({
  val: v,
  map (f) {
    return Some(f(this.val))
  },
  chain (f) {
    return f(this.val)
  }
})

const None = () => ({
  map (f) {
    return this
  },
  chain (f) {
    return this
  }
})

// maybeProp :: (String, {a}) -> Option a
const maybeProp = (key, obj) => typeof obj[key] === 'undefined' ? None() : Some(obj[key])
```

Use `chain` to sequence functions that return `Option`s:

```js

// getItem :: Cart -> Option CartItem
const getItem = (cart) => maybeProp('item', cart)

// getPrice :: Item -> Option Number
const getPrice = (item) => maybeProp('price', item)

// getNestedPrice :: cart -> Option a
const getNestedPrice = (cart) => getItem(cart).chain(getPrice)

getNestedPrice({}) // None()
getNestedPrice({ item: { foo: 1 } }) // None()
getNestedPrice({ item: { price: 9.99 } }) // Some(9.99)
```

`Option` is also known as `Maybe`. `Some` is sometimes called `Just`. `None` is sometimes called `Nothing`.

## Either

A [sum type](#sum-type) with two cases, `Left` and `Right`. By convention, `Right` represents a successful computation and `Left` contains an error or failure reason ("right is right").

`Either` is useful for error handling without exceptions, allowing computations to fail gracefully while remaining [pure](#pure-function) and composable.

```js
const Left = (x) => ({
  value: x,
  map: (_f) => Left(x),
  chain: (_f) => Left(x),
  fold: (f, _g) => f(x),
  isLeft: true
})

const Right = (x) => ({
  value: x,
  map: (f) => Right(f(x)),
  chain: (f) => f(x),
  fold: (_f, g) => g(x),
  isRight: true
})

// parseJson :: String -> Either String Object
const parseJson = (str) => {
  try {
    return Right(JSON.parse(str))
  } catch (err) {
    return Left(err.message)
  }
}

parseJson('{"user": "hemanth"}').map((obj) => obj.user) // Right('hemanth')
parseJson('invalid json').map((obj) => obj.user) // Left('Unexpected token...')
```

__Further reading__
* [Either](https://github.com/fantasyland/fantasy-land#either) in Fantasy Land
* [Folktale Result](https://folktale.origamitower.com/api/v2.3.0/en/folktale.result.html)

## Function

A **function** `f :: A => B` is an expression - often called arrow or lambda expression - with **exactly one (immutable)** parameter of type `A` and **exactly one** return value of type `B`. That value depends entirely on the argument, making functions context-independent, or [referentially transparent](#referential-transparency). What is implied here is that a function must not produce any hidden [side effects](#side-effects) - a function is always [pure](#pure-function), by definition. These properties make functions pleasant to work with: they are entirely deterministic and therefore predictable. Functions enable working with code as data, abstracting over behaviour:

```js
// times2 :: Number -> Number
const times2 = n => n * 2

;[1, 2, 3].map(times2) // [2, 4, 6]
```

## Partial function

A partial function is a [function](#function) which is not defined for all arguments - it might return an unexpected result or may never terminate. Partial functions add cognitive overhead, they are harder to reason about and can lead to runtime errors. Some examples:

```js
// example 1: sum of the list
// sum :: [Number] -> Number
const sum = arr => arr.reduce((a, b) => a + b)
sum([1, 2, 3]) // 6
sum([]) // TypeError: Reduce of empty array with no initial value

// example 2: get the first item in list
// first :: [A] -> A
const first = a => a[0]
first([42]) // 42
first([]) // undefined
// or even worse:
first([[42]])[0] // 42
first([])[0] // Uncaught TypeError: Cannot read property '0' of undefined

// example 3: repeat function N times
// times :: Number -> (Number -> Number) -> Number
const times = n => fn => n && (fn(n), times(n - 1)(fn))
times(3)(console.log)
// 3
// 2
// 1
times(-1)(console.log)
// RangeError: Maximum call stack size exceeded
```

### Dealing with partial functions

Partial functions are dangerous as they need to be treated with great caution. You might get an unexpected (wrong) result or run into runtime errors. Sometimes a partial function might not return at all. Being aware of and treating all these edge cases accordingly can become very tedious.
Fortunately a partial function can be converted to a regular (or total) one. We can provide default values or use guards to deal with inputs for which the (previously) partial function is undefined. Utilizing the [`Option`](#Option) type, we can yield either `Some(value)` or `None` where we would otherwise have behaved unexpectedly:

```js
// example 1: sum of the list
// we can provide default value so it will always return result
// sum :: [Number] -> Number
const sum = arr => arr.reduce((a, b) => a + b, 0)
sum([1, 2, 3]) // 6
sum([]) // 0

// example 2: get the first item in list
// change result to Option
// first :: [A] -> Option A
const first = a => a.length ? Some(a[0]) : None()
first([42]).map(a => console.log(a)) // 42
first([]).map(a => console.log(a)) // console.log won't execute at all
// our previous worst case
first([[42]]).map(a => console.log(a[0])) // 42
first([]).map(a => console.log(a[0])) // won't execute, so we won't have error here
// more of that, you will know by function return type (Option)
// that you should use `.map` method to access the data and you will never forget
// to check your input because such check become built-in into the function

// example 3: repeat function N times
// we should make function always terminate by changing conditions:
// times :: Number -> (Number -> Number) -> Number
const times = n => fn => n > 0 && (fn(n), times(n - 1)(fn))
times(3)(console.log)
// 3
// 2
// 1
times(-1)(console.log)
// won't execute anything
```

Making your partial functions total ones, these kinds of runtime errors can be prevented. Always returning a value will also make for code that is both easier to maintain and to reason about.

## Total Function

A function which returns a valid result for all inputs defined in its type. This is as opposed to [Partial Functions](#partial-function) which may throw an error, return an unexpected result, or fail to terminate.

## Functional Programming Libraries in JavaScript

* [mori](https://github.com/swannodette/mori)
* [Immutable](https://github.com/facebook/immutable-js/)
* [Immer](https://github.com/mweststrate/immer)
* [Ramda](https://github.com/ramda/ramda)
* [ramda-adjunct](https://github.com/char0n/ramda-adjunct)
* [ramda-extension](https://github.com/tommmyy/ramda-extension)
* [Folktale](http://folktale.origamitower.com/)
* [monet.js](https://cwmyers.github.io/monet.js/)
* [lodash](https://github.com/lodash/lodash)
* [Underscore.js](https://github.com/jashkenas/underscore)
* [Lazy.js](https://github.com/dtao/lazy.js)
* [maryamyriameliamurphies.js](https://github.com/sjsyrek/maryamyriameliamurphies.js)
* [Haskell in ES6](https://github.com/casualjavascript/haskell-in-es6)
* [Sanctuary](https://github.com/sanctuary-js/sanctuary)
* [Crocks](https://github.com/evilsoft/crocks)
* [Fluture](https://github.com/fluture-js/Fluture)
* [fp-ts](https://github.com/gcanti/fp-ts)

---

__P.S:__ This repo is successful due to the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
