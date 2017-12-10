# Contributing

This project is a work in progress. Contributions are very welcome.

## Hard rules
There is a pre-commit hook that runs:  `npm run test && npm run roadmarks` for linting the readme and creating the TOC.

That said, we'd like to maintain some consistency across the document.

## Style guide
1. Every definition should include at least one JavaScript code example.
1. Definitions should be written using the simplest language possible. Every word should tell.
1. Target programmers that have no functional programming experience.
1. We value understandability more than accuracy. e.g. It's okay to describe a functor as a container.
1. Don't overuse jargon even if defined elsewhere in the document.
1. Link to terms defined in the document when you use them in a definition.
1. Avoid big walls of text

## Code conventions
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

* Be consistent with other examples
* Prefer arrow functions
* Parenthesis around function arguments
* Put output values in comments
* Keep it short and simple

This styleguide is a WIP too! Send PRs :)
