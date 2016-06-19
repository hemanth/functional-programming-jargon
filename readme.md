# Functional Programming Jargon

The goal of this document is to define jargon from functional programming in plain english with examples.

*This is a WIP; please feel free to send a PR ;)*

Where applicable, this document uses terms defined in the [Fantasy Land spec](https://github.com/fantasyland/fantasy-land)

<!-- RM(noparent,notop) -->

* [Arity](#arity)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Function Composition](#function-composition)
* [Purity](#purity)
* [Side effects](#side-effects)
* [Idempotent](#idempotent)
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
* [Union type](#union-type)
* [Product type](#product-type)
* [Option](#option)


<!-- /RM -->

## Arity

The number of arguments a function takes. From words like unary, binary, ternary, etc. This word has the distinction of being composed of two suffixes, "-ary" and "-ity." Addition, for example, takes two arguments, and so it is defined as a binary function or a function with an arity of two. Such a function may sometimes be called "dyadic" by people who prefer Greek roots to Latin. Likewise, a function that takes a variable number of arguments is called "variadic," whereas a binary function must be given two and only two arguments, currying and partial application notwithstanding (see below).

```js
const sum = (a, b) => a + b;

const arity = sum.length;
console.log(arity); // 2

// The arity of sum is 2
```

## Higher-Order Functions (HOF)

A function which takes a function as an argument and/or returns a function.

```js
const filter = (pred, xs) => {
    const result = [];
    for (let idx = 0; idx < xs.length; idx++) {
        if (pred(xs[idx])) {
            result.push(xs[idx]);
        }
    }
    return result;
};
```

```js
const is = (type) => (x) => Object(x) instanceof type;
```

```js
filter(is(Number), [0, '1', 2, null]); // [0, 2]
```

## Partial Application

The process of getting a function with lesser arity compared to the original
function by fixing the number of arguments is known as partial application.

```js
let sum = (a, b) => a + b;

// partially applying `a` to `40`
let partial = sum.bind(null, 40);

// Invoking it with `b`
partial(2); // 42
```

## Currying

The process of converting a function that takes multiple arguments into a function that takes them one at a time.

Each time the function is called it only accepts one argument and returns a function that takes one argument until all arguments are passed.

```js
const sum = (a, b) => a + b;

const curriedSum = (a) => (b) => a + b;

curriedSum(40)(2) // 42.

const add2 = curriedSum(2); // (b) => 2 + b

add2(10) // 12

```

## Function Composition

The act of putting two functions together to form a third function where the the output of one function is the input of the other.

```js
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // "121"
```

## Purity

A function is pure if the return value is only determined by its
input values, and does not produce side effects.

```js
let greet = (name) => "Hi, " + name ;

greet("Brianne") // "Hi, Brianne"

```

As opposed to:

```js

let greeting;

let greet = () => greeting = "Hi, " + window.name;

greet(); // "Hi, Brianne"

```

## Side effects

A function or expression is said to have a side effect if apart from returning a value, it modifies some state or has an observable interaction with external functions.

```js
console.log("IO is a side effect!");
```

## Idempotent

A function is idempotent if reapplying it to its result does not produce a different result.

```js
f(f(x)) = f(x)
```

```js
Math.abs(Math.abs(10))
```

```js
sort(sort(sort([2,1])))
```

## Point-Free Style

Writing functions where the definition does not explicitly identify the arguments used. This style usually requires [currying](#currying) or other [Higher-Order functions](#higher-order-functions-hof). A.K.A Tacit programming.

```js
// Given
let map = (fn) => (list) => list.map(fn);
let add = (a) => (b) => a + b;

// Then

// Not points-free - `numbers` is an explicit argument
let incrementAll = (numbers) => map(add(1))(numbers);

// Points-free - The list is an implicit argument
let incrementAll2 = map(add(1));
```

`incrementAll` identifies and uses the parameter `numbers`, so it is not points-free.  `incrementAll2` is written just by combining functions and values, making no mention of its arguments.  It __is__ points-free.

Points-free function definitions look just like normal assignments without `function` or `=>`.



## Contracts

TODO

## Guarded Functions

TODO

## Categories

Objects with associated functions that adhere to certain rules. E.g. [Monoid](#monoid)

## Value

Anything that can be assigned to a variable.

```js
5
Object.freeze({name: 'John', age: 30}) // The `freeze` function enforces immutability.
(a) => a
[1]
undefined
```

## Constant

A variable that cannot be reassigned once defined.

```js
const five = 5
const john = {name: 'John', age: 30}
```

Constants are [referentially transparent](#referential-transparency). That is, they can be replaced with the values that they represent without affecting the result.

With the above two constants the following expression will always return `true`.

```js
john.age + five === ({name: 'John', age: 30}).age + (5)
```

## Functor

An object with a `map` function that adheres to certain rules. `Map` runs a function on values in an object and returns a new object.

A common functor in javascript is `Array`

```js
[2, 3, 4].map((n) => n * 2); // [4, 6, 8]
```

If `func` is an object implementing a `map` function, and `f`, `g` be arbitrary functions, then `func` is said to be a functor if the map function adheres to the following rules:

```js
// identity
func.map((x) => x) === func
```

and

```js
// composition
func.map((x) => f(g(x))) === func.map(g).map(f)
```

We can now see that `Array` is a functor because it adheres to the functor rules.

```js
[1, 2, 3].map((x) => x); // = [1, 2, 3]
```

and

```js
let f = (x) => x + 1;
let g = (x) => x * 2;

[1, 2, 3].map((x) => f(g(x))); // = [3, 5, 7]
[1, 2, 3].map(g).map(f);     // = [3, 5, 7]
```

## Pointed Functor
A functor with an `of` function that puts _any_ single value into that functor.

Array Implementation:

```js
Array.prototype.of = (v) => [v];

[].of(1) // [1]
```

## Lift

Lift is like `map` except it can be applied to multiple functors.

Map is the same as a lift over a one-argument function:

```js
lift((n) => n * 2)([2, 3, 4]); // [4, 6, 8]
```

Unlike map lift can be used to combine values from multiple arrays:

```js
lift((a, b) => a * b)([1, 2], [3]); // [3, 6]
```

## Referential Transparency

An expression that can be replaced with its value without changing the
behavior of the program is said to be referentially transparent.

Say we have function greet:

```js
let greet = () => "Hello World!";
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referentially transparent.

##  Equational Reasoning

When an application is composed of expressions and devoid of side effects, truths about the system can be derived from the parts.

## Lazy evaluation

Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

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

## Monoid

A monoid is some data type and a two parameter function that "combines" two values of the type, where an identity value that does not affect the result of the function also exists.

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
1 + (2 + 3) === (1 + 2) + 3; // true
```

Array concatenation can also be said to be a monoid:

```js
[1, 2].concat([3, 4]); // [1, 2, 3, 4]
```

The identity value is empty array `[]`

```js
[1, 2].concat([]); // [1, 2]
```

If identity and compose functions are provided, functions themselves form a monoid:

```js
var identity = (a) => a;
var compose = (f, g) => (x) => f(g(x));

compose(foo, identity) ≍ compose(identity, foo) ≍ foo
```

## Monad

A monad is an object with [`of`](#pointed-functor) and `chain` functions. `chain` is like [`map`](#functor) except it un-nests the resulting nested object.

```js
['cat,dog', 'fish,bird'].chain((a) => a.split(',')) // ['cat', 'dog', 'fish', 'bird']

//Contrast to map
['cat,dog', 'fish,bird'].map((a) => a.split(',')) // [['cat', 'dog'], ['fish', 'bird']]
```

`of` is also known as `return` in other functional languages.
`chain` is also known as `flatmap` and `bind` in other languages.

## Comonad

An object that has `extract` and `extend` functions.

```js
const CoIdentity = (v) => ({
    val: v,
    extract() { return this.val },
    extend(f) { return CoIdentity(f(this)) }
})
```

Extract takes a value out of a functor.

```js
CoIdentity(1).extract() // 1
```

Extend runs a function on the comonad. The function should return the same type as the comonad.

```js
CoIdentity(1).extend((co) => co.extract() + 1) // CoIdentity(2)
```

## Applicative Functor

An applicative functor is an object with an `ap` function. `ap` applies a function in the object to a value in another object of the same type.

```js
[(a) => a + 1].ap([1]) // [2]
```

## Morphism

A transformation function.

## Isomorphism

A pair of transformations between 2 types of objects that is structural in nature and no data is lost.

For example, 2D coordinates could be stored as an array `[2,3]` or object `{x: 2, y: 3}`.

```js
// Providing functions to convert in both directions makes them isomorphic.
const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```



## Setoid

An object that has an `equals` function which can be used to compare other objects of the same type.

Make array a setoid:

```js
Array.prototype.equals = (arr) => {
    var len = this.length
    if (len != arr.length) {
        return false
    }
    for (var i = 0; i < len; i++) {
        if (this[i] !=== arr[i]) {
            return false
        }
    }
    return true
}

[1, 2].equals([1, 2]) // true
[1, 2].equals([0]) // false
```

## Semigroup

An object that has a `concat` function that combines it with another object of the same type.

```js
[1].concat([2]) // [1, 2]
```

## Foldable

An object that has a `reduce` function that can transform that object into some other type.

```js
let sum = (list) => list.reduce((acc, val) => acc + val, 0);
sum([1, 2, 3]) // 6
```

## Traversable

TODO

## Type Signatures

Often functions will include comments that indicate the types of their arguments and return types.

There's quite a bit of variance across the community but they often follow the following patterns:

```js
// functionName :: firstArgType -> secondArgType -> returnType

// add :: Number -> Number -> Number
let add = (x) => (y) => x + y

// increment :: Number -> Number
let increment = (x) => x + 1
```

If a function accepts another function as an argument it is wrapped in parenthesis.

```js
// call :: (a -> b) -> a -> b
let call = (f) => (x) => f(x)
```

The letters `a`, `b`, `c`, `d` are used to signify that the argument can be of any type. For this `map` it takes a function that transforms a value of some type `a` into another type `b`, an array of values of type `a`, and returns an array of values of type `b`.

```js
// map :: (a -> b) -> [a] -> [b]
let map = (f) => (list) => list.map(f)
```

## Union type
A union type is the combination of two types together into another one.

JS doesn't have static types but let's say we invent a type `NumOrString` which is a sum of `String` and `Number`.

The `+` operator in JS works on strings and numbers so we can use this new type to describe its inputs and outputs:

```js
// add :: (NumOrString, NumOrString) -> NumOrString
const add = (a, b) => a + b;

add(1, 2); // Returns number 3
add('Foo', 2); // Returns string "Foo2"
add('Foo', 'Bar'); // Returns string "FooBar"
```

Union types are also known as algebraic types, tagged unions, or sum types.

There's a [couple](https://github.com/paldepind/union-type) [libraries](https://github.com/puffnfresh/daggy) in JS which help with defining and using union types.

## Product type

A **product** type combines types together in a way you're probably more familiar with:

```js
// point :: (Number, Number) -> {x: Number, y: Number}
const point = (x, y) => ({x: x, y: y});
```
It's called a product because the total possible values of the data structure is the product of the different values.

See also [Set theory](https://en.wikipedia.org/wiki/Set_theory).

## Option
Option is a [union type](#union-type) with two cases often called `Some` and `None`.

Option is useful for composing functions that might not return a value.

```js
// Naive definition

const Some = (v) => ({
    val: v,
    map(f) {
        return Some(f(this.val));
    },
    chain(f) {
        return f(this.val);
    }
});

const None = () => ({
    map(f){
        return this;
    },
    chain(f){
        return this;
    }
});

// maybeProp :: (String, {a}) -> Option a
const maybeProp = (key, obj) => typeof obj[key] === 'undefined' ? None() : Some(obj[key]);
```
Use `chain` to sequence functions that return `Option`s
```js

// getItem :: Cart -> Option CartItem
const getItem = (cart) => maybeProp('item', cart);

// getPrice :: Item -> Option Number
const getPrice = (item) => maybeProp('price', item);

// getNestedPrice :: cart -> Option a
const getNestedPrice = (cart) => getItem(obj).chain(getPrice);

getNestedPrice({}); // None()
getNestedPrice({item: {foo: 1}}); // None()
getNestedPrice({item: {price: 9.99}}); // Some(9.99)
```

`Option` is also known as `Maybe`. `Some` is sometimes called `Just`. `None` is sometimes called `Nothing`.

---

__P.S:__ Without the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors) this repo would be meaningless!
