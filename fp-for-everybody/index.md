# Functional Programming for Everyone (FP4E)

<!-- RM(noparent,notop) -->

* [Why create this book?](#why-create-this-book)
* [Why JavaScript](#why-javascript)
* [Why TypeScript?](#why-typescript)
* [What's with the `=>`?](#whats-with-the-)
* [Where are the semi-colons?](#where-are-the-semi-colons)
* [Why did you describe this functional concept wrong?](#why-did-you-describe-this-functional-concept-wrong)


<!-- /RM -->

## Why create this book?

In the process of building and maintaining the [Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon) glossary we found that there were a lot of concepts that were hard to describe in isolation and a more directed learning experience would help. This book aims to guide people into a basic understanding of FP concepts with little prerequisite knowledge. That said, examples will be in JavaScript with a little TypeScript thrown in to describe type concepts. 

## Why JavaScript

* JavaScript is the most popular language in the world.
* It is possible to do a lot of functional programming in JavaScript.
* Functional JavaScript is a growing trend but there aren't many good resources for learning it.
* JavaScript is often people's first language so it needs simple explanations more than other languages.

## Why TypeScript?

* TypeScript is the most popular way of adding types to JavaScript
* Many functional concepts are hard to detail without some notation for describing types
* TypeScript is additive, in that you can use as much or as little of it as you like
* TypeScript is designed with the goal of making everything in JS typeable

## What's with the `=>`?

The examples often use recent versions of ECMAScript (the official name for JavaScript) to make the examples more concise. `=>` is a terse way to define an anonymous function.

```js
const add = a => a + 1

// is equivalent to

function add1 (a) {
  return a + 1
}
```


## Where are the semi-colons?

They're unnecessary! We're actually running [Standard Linter](https://github.com/feross/standard) which prevents any possible pitfalls with semi-colons so it's perfectly safe.

[Are Semicolons Necessary in JavaScript?](https://www.youtube.com/watch?v=gsfbh17Ax9I)

## Why did you describe this functional concept wrong?

The goal of this book is not to be perfectly correct in regards to category theory or to directly mimic the definitions within Haskell or other languages. Concepts will be described to get a general taste with copious examples aimed at practical use. We're sorry to say that if you would like precise and accurate descriptions of applicative functors then this book is not for you. If you want to know enough about monads to simplify some of your code, then you've come to the right place.

Where applicable, this document uses terms defined in the [Fantasy Land spec](https://github.com/fantasyland/fantasy-land)
