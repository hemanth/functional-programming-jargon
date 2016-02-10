# Functional Programming Jargon

> The whole idea of this repos is to try and define jargon from combinatorics and category theory jargon that are used in functional programming in a easier fashion.

*Let's try and define these with examples, this is a WIP—please feel free to send PR ;)*


## Arity

> The number of arguments a function takes. From words like unary, binary, ternary, etc. This word has the distinction of being composed of two suffixes, "-ary" and "-ity." Addition, for example, takes two arguments, and so it is defined as a binary function or a function with an arity of two. Such a function may sometimes be called "dyadic" by people who prefer Greek roots to Latin. Likewise, a function that takes a variable number of arguments is called "variadic," whereas a binary function must be given two and only two arguments, currying and partial application notwithstanding (see below).

```js
const sum = (a, b) => a + b;

const arity = sum.length;
console.log(arity);
// => 2
// The arity of sum is 2
```
---

## Higher-Order Functions (HOF)

> A function which takes a function as an argument and/or returns a function.

```js
const filter = (pred, xs) => {
  const result = [];
  for (var idx = 0; idx < xs.length; idx += 1) {
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
filter(is(Number), [0, '1', 2, null]); //=> [0, 2]
```

## Partial Application

> The process of getting a function with lesser arity compared to the original
function by fixing the number of arguments is known as partial application.

```js
let sum = (a, b) => a + b;

// partially applying `a` to `40`
let partial = sum.bind(null, 40);

// Invoking it with `b`
partial(2); //=> 42
```

---

## Currying

> The process of converting a function of multiple parameters into one, which, when called with fewer parameters, returns a new function that awaits the remaining parameters.  It's important to note that this returned function, if there are still more than one parameter unspecified, is also curried.  Strictly speaking, it is only currying when the returned function accepts just one parameter, but many implementations allow for multiple parameters at each level.  This is not to be confused with partial application, in which the returned function still requires all remaining parameters to be supplied.

```js
let sum = (a, b, c) =>  a + b;

let curriedSum = a => b => c => a + b + c;

curriedSum(15)(25)(2) //=> 42.
```

---

## Purity

> A function is said to be pure if the return value is only determined by its
input values, without any side effects.

```js
let greet = "yo";

greet.toUpperCase(); // YO;

greet // yo;
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
executions with the the same input parameters.

`f(f(x)) = f(x)`

`Math.abs(Math.abs(10))`

---

## Point-Free Style

> Writing functions where the definition does not explicitly define arguments. This style usually requires [currying](#currying) or other [Higher-Order functions](#higher-order-functions-hof). A.K.A Tacit programming.

```js
// Given
let map = fn => list => list.map(fn);
let add = (a, b) => a + b;

// Then

// Not points-free - `numbers` is an explicit parameter
let incrementAll = (numbers) => map(add(1))(numbers);

// Points-free - The array is an implicit parameter
let incrementAll2 = map(add(1));
```

`total1` lists and uses the parameter `numbers`, so it is not points-free.  `total2` is written just by combining functions and values, making no mention of its arguments.  It __is__ points-free.

It is easy to recognize points-free function definitions; they are the ones that contain no '`function`' keywords and no fat arrows.

---

## Contracts

---

## Guarded Functions

---

## Categories

---

## Container Type
> A data structure that can have any other type, function, or data structure in it.

Array in JavaScript is a container type.

---

## Functor

> A container type that can be mapped over and returns the same kind of container.

Simplest functor in javascript is an `Array`

```js
[2,3,4].map( n => n * 2 ); // [4,6,8]
```
---

## Lift

> Lift takes a function with n arguments and returns one that can be run on n containers of the same type.

Map is the same as a lift over a one-argument function:

```js
lift(n => n * 2)([2,3,4]); // [4,6,8]
```
Unlike map lift can be used to combine values from multiple arrays:
```
lift((a, b)  => a * b)([1, 2], [3]); // [3, 6]
```
Lift can apply to any [Applicative Functor](#applicative-functor).

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
    while(1<2) {
        yield Math.random();
    }
}
```
```js
let randIter = rand();
randIter.next(); // Each exectuion gives a random value, expression is evluated on need.
```
---

## Monoid

> A monoid is some data type and a two parameter function that "combines" two values of the type, where an identity value that does not affect the result of the function also exists.

The simplest monoid is numbers and addition:

```js
1 + 1; // 2
```

The data type is number and the function is `+`, the addition of two numbers.

```js
1 + 0; // 1
```

The identity value is `0` - adding `0` to any number will not change it.

For something to be a monoid, it's also required that the order of operations will not affect the result:

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

---

## Monad

> A monad is a container type that provides two functions, [chain](#chain) and [ap](#applicative-functor). Monads provide an interface for executing a common sequence of commands on a particular kind of value, often one you want to avoid acting on directly. One of the most common monads is the "maybe" or optional value monad, which wraps a value that could be either nothing or something. By using a monad instead of the raw value, you can protect your code from exposure to null values. Likewise, a "state" monad can be used in a parser to algorithmically consume an input string using a repeatable sequence of steps that preserves the current state of the input from operation to operation. Also, since a monad is, by definition, a special kind of functor that also returns a monad, they can be chained together to describe any sequence of operations. In functional languages with lazy evaluation, monads are used where sequence of evaluation is important, such as in I/O. Due to this sequencing utility, they are sometimes referred to as "programmable semicolons."

The simplest monad is the Identity monad. It simply wraps a value.

```js
let Identity = v => ({ chain: transform => transform(v) })
```

---

## Chain

> A chain is a container type that implements a chain function. The chain function takes another function to run on the contained value and returns a value in the same container. The passed function must also return a value in the same container. This is also known as bind, or flatmap in other languages.

```js
['cat,dog','fish,bird'].chain((a) => a.split(',')) // ['cat','dog','fish','bird']
```

---

## Comonad

---

## Applicative Functor

> An applicative functor is a container type that can have functions put in it. A function often called `ap` is available on the type which applies a function in the container to a value in another container of the same type.

```js
[(a)=> a + 1].ap([1]) // [2]
```

---

## Morphism

---

## Isomorphic

> Two objects are Isomorphic is they satisfy the condition: `compose(to, from) == Identity` and `compose(from, to) == Identity`

```js
const toChars = [].join;

const fromChars = ''.split;

fromChars.call(toChars.call([1,2,3])) // [ '1,2,3' ]

toChars.call(fromChars.call([1,2,3])) // '1,2,3'
```

---

## Setoid

---

## Semigroup

---

## Foldable

---

## Traversable

---

## Comonad

---
