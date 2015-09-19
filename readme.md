# Functional Programming Jargons

> The whole idea of this repos is to try and define jargons from combinatorics and category theory jargons that are used in functional programming in a easier fashion.

*Let's try and define these with examples, this is a WIP—please feel free to send PR ;)*


## Arity

> The number of arguments a function takes.

```js
const sum = (a, b) => a + b;

const arity = sum.length;
console.log(arity);
// => 2
// The arity of sum is 2
```
---

## Higher Order Functions (HOF)

> A function that receives a function as argument and call or return the passed function.

```js
let greet = (name) => () => `Hello ${name}!`;
```

```js
greet("HOF")(); // Hello HOF!
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

> The process of converting a function with multiple arity into the same function with an arity of one. Not to be confused with partial application, which can produce a function with an arity greater than one.

```js
let sum = (a,b) => a+b;

let curriedSum = (a) => (b) => a + b;

curriedSum(40)(2) // 42.
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

## Point Free

> A function whose definition does not include information regarding its arguments.

```js
let abs = Math.abs
```

---

## Contracts

---

## Guarded Functions

---

## Categories

---

## Functor

> Structure that can be mapped over.

Simplest functor in javascript is an `Array`

```js
[2,3,4].map( n => n * 2 ); // [4,6,8]
```
---

## Referential Transparency

> An expression that can be replaced with its value without changing the
behavior of the program is said to be referential transparent.

Say we have function greet:

```js
let greet = () => "Hello World!";
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referential transparent.

---

##  Equational Reasoning

---

## Lazy evalution

> aka call-by-need is an evaluation mechanism which delays the evaluation of an expression until its value is needed.

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

> A Monad is a pattern to describe computations as a series of steps.

A monad is a "unit" function that wraps a value and produces the same value by way of a "bind" function and are sometimes referred to as "programmable semicolons" due to the fact that they represent chainable computations.

The simplest monad is the Identity monad. It simply wraps a value.

```js
let Identity = v => ({ bind: transform => transform(v) })
```

---

## Comonad

---

## Applicative Functor

---


## Morphism

---

## Setoid

---

## Semigroup

---

## Chain

---

## Foldable

---

## Traversable

---

## Comonad

---
