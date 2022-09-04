


`map :: Functor f => (a -> b) -> f a -> f b`

That is, given a functor named `f`, map is a function that takes a function from `a` to `b` and returns one that goes from `f` of `a` to `f` of `b`. An implementation of this for `Option` could be:

```js
// mapOption :: (a -> b) -> Option a -> Option b`
const mapOption = (f) => (optA) => isNone(optA) ? none : some(f(optA.value))
```
Notice that in the type signature we've replaced `f` with `Option`. For the option case we're choosing to do nothing when the option is `None`. This makes sense because all we've got in that case is a function `a -> b` and there's no way to get an `a` out of `None`.

This functor instance for `Option` is particularly useful because it allows us to compose functions that don't know about Options with operations that may fail. 

```js
const safeDivide = (dividend) => (divisor) => divisor === 0 ? none : some(dividend / divisor)

const factorial = (x) => x === 1 ? x : x * factorial(x - 1)

mapOption(factorial)(safeDivide(12)(4)) // => Some(6)
mapOption(factorial)(safeDivide(12)(0)) // => None
```

As we can see above the factorial function can be written for any number and made to operate with Options but just lifting the function up with `mapOption`.


# Application

```js
// apOption :: Option (a -> b) -> Option a -> Option b
const apOption = (f) => (optA) => isNone(optA) || isNone(f) ? none : some(f.value(optA.value))

apOption(mapOption(add))(some(1))(some(2)) // => some(3)
```