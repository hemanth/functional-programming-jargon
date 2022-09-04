
# Functions all the way down

This is a topic of much debate but a broadly applicable definition of functional programming would be a coding style where programs are constructed of pure functions.

> Functional programming - A programming style that focuses on constructing programs from [pure functions](#pure-function).

## Pure Function

A function is pure if what it returns is only determined by its input, and does not produce side effects. The function must always return the same result when given the same input.

Let's start with a counter-example:

```js
let name = 'Brianne'

const impureGreet = () => `Hi, ${name}`

impureGreet() // returns "Hi, Brianne"
```

> Pure Function - A function which returns the same result given the same input and which does not read from or write to external state.

`impureGreet`'s output is based on data stored outside of the function. In particular, `name` is defined using the `let` keyword, indicating that its value can be changed later in the program. If later `name` is set to "Rida" then `impureGreet`'s result depends on when it's called.

There's a couple things we can do to make `impureGreet` pure.

__Make `name` unchangable by changing `let` to `const`__

```js
const name = 'Brianne'

const greet = () => `Hi, ${name}`
```

> Immutable - Something that cannot be changed after being defined.

This change makes it so `greet()` will always return "Hi, Brianne" and no code outside of the function can make it do otherwise. When a variable cannot be altered it's said to be "immutable".

__Inline the value__

Another thing we can do is just inline the value so that `greet` is self-contained.

```js
const greet = () => 'Hi, Brianne'
```

Now it's clear that this function can only ever return one result. 

__Take an argument__

Finally, another thing you can do to make the function pure is to take the state value and make it an argument:

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

> _FP Protip:_ If you're not sure how to make a function pure, try taking the impure thing as an argument!

Doing this gives us back the flexibility of being able to use this function for Rida or any other name we like and still gives us the confidence of knowing that it will always behave consistently.

### Exercise
1. Make the following function pure using the techniques above: `const aMinuteFromNow = () => new Date(Date.now() + 60 * 1000)`. Hint: You may have to rename it.
2. Take a simple impure function you've written in the past and see if you can make it pure.


## Referential transparency

> Referential Transparency - An expression that can be replaced with its value without changing the behavior of the program is referentially transparent.

When we _inlined the value_ above we were relying on a special property of pure code, referential transparency. Since JS strings are immutable(you can't modify their contents as you can with arrays), and the variable is constant (defined with `const` keyword) anywhere you see the reference `name` you can replace it with its definition and the code will behave exactly the same.

This property applies not just to values but to calling pure functions themselves:

```js
const greet = () => 'Hi, Brianne'

greet() + '. Your order is ready!'
```

The reference to `greet` can be replaced with its definition.

```js
(() => 'Hi, Brianne')() + '. Your order is ready!'
```

Which can just be mechanically applied:

```js
('Hi, Brianne') + '. Your order is ready!'
```

And then we can do the concatenation ourselves as well:

```js
'Hi, Brianne. Your order is ready!'
```

With this example you can see that applying pure functions is just a matter of replacing the calls with their definitions. This is true when the functions have arguments as well.

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') + '. Your order is ready!'

// becomes
;((name) => `Hi, ${name}`)('Brianne') + '. Your order is ready!'
// becomes
;`Hi, ${'Brianne'}` + '. Your order is ready!'
// becomes
'Hi, Brianne. Your order is ready!'
```

> "Easy to reason about" - Common phrase uttered by FP enthusiasts meaning that code can be understood without worrying about side effects or implementation details complicating matters. 

It may seem like a small thing but referential transparency unlocks a lot of cool techniques for simplifying code which keeps it easy to wraph your head around.

### Exercise

Compute the result of the following code by hand by substitution:

```js
const you = { mood: 'happy', knowIt: true }
const isHappy = (x) => x.mood === 'happy'
const knowsIt = (x) => x.knowIt

const shouldClap = (person) => isHappy(person) && knowsIt(person) ? 'clap hands' : ''

shouldClap(you)
```


## Composition

Writing a single pure function is good and all but how do you create bigger programs? The answer, as simple as it sounds, is to compose functions.

function_that_does_one_thing + function_that_does_another_thing = function_that_does_both_things

In the above you may have noticed the `+` operator. Plus may not make a lot of sense but the important thing is that when you're working with numbers you have multiple operators to work with depending on what you want to do. With functions it's the same, there are a number of functional combinators that we can use to perform operations on functions. To get us started let's start with the analog to `+`, the compose function (A.K.A the "B" combinator)

```js
const compose = (g, f) => (x) => g(f(x))
```
That is, `compose` takes two functions and returns a function which calls the second function with it's argument and passes the result to the first function.

```js
const add10 = (x) => x + 10

const isGreaterThan20 = (x) => x > 20

compose(isGreaterThan20, add10)(12) // => true
```

> Unary function - A function which only takes one argument. A function with two arguments is called binary, three is ternary, and so on. The general property of how many arguments a function has is called its "arity"

An important constraint with this compose function is that each function passed to it must only take one argument. This may seem horribly limiting but there's a trick to make any function a one-argument function.

### Exercise

1. Create a variant of `compose` that calls its arguments left to right, you can call this function "flow" if you like.


## Curying

Curying is the process of taking a function that has more than one argument and changing it into a function that only takes one. The trick is that the return of that function is another function.

```js
// normal binary (two-argument) function
const addBinary = (x, y) => x + y

// curried
const add = (x) => (y) => x + y

// used with butt notation
add(10)(12) // => 22
```

What's interesting is that since calling the curried `add` with an argument returns a function it can be saved to a variable.

```js
const add10 = add(10)
```

> Point-Free Style - A style of programming that writes functions without explicitly defining their arguments. A.K.A Tacit Programming

You can see in this case we have created a function without an `=>` or function statement. This process of creating functions is called "Point-free Programming"

### Exercises
1. Define `isGreaterThan` as a binary function that returns a boolean
2. Curry `isGreaterThan` so that it takes one argument at a time
3. Define `isGreaterThan20` without an arrow or function statement

## Composing partially applied functions

> Partial application - The process of applying a part of a functions arguments leaving a function which takes the remaining. 

When defining `add10` above we "partially applied" `add` to create a new function. In that case we assigned it to a variable but we can also just use that function as an argument to another as with our original compose example:

```js
compose(isGreaterThan(20), add(10))(12) // => true
```

### Exercises
1. Curry `compose` and and rename it to `B` to match the B-combinator
2. Copy `add`, `isGreaterThan`, and `B` into a JS file called "lib". This will be the library we build together as you go through this book.
3. Experiment with using the `B` combinator in its curried form. Consider what it means to partially-apply it.

## Identity function
Another combinator that we'll be using in examples is the `identity` function, a.k.a I-Combinator. 

```js
const identity = (x) => x

const I = identity
```

Simply stated, it just returns it's argument without modification. This may seem like a pointless function but it can be useful as a placeholder and is important for describing some rules that FP concepts must follow.

Trivial usage:
```js
[1, 2].map(identity) // => [1, 2]
identity([1, 2]) // => [1, 2]
```

## A rose by another name...

A significant word that will come up again later is "morphism". Strictly speaking, a morphism is just a relationship between two things but in the context of functional programming we can simplify to say that morphisms are just pure functions. That is, a function represents a relationship between it's input (domain) and output (codomain). 


> Morphism - A relationship between two things. E.g. a pure function
