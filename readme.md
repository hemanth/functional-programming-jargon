# Functional Programming Jargon

> The whole idea of this repo is to try and define jargon from combinatorics and category theory jargon that are used in functional programming in a easier fashion.

*Let's try and define these with examples, this is a WIP—please feel free to send PR ;)*

<!-- RM(noparent,notop) -->

* [Arity](#arity)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Composition](#composition)
* [Purity](#purity)
* [Side effects](#side-effects)
* [Idempotency](#idempotency)
* [Point-Free Style](#point-free-style)
* [Contracts](#contracts)
* [Guarded Functions](#guarded-functions)
* [Categories](#categories)
* [Value](#value)
* [Constant](#constant)
* [Functor](#functor)
* [Pointed Functor](#pointed-functor)
* [Lift](#lift)
* [Referential Transparency](#referential-transparency)
* [Equational Reasoning](#equational-reasoning)
* [Lazy evaluation](#lazy-evaluation)
* [Monoid](#monoid)
* [Monad](#monad)
* [Comonad](#comonad)
* [Applicative Functor](#applicative-functor)
* [Morphism](#morphism)
* [Isomorphism](#isomorphism)
* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Foldable](#foldable)
* [Traversable](#traversable)
* [Type Signatures](#type-signatures)


<!-- /RM -->

## Arity

> The number of arguments a function takes. From words like unary, binary, ternary, etc. This word has the distinction of being composed of two suffixes, "-ary" and "-ity." Addition, for example, takes two arguments, and so it is defined as a binary function or a function with an arity of two. Such a function may sometimes be called "dyadic" by people who prefer Greek roots to Latin. Likewise, a function that takes a variable number of arguments is called "variadic," whereas a binary function must be given two and only two arguments, currying and partial application notwithstanding (see below).

```js
const sum = (a, b) => a + b;

const arity = sum.length;
console.log(arity); // 2

// The arity of sum is 2
```

---

## Higher-Order Functions (HOF)

> A function which takes a function as an argument and/or returns a function.

```js
const filter = (pred, xs) => {
    const result = [];
    for (var idx = 0; idx < xs.length; idx++) {
        if (pred(xs[idx])) {
            result.push(xs[idx]);
        }
    }
    return result;
};
```

```js
const is = type => x => Object(x) instanceof type;
```

```js
filter(is(Number), [0, '1', 2, null]); // [0, 2]
```

## Partial Application

> The process of getting a function with lesser arity compared to the original
function by fixing the number of arguments is known as partial application.

```js
let sum = (a, b) => a + b;

// partially applying `a` to `40`
let partial = sum.bind(null, 40);

// Invoking it with `b`
partial(2); // 42
```

---

## Currying

> The process of converting a function with multiple arity into the same function with an arity of one. Not to be confused with partial application, which can produce a function with an arity greater than one.

```js
let sum = (a, b) => a + b;

let curriedSum = (a) => (b) => a + b;

curriedSum(40)(2) // 42.
```

---

## Composition

> A function which combines two values of a given type (usually also some kind of functions) into a third value of the same type.

The most straightforward type of composition is called "normal function composition".
It allows you to combine functions that accept and return a single value.

```js
const compose = (f, g) => a => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // "121"
```

---

## Purity

> A function is said to be pure if the return value is only determined by its
input values, without any side effects.

```js
let greet = "yo";

greet.toUpperCase(); // "YO"

greet // "yo"
```

As opposed to:

```js
let numbers = [1, 2, 3];

numbers.splice(0); // [1, 2, 3]

numbers // []
```

---

## Side effects

> A function or expression is said to have a side effect if apart from returning a value, it modifies some state or has an observable interaction with external functions.

```js
console.log("IO is a side effect!");
```

---

## Idempotency

> A function is said to be idempotent if it has no side-effects on multiple
executions with the same input parameters.

```js
f(f(x)) = f(x)
```

```js
Math.abs(Math.abs(10))
```

---

## Point-Free Style

> Writing functions where the definition does not explicitly define arguments. This style usually requires [currying](#currying) or other [Higher-Order functions](#higher-order-functions-hof). A.K.A Tacit programming.

```js
// Given
let map = fn => list => list.map(fn);
let add = a => b => a + b;

// Then

// Not points-free - `numbers` is an explicit parameter
let incrementAll = (numbers) => map(add(1))(numbers);

// Points-free - The list is an implicit parameter
let incrementAll2 = map(add(1));
```

`incrementAll` identifies and uses the parameter `numbers`, so it is not points-free.  `incrementAll2` is written just by combining functions and values, making no mention of its arguments.  It __is__ points-free.

Points-free function definitions look just like normal assignments without `function` or `=>`.

---

## Contracts

---

## Guarded Functions

---

## Categories

> Objects with associated functions that adhere to certain rules. E.g. [Monoid](#monoid)

---

## Value

> Any complex or primitive value that is used in the computation, including functions. Values in functional programming are assumed to be immutable.

```js
5
Object.freeze({name: 'John', age: 30}) // The `freeze` function enforces immutability.
(a) => a
```

Note that value-containing structures such as [Functor](#functor), [Monad](#monad) etc. are themselves values. This means, among other things, that they can be nested within each other.

---

## Constant

> An immutable reference to a value. Not to be confused with `Variable` - a reference to a value which can at any point be updated to point to a different value.

```js
const five = 5
const john = {name: 'John', age: 30}
```

Constants are referentially transparent. That is, they can be replaced with the values that they represent without affecting the result.

In other words with the above two constants the expression:

```js
john.age + five === ({name: 'John', age: 30}).age + (5)
```

Should always return `true`.

---

## Functor

> An object with a `map` function that adheres to certains rules. `map` runs a function on values in an object and returns a new object.

Simplest functor in javascript is an `Array`:

```js
[2, 3, 4].map(n => n * 2); // [4, 6, 8]
```

Let `func` be an object implementing a `map` function, and `f`, `g` be arbitrary functions, then `func` is said to be a functor if the map function adheres to the following rules:

```js
func.map(x => x) == func
```

and

```js
func.map(x => f(g(x))) == func.map(g).map(f)
```

We can now see that `Array` is a functor because it adheres to the functor rules!

```js
[1, 2, 3].map(x => x); // = [1, 2, 3]
```

and

```js
let f = x => x + 1;
let g = x => x * 2;

[1, 2, 3].map(x => f(g(x))); // = [3, 5, 7]
[1, 2, 3].map(g).map(f);     // = [3, 5, 7]
```

---

## Pointed Functor
> A functor with an `of` method. `of` puts _any_ single value into a functor.

Array implementation:

```js
Array.prototype.of = (v) => [v];

[].of(1) // [1]
```

---

## Lift

> Lift is like `map` except it can be applied to multiple functors.

Map is the same as a lift over a one-argument function:

```js
lift(n => n * 2)([2, 3, 4]); // [4, 6, 8]
```

Unlike map lift can be used to combine values from multiple arrays:

```js
lift((a, b) => a * b)([1, 2], [3]); // [3, 6]
```

---

## Referential Transparency

> An expression that can be replaced with its value without changing the
behavior of the program is said to be referentially transparent.

Say we have function greet:

```js
let greet = () => "Hello World!";
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referentially transparent.

---

##  Equational Reasoning

> When an application is composed of expressions and devoid of side effects, truths about the system can be derived from the parts.

---

## Lazy evaluation

> Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

```js
let rand = function*() {
    while (1 < 2) {
        yield Math.random();
    }
}
```

```js
let randIter = rand();
randIter.next(); // Each execution gives a random value, expression is evaluated on need.
```

---

## Monoid

> A monoid is some data type and a two parameter function that "combines" two values of the type, where an identity value that does not affect the result of the function also exists.

One very simple monoid is numbers and addition:

```js
1 + 1; // 2
```

The data type is number and the function is `+`, the addition of two numbers.

```js
1 + 0; // 1
```

The identity value is `0` - adding `0` to any number will not change it.

For something to be a monoid, it's also required that the grouping of operations will not affect the result:

```js
1 + (2 + 3) == (1 + 2) + 3; // true
```

Array concatenation can also be said to be a monoid:

```js
[1, 2].concat([3, 4]); // [1, 2, 3, 4]
```

The identity value is empty array `[]`

```js
[1, 2].concat([]); // [1, 2]
```

Functions also form a monoid with the normal functional composition as an operation and the function which returns its input `(a) => a`

---

## Monad

> A monad is an object with [`of`](#pointed-functor) and `chain` functions. `chain` is like [`map`](#functor) except it un-nests the resulting nested object.

```js
['cat,dog', 'fish,bird'].chain(a => a.split(',')) // ['cat', 'dog', 'fish', 'bird']

//Contrast to map
['cat,dog', 'fish,bird'].map(a => a.split(',')) // [['cat', 'dog'], ['fish', 'bird']]
```

You may also see `of` and `chain` referred to as `return` and `bind` (not to be confused with the JS keyword/function...) in languages which provide monad-like constructs as part of their standard library (e.g. Haskell, F#), on [Wikipedia](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29) and in other literature. It's also important to note that `return` and `bind` are not part of the [Fantasy Land spec](https://github.com/fantasyland/fantasy-land) and are mentioned here only for the sake of people interested in learning more about monads.

---

## Comonad

> An object that has `extract` and `extend` functions.

```js
let CoIdentity = v => ({
    val: v,
    extract: this.v,
    extend: f => CoIdentity(f(this))
})
```

Extract takes a value out of a functor.

```js
CoIdentity(1).extract() // 1
```

Extend runs a function on the comonad. The function should return the same type as the comonad.

```js
CoIdentity(1).extend(co => co.extract() + 1) // CoIdentity(2)
```

---

## Applicative Functor

> An applicative functor is an object with an `ap` function. `ap` applies a function in the object to a value in another object of the same type.

```js
[(a) => a + 1].ap([1]) // [2]
```

---

## Morphism

> A transformation function.

---

## Isomorphism

> A pair of transformations between 2 types of objects that is structural in nature and no data is lost.

For example, 2D coordinates could be stored as an array `[2,3]` or object `{x: 2, y: 3}`.

```js
// Providing functions to convert in both directions makes them isomorphic.
const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```

---

## Setoid

> An object that has an `equals` function which can be used to compare other objects of the same type.

Make array a setoid:

```js
Array.prototype.equals = arr => {
    var len = this.length
    if (len != arr.length) {
        return false
    }
    for (var i = 0; i < len; i++) {
        if (this[i] !== arr[i]) {
            return false
        }
    }
    return true
}

[1, 2].equals([1, 2]) // true
[1, 2].equals([0]) // false
```

---

## Semigroup

> An object that has a `concat` function that combines it with another object of the same type.

```js
[1].concat([2]) // [1, 2]
```

---

## Foldable

> An object that has a `reduce` function that can transform that object into some other type.

```js
let sum = list => list.reduce((acc, val) => acc + val, 0);
sum([1, 2, 3]) // 6
```

---

## Traversable

---

## Type Signatures

> Often functions will include comments that indicate the types of their arguments and return types.

There's quite a bit of variance across the community but they often follow the following patterns:

```js
// functionName :: firstArgType -> secondArgType -> returnType

// add :: Number -> Number -> Number
let add = x => y => x + y

// increment :: Number -> Number
let increment = x => x + 1
```

If a function accepts another function as an argument it is wrapped in parenthesis.

```js
// call :: (a -> b) -> a -> b
let call = f => x => f(x)
```

The letters `a`, `b`, `c`, `d` are used to signify that the argument can be of any type. For this `map` it takes a function that transforms a value of some type `a` into another type `b`, an array of values of type `a`, and returns an array of values of type `b`.

```js
// map :: (a -> b) -> [a] -> [b]
let map = f => list => list.map(f)
```
---

__P.S:__ Without the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors) this repo would be meaningless!
