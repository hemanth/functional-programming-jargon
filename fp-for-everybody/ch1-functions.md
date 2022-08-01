
# 1: Functions all the way down

This is a topic of much debate but a broadly applicable definition of functional programming would be a coding style where programs are constructed of pure functions.

> Functional programming - A programming style that only uses [pure functions](#pure-function)

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

It may seem like a small thing but referential transparency unlocks a lot of cool techniques for simplifying code which keeping it easy to wraph your head around.

## Composition
## Identity function / combinator intro
## Morphism intro





