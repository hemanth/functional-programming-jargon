# Functional Programming Jargon

Functional programming (FP) provides a lot of advantages and its popularity has been increasing as a result.  However each programming paradigm comes with its own unique jargon and FP is no exception.  By providing a glossary with lots of examples we hope to make learning FP easier.

Examples are presented in JavaScript (ES2015). [Why JavaScript?](https://github.com/hemanth/functional-programming-jargon/wiki/Why-JavaScript%3F)

*This is a [WIP](https://github.com/hemanth/functional-programming-jargon/issues/20); please feel free to send a PR ;)*

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
* [Predicate](#predicate)
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

Partially applying a function means creating a new function by pre-filling some of the arguments to the original function.


```js
// Helper to create partially applied functions
// Takes a function and some arguments
const partial = (f, ...args) =>
    // returns a function that takes the rest of the arguments
    (...moreArgs) =>
        // and calls the original function with all of them
        f(...[...args, ...moreArgs]);

// Something to apply
const add3 = (a, b, c) => a + b + c;

// Partially applying `2` and `3` to `add3` gives you a one-argument function
const fivePlus = partial(add3, 2, 3); // (c) => 2 + 3 + c

fivePlus(4); // 9
```

You can also use `Function.prototype.bind` to partially apply a function in JS:

```js
const add1More = add3.bind(null, 2, 3); // (c) => 2 + 3 + c
```

Partial application helps create simpler functions from more complex ones by baking in data when you have it. [Curried](#currying) functions are automatically partially applied.

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

The act of putting two functions together to form a third function where the output of one function is the input of the other.

```js
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // "121"
```

## Purity

A function is pure if the return value is only determined by its
input values, and does not produce side effects.

```js
const greet = (name) => "Hi, " + name ;

greet("Brianne") // "Hi, Brianne"

```

As opposed to:

```js

const greeting;

const greet = () => greeting = "Hi, " + window.name;

greet(); // "Hi, Brianne"

```

## Side effects

A function or expression is said to have a side effect if apart from returning a value, it interacts with (reads from or writes to) external mutable state.

```js
const differentEveryTime = new Date();
```

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
const map = (fn) => (list) => list.map(fn);
const add = (a) => (b) => a + b;

// Then

// Not points-free - `numbers` is an explicit argument
const incrementAll = (numbers) => map(add(1))(numbers);

// Points-free - The list is an implicit argument
const incrementAll2 = map(add(1));
```

`incrementAll` identifies and uses the parameter `numbers`, so it is not points-free.  `incrementAll2` is written just by combining functions and values, making no mention of its arguments.  It __is__ points-free.

Points-free function definitions look just like normal assignments without `function` or `=>`.

## Predicate
A predicate is a function that returns true or false for a given value. A common use of a predicate is as the callback for array filter.

```js
const predicate = (a) => a > 2;

[1, 2, 3, 4].filter(predicate); // [3, 4]
```

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

An object that implements a `map` function which, while running over each value in the object to produce a new object, adheres to two rules:

```js
// preserves identity
object.map(x => x) === object
```

and

```js
// composable
object.map(x => f(g(x))) === object.map(g).map(f)
```

(`f`, `g` be arbitrary functions)

A common functor in JavaScript is `Array` since it abides to the two functor rules:

```js
[1, 2, 3].map(x => x); // = [1, 2, 3]
```

and

```js
const f = x => x + 1;
const g = x => x * 2;

[1, 2, 3].map(x => f(g(x))); // = [3, 5, 7]
[1, 2, 3].map(g).map(f);     // = [3, 5, 7]
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
const mult = (a, b) => a * b;

const liftedMult = lift(mult); // this function now works on functors like array

liftedMult([1, 2], [3]); // [3, 6]
lift((a, b) => a + b)([1, 2], [3, 4]); // [4, 5, 5, 6]
```

Lifting a one-argument function and applying it does the same thing as `map`.

```js
const increment = (x) => x + 1;

lift(increment)([2]); // [3]
[2].map(increment); // [3]
```


## Referential Transparency

An expression that can be replaced with its value without changing the
behavior of the program is said to be referentially transparent.

Say we have function greet:

```js
const greet = () => "Hello World!";
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referentially transparent.

##  Equational Reasoning

When an application is composed of expressions and devoid of side effects, truths about the system can be derived from the parts.

## Lambda

An anonymous function that can be treated like a value.

```js
function(a){
    return a + 1;
};

(a) => a + 1;
```
Lambdas are often passed as arguments to Higher-Order functions.

```js
[1, 2].map((a) => a + 1); // [2, 3]
```

You can assign a lambda to a variable.

```js
const add1 = (a) => a + 1;
```

## Lambda Calculus
A branch of mathematics that uses functions to create a [universal model of computation](https://en.wikipedia.org/wiki/Lambda_calculus).

## Lazy evaluation

Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

```js
const rand = function*() {
    while (1 < 2) {
        yield Math.random();
    }
}
```

```js
const randIter = rand();
randIter.next(); // Each execution gives a random value, expression is evaluated on need.
```

## Monoid

An object with a function that "combines" that object with another of the same type.

One simple monoid is the addition of numbers:

```js
1 + 1; // 2
```
In this case number is the object and `+` is the function.

An "identity" value must also exist that when combined with a value doesn't change it.

The identity value for addition is `0`.
```js
1 + 0; // 1
```

It's also required that the grouping of operations will not affect the result (associativity):

```js
1 + (2 + 3) === (1 + 2) + 3; // true
```

Array concatenation also forms a monoid:

```js
[1, 2].concat([3, 4]); // [1, 2, 3, 4]
```

The identity value is empty array `[]`

```js
[1, 2].concat([]); // [1, 2]
```

If identity and compose functions are provided, functions themselves form a monoid:

```js
const identity = (a) => a;
const compose = (f, g) => (x) => f(g(x));

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

This is useful if you have multiple applicative functors and you want to apply a function that takes multiple arguments to them.

```js
const arg1 = [1, 2];
const arg2 = [3, 4];

// function needs to be curried for this to work
const add = (x) => (y) => x + y;

const partiallyAppliedAdds = [add].ap(arg1); // [(y) => 1 + y, (y) => 2 + y]
```

This gives you an array of functions that you can call `ap` on to get the result:

```js
partiallyAppliedAdds.ap(arg2); // [3, 4, 5, 6]
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
const sum = (list) => list.reduce((acc, val) => acc + val, 0);
sum([1, 2, 3]) // 6
```

## Traversable

TODO

## Type Signatures

Often functions in JavaScript will include comments that indicate the types of their arguments and return values.

There's quite a bit of variance across the community but they often follow the following patterns:

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

### Further reading
* [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
* [Mostly Adaquate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) on Stack Overflow

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

__P.S:__ This repo is successful due to the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
