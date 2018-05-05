# Fonksiyonel Programlama Jargonu

Fonksiyonel Programlama (FP) bir çok avantaj sağlar ve bunun bir sonucu olarak gittikçe popülerleşmektedir. Bununla beraber, her programlama paradigması kendine özgü bir jargona sahiptir. Bir sözlük sağlayarak, kullanıcıların fonksiyonel programlamayı öğrenmelerini kolaylaştırmayı umuyoruz.

Örnekler JavaScript ile yazıldı. (ES2015). [Neden JavaScript?](https://github.com/hemanth/functional-programming-jargon/wiki/Why-JavaScript%3F)

## Arity

Bir fonksiyonun aldığı argüman sayısıdır. Bir fonksiyon aldığı argüman sayısına göre _unary_ (1 argüman), _binary_ (2 argüman), _ternary_ (3 argüman)... olarak adlandırılır. Eğer bir fonksiyon değişken sayıda argüman alıyorsa _variadic_ olarak adlandırılır.

```js
const sum = (a, b) => a + b

const arity = sum.length
console.log(arity) // 2

// sum fonksiyonunun arity'si 2dir.
```

## Higher-Order Functions (HOF)

Argüman olarak bir fonksiyon alan ya da bir fonksiyonu çıktı veren fonksiyonlardır.

```js
const filter = (predicate, xs) => xs.filter(predicate)
```

```js
const is = (type) => (x) => Object(x) instanceof type
```

```js
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Closure

_Kapanış_, bir fonksiyona bağlı değişkenleri koruyan bir kapsamdır.
[Kısmi uygulama](#partial-application) için önemlidir.


```js
const addTo = (x) => {
    return (y) => {
        return x + y
    }
}
```

`addTo` fonksiyonunu bir sayı ile çağıralım.

```js
var addToFive = addTo(5)
```

Bu durumda `x = 5` değeri `addToFive` fonksiyonunun kapanışında korunur. Şimdi `addToFive` fonksiyonunu bir `y` değeri ile çağırırsak:

```
addToFive(3) // => 8
```

__Daha Fazla Bilgi İçin__
* [Lambda Vs Closure](http://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [How do JavaScript Closures Work?](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)


## Partial Application

_Kısmi uygulama_, bir fonksiyonun bazı argümanlarını önceden doldurarak yeni bir fonksiyon oluşturmaktır.

```js
// Orjinal fonksiyonumuz
const add3 = (a, b, c) => a + b + c

//`2` ve `3` argümanlarını `add3` fonksiyonumuza vererek `fivePlus` fonksiyonumuzu oluşturuyoruz
const fivePlus = partial(add3, 2, 3) // (c) => 2 + 3 + c

fivePlus(4) // 9
```

Kısmi uygulama için `Function.prototype.bind` de kullanılabilir:

```js
const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
```

Kısmi uygulama, kompleks fonksiyonlardan daha basit fonksiyonlar oluşturmaya yardım eder. [Curried](#currying) fonksiyonlar otomatik olarak kısmi uygulanmış fonksiyonlardır.

## Currying

Birden çok parametre alan bir fonksiyonu, her defasında sadece bir parametre alan bir fonksiyona dönüştürmektir.

Fonksiyon her çağrıldığında sadece bir argüman kabul eder ve tüm argümanlar verilene kadar sadece bir argüman alan bir fonksiyon döndürür.

```js
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12

```

## Function Composition

İki farklı fonksiyonu bir araya getirerek, bir fonksiyonun çıktısı diğer fonksiyonun girdisi olan üçüncü bir fonksiyon oluşturmaktır.
```js
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // '121'
```

## Purity

Bir fonksiyonun çıktısı sadece girdi veya girdilerine bağlı ve fonksiyon yan etki oluşturmuyor ise, fonksiyon _saftır_ denir.

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

Saf olmayan fonksiyona bir örnek:

```js
window.name = 'Brianne'

const greet = () => `Hi, ${window.name}`

greet() // "Hi, Brianne"
```

Yukarıdaki  fonksiyonun çıktısı fonksiyonun dışarısında tanımlı bir değişkene bağlıdır.
```js
let greeting

const greet = (name) => {
  greeting = `Hi, ${name}`
}

greet('Brianne')
greeting // "Hi, Brianne"
```
Bu fonksiyon ise, fonksiyonun dışarısında tanımlanan bir değişkeni değiştirmektedir (yani saf değildir).

## Side effects

Bir fonksiyon veya ifade, dışarısındaki bir durum ile etkileşime geçiyor ise (okuma veya yazma), _yan etki_ ye sahiptir denir.

```js
const differentEveryTime = new Date()
```

```js
console.log('IO is a side effect!')
```

## Idempotent

Bir fonksiyon, sonucuna tekrar uygulandığında sonuç değişmiyorsa _idempotent_ olarak adlandırılır.

```
f(f(x)) ≍ f(x)
```

```js
Math.abs(Math.abs(10))
```

```js
sort(sort(sort([2, 1])))
```

## Point-Free Style

Argümanların açıkca tanımlanmadığı fonksiyonlar yazmaktır. _Tacit programming_ olarak da bilinir.

```js
// map ve add fonksiyonları verilsin
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

// incrementAll fonksiyonunu tanımlayalım

// Point-free değildir - `numbers` argümanı belirtilmiştir
const incrementAll = (numbers) => map(add(1))(numbers)

// Point-free - Fonksiyonun aldığı argüman açıkca belirtilmemiştir
const incrementAll2 = map(add(1))
```

`incrementAll` fonksiyonunun `numbers` argümanını aldığı belirtilmiştir, bu nedenle point-free değildir.  `incrementAll2` fonksiyonu ise, fonksiyon ve değerlerin bir bileşimidir ve argüman bilgisi belirtilmemiştir.  Yani _point-free_ dir.

## Predicate
Verilen bir değer için doğru veya yanlış değerini dönen fonksiyonlardır. Genellikle _filter_ ile beraber kullanılırlar.

```js
const predicate = (a) => a > 2

;[1, 2, 3, 4].filter(predicate) // [3, 4]
```

## Category

Kategory teorisinde bir _kategori_, matematiksel yapılar ve bunlar arasında tanımlı morfizmlerden oluşur. Programlamada ise, tipler matematiksel yapılar, fonksiyonlar ise morfizmlerdir.

Bir kategori aşağıdaki üç koşulu sağlar:

1. Bir yapıyı kendisine eşleyen bir birim morfizm vardır. Yani `a` herhangi bir kategori içinde bir yapı ise, `a -> a` şeklinde tanımlı bir fonksiyon vardır.
2. `a`, `b` ve `c` herhangi bir kategori içindeki yapılar ve `f : a -> b` ve `g : b -> c` ise `h : a -> c`, `h(x)=(g • f)(x)=g(f(x))` vardır.
3. `f • (g • h)` ve `(f • g) • h` ifadeleri aynıdır.

__Daha Fazla Kaynak__

* [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

## Value

Bir değişkene atanabilen herşeydir.

```js
5
Object.freeze({name: 'John', age: 30}) // The `freeze` function enforces immutability.
;(a) => a
;[1]
undefined
```

## Constant

Bir kere tanımlandıktan sonra yeniden atanamayan değişkenlerdir.

```js
const five = 5
const john = Object.freeze({name: 'John', age: 30})
```

## Functor

`map` fonksiyonunu implemente eden bir nesnedir ve aşağıdaki iki özelliği sağlar:

__Identity__
```
object.map(x => x) ≍ object
```

__Composable__

```
object.map(compose(f, g)) ≍ object.map(g).map(f)
```

## Referential Transparency

Bir ifade değeri ile yer değiştirildiğinde programın davranışı değişmiyor ise, ifade _referentially transparent_ olarak adlandırılır.

```js
const greet = () => 'Hello World!'
```

Any invocation of `greet()` can be replaced with `Hello World!` hence greet is
referentially transparent.

## Lambda

Anonim (isimsiz) fonksiyonlardır.

```js
;(function (a) {
  return a + 1
})

;(a) => a + 1
```
Çoğunlukla yüksek mertebeden fonksiyonlar ile birlikte kullanılırlar.

```js
;[1, 2].map((a) => a + 1) // [2, 3]
```

## Lazy evaluation

Lazy evaluation is a call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional languages, this allows for structures like infinite lists, which would not normally be available in an imperative language where the sequencing of commands is significant.

```js
const rand = function*() {
  while (1 < 2) {
    yield Math.random()
  }
}
```

```js
const randIter = rand()
randIter.next() // Each execution gives a random value, expression is evaluated on need.
```

## Monoid

An object with a function that "combines" that object with another of the same type.

One simple monoid is the addition of numbers:

```js
1 + 1 // 2
```
In this case number is the object and `+` is the function.

An "identity" value must also exist that when combined with a value doesn't change it.

The identity value for addition is `0`.
```js
1 + 0 // 1
```

It's also required that the grouping of operations will not affect the result (associativity):

```js
1 + (2 + 3) === (1 + 2) + 3 // true
```

Array concatenation also forms a monoid:

```js
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

The identity value is empty array `[]`

```js
;[1, 2].concat([]) // [1, 2]
```

If identity and compose functions are provided, functions themselves form a monoid:

```js
const identity = (a) => a
const compose = (f, g) => (x) => f(g(x))
```
`foo` is any function that takes one argument.
```
compose(foo, identity) ≍ compose(identity, foo) ≍ foo
```

## Monad

A monad is an object with [`of`](#pointed-functor) and `chain` functions. `chain` is like [`map`](#functor) except it un-nests the resulting nested object.

```js
// Implementation
Array.prototype.chain = function (f) {
  return this.reduce((acc, it) => acc.concat(f(it)), [])
}

// Usage
Array.of('cat,dog', 'fish,bird').chain((a) => a.split(',')) // ['cat', 'dog', 'fish', 'bird']

// Contrast to map
Array.of('cat,dog', 'fish,bird').map((a) => a.split(',')) // [['cat', 'dog'], ['fish', 'bird']]
```

`of` is also known as `return` in other functional languages.
`chain` is also known as `flatmap` and `bind` in other languages.

## Comonad

An object that has `extract` and `extend` functions.

```js
const CoIdentity = (v) => ({
  val: v,
  extract () {
    return this.val
  },
  extend (f) {
    return CoIdentity(f(this))
  }
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
// Implementation
Array.prototype.ap = function (xs) {
  return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
}

// Example usage
;[(a) => a + 1].ap([1]) // [2]
```

This is useful if you have two objects and you want to apply a binary function to their contents.

```js
// Arrays that you want to combine
const arg1 = [1, 3]
const arg2 = [4, 5]

// combining function - must be curried for this to work
const add = (x) => (y) => x + y

const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]
```

This gives you an array of functions that you can call `ap` on to get the result:

```js
partiallyAppliedAdds.ap(arg2) // [5, 6, 7, 8]
```

## Morphism

A transformation function.

### Endomorphism

A function where the input type is the same as the output.

```js
// uppercase :: String -> String
const uppercase = (str) => str.toUpperCase()

// decrement :: Number -> Number
const decrement = (x) => x - 1
```

### Isomorphism

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
Array.prototype.equals = function (arr) {
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

;[1, 2].equals([1, 2]) // true
;[1, 2].equals([0]) // false
```

## Semigroup

An object that has a `concat` function that combines it with another object of the same type.

```js
;[1].concat([2]) // [1, 2]
```

## Foldable

An object that has a `reduce` function that can transform that object into some other type.

```js
const sum = (list) => list.reduce((acc, val) => acc + val, 0)
sum([1, 2, 3]) // 6
```

## Lens ##
A lens is a structure (often an object or function) that pairs a getter and a non-mutating setter for some other data
structure.

```js
// Using [Ramda's lens](http://ramdajs.com/docs/#lens)
const nameLens = R.lens(
  // getter for name property on an object
  (obj) => obj.name,
  // setter for name property
  (val, obj) => Object.assign({}, obj, {name: val})
)
```

Having the pair of get and set for a given data structure enables a few key features.

```js
const person = {name: 'Gertrude Blanch'}

// invoke the getter
R.view(nameLens, person) // 'Gertrude Blanch'

// invoke the setter
R.set(nameLens, 'Shafi Goldwasser', person) // {name: 'Shafi Goldwasser'}

// run a function on the value in the structure
R.over(nameLens, uppercase, person) // {name: 'GERTRUDE BLANCH'}
```

Lenses are also composable. This allows easy immutable updates to deeply nested data.

```js
// This lens focuses on the first item in a non-empty array
const firstLens = R.lens(
  // get first item in array
  xs => xs[0],
  // non-mutating setter for first item in array
  (val, [__, ...xs]) => [val, ...xs]
)

const people = [{name: 'Gertrude Blanch'}, {name: 'Shafi Goldwasser'}]

// Despite what you may assume, lenses compose left-to-right.
R.over(compose(firstLens, nameLens), uppercase, people) // [{'name': 'GERTRUDE BLANCH'}, {'name': 'Shafi Goldwasser'}]
```

Other implementations:
* [partial.lenses](https://github.com/calmm-js/partial.lenses) - Tasty syntax sugar and a lot of powerful features
* [nanoscope](http://www.kovach.me/nanoscope/) - Fluent-interface

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

__Further reading__
* [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
* [Mostly Adequate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) on Stack Overflow

## Algebraic data type
A composite type made from putting other types together. Two common classes of algebraic types are [sum](#sum-type) and [product](#product-type).

### Sum type
A Sum type is the combination of two types together into another one. It is called sum because the number of possible values in the result type is the sum of the input types.

JavaScript doesn't have types like this but we can use `Set`s to pretend:
```js
// imagine that rather than sets here we have types that can only have these values
const bools = new Set([true, false])
const halfTrue = new Set(['half-true'])

// The weakLogic type contains the sum of the values from bools and halfTrue
const weakLogicValues = new Set([...bools, ...halfTrue])
```

Sum types are sometimes called union types, discriminated unions, or tagged unions.

There's a [couple](https://github.com/paldepind/union-type) [libraries](https://github.com/puffnfresh/daggy) in JS which help with defining and using union types.

Flow includes [union types](https://flow.org/en/docs/types/unions/) and TypeScript has [Enums](https://www.typescriptlang.org/docs/handbook/enums.html) to serve the same role.

### Product type

A **product** type combines types together in a way you're probably more familiar with:

```js
// point :: (Number, Number) -> {x: Number, y: Number}
const point = (x, y) => ({ x, y })
```
It's called a product because the total possible values of the data structure is the product of the different values. Many languages have a tuple type which is the simplest formulation of a product type.

See also [Set theory](https://en.wikipedia.org/wiki/Set_theory).

## Option
Option is a [sum type](#sum-type) with two cases often called `Some` and `None`.

Option is useful for composing functions that might not return a value.

```js
// Naive definition

const Some = (v) => ({
  val: v,
  map (f) {
    return Some(f(this.val))
  },
  chain (f) {
    return f(this.val)
  }
})

const None = () => ({
  map (f) {
    return this
  },
  chain (f) {
    return this
  }
})

// maybeProp :: (String, {a}) -> Option a
const maybeProp = (key, obj) => typeof obj[key] === 'undefined' ? None() : Some(obj[key])
```
Use `chain` to sequence functions that return `Option`s
```js

// getItem :: Cart -> Option CartItem
const getItem = (cart) => maybeProp('item', cart)

// getPrice :: Item -> Option Number
const getPrice = (item) => maybeProp('price', item)

// getNestedPrice :: cart -> Option a
const getNestedPrice = (cart) => getItem(cart).chain(getPrice)

getNestedPrice({}) // None()
getNestedPrice({item: {foo: 1}}) // None()
getNestedPrice({item: {price: 9.99}}) // Some(9.99)
```

`Option` is also known as `Maybe`. `Some` is sometimes called `Just`. `None` is sometimes called `Nothing`.

---

__P.S:__ This repo is successful due to the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
