# Жаргон функционального программирования(ФП)

Функциональное программирование (ФП) дает множество преимуществ, и в результате его популярность постоянно растет. Однако каждая парадигма программирования имеет свой собственный уникальный жаргон, и ФП не является исключением. Приводя глоссарий, мы надеемся облегчить изучение FP.

Примеры представлены на языке JavaScript (ES2015). [Почему JavaScript?](https://github.com/hemanth/functional-programming-jargon/wiki/Why-JavaScript%3F)

Там, где это применимо, в данном документе используются термины, определенные в [Fantasy Land spec](https://github.com/fantasyland/fantasy-land).

__Translations__
* [Portuguese](https://github.com/alexmoreno/jargoes-programacao-funcional)
* [Spanish](https://github.com/idcmardelplata/functional-programming-jargon/tree/master)
* [Chinese](https://github.com/shfshanyue/fp-jargon-zh)
* [Bahasa Indonesia](https://github.com/wisn/jargon-pemrograman-fungsional)
* [Python World](https://github.com/jmesyou/functional-programming-jargon.py)
* [Scala World](https://github.com/ikhoon/functional-programming-jargon.scala)
* [Rust World](https://github.com/JasonShin/functional-programming-jargon.rs)
* [Korean](https://github.com/sphilee/functional-programming-jargon)
* [Haskell Turkish](https://github.com/mrtkp9993/functional-programming-jargon)
* [Russian / Русский](https://github.com/thinkjazz/functional-programming-jargon)

__Оглавление__
<!-- RM(noparent,notop) -->

* [Арность](#arity)
* [Функции высшего порядка (ФВП)](#higher-order-functions-hof)
* [Замыкание](#closure)
* [Частичное приминение](#partial-application)
* [Каррирование](#currying)
* [Автокаррирование](#auto-currying)
* [Композиция функций](#function-composition)
* [Продолжение](#continuation)
* [Чистота](#purity)
* [Побочные эффекты](#side-effects)
* [Идемпотент](#idempotent)
* [Стиль без точек](#point-free-style)
* [Предикат](#predicate)
* [Контракты](#contracts)
* [Категория](#category)
* [Значение](#value)
* [Постоянная](#constant)
* [Функтор](#functor)
* [Точечный функтор](#pointed-functor)
* [Лифт](#lift)
* [Референциальная прозрачность](#referential-transparency)
* [Уравнительные рассуждения](#equational-reasoning)
* [Лямбда](#lambda)
* [Лямбда-исчисление](#lambda-calculus)
* [Ленивая оценка](#lazy-evaluation)
* [Моноид](#monoid)
* [Монад](#monad)
* [Комонад](#comonad)
* [Аппликативный функтор](#applicative-functor)
* [Морфизм](#morphism)
  * [Эндоморфизм](#endomorphism)
  * [Изоморфизм](#isomorphism)
  * [Гомоморфизм](#homomorphism)
  * [Катаморфизм](#catamorphism)
  * [Анаморфизм](#anamorphism)
  * [Гиломорфизм](#hylomorphism)
  * [Параморфизм](#paramorphism)
  * [Апоморфизм](#apomorphism)
* [Сетоид](#setoid)
* [Полугруппа](#semigroup)
* [Складной](#foldable)
* [Линза](#lens)
* [Типы сигнатур](#type-signatures)
* [Алгебраический тип данных](#algebraic-data-type)
  * [Тип суммы](#sum-type)
  * [Тип продукта](#product-type)
* [Параметр](#option)
* [Функция](#function)
* [Частичная функция](#partial-function)
* [Библиотеки функционального программирования на JavaScript](#functional-programming-libraries-in-javascript)


<!-- /RM -->

## Арность 

Количество аргументов, которые принимает функция. От таких слов, как унарный, бинарный, тернарный и т.д. Это слово отличается тем, что состоит из двух суффиксов, "-ary" и "-ity". Сложение, например, принимает два аргумента, поэтому оно определяется как бинарная функция или функция с показателем числа два. Такую функцию иногда называют "диадической" те, кто предпочитает греческие корни латинским. Аналогично, функция, принимающая переменное число аргументов, называется "вариативной", тогда как бинарная функция должна иметь два и только два аргумента, несмотря на керринг и частичное применение (см. ниже).

```js
const sum = (a, b) => a + b

const arity = sum.length
console.log(arity) // 2

// The arity of sum is 2
```

## Функция высшего порядка (ФВП) / higher order functions (hof)
Функция высшего порядка (ФВП) это функция, которая принимает функцию в качестве аргумента и/или возвращает другую функцию.

```js
const filter = (predicate, xs) => xs.filter(predicate)
```

```js
const is = (type) => (x) => Object(x) instanceof type
```

```js
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Замыкание

Замыкание - это способ доступа к переменной за пределами её области видимости.
Формально, замыкание - это техника реализации лексического области именованного связывания. Это способ хранения функции с окружением.

Замыкание - это область видимости, которая захватывает локальные переменные функции для доступа к ним даже после того, как выполнение вышло за пределы блока, в котором они определены.
Т.е. они позволяют ссылаться на область видимости после завершения выполнения блока, в котором были объявлены переменные.


```js
const addTo = x => y => x + y;
var addToFive = addTo(5);
addToFive(3); //returns 8
```
Функция ```addTo()``` возвращает функцию (внутренне называемую ```add()```), давайте сохраним ее в переменной ```addToFive``` с помощью каррированого вызова с параметром 5.


В идеале, когда функция ```addTo``` завершает выполнение, ее область видимости с локальными переменными add, x, y не должна быть доступна. Но при вызове функции ```addToFive()``` она возвращает 8. Это означает, что состояние функции ```addTo``` сохраняется даже после завершения выполнения блока кода, иначе невозможно узнать, что ```addTo``` была вызвана как ```addTo(5)``` и значение x было установлено в 5.

Лексическая область видимости - это причина, по которой можно найти значения x и add - частных переменных родителя, который закончил выполнение. Это значение называется замыканием (Closure).

Стек вместе с лексической областью видимости функции хранится в виде ссылки на её родителя. Это предотвращает сборку мусора для закрытия и базовых переменных (поскольку существует по крайней мере одна живая ссылка на него).

Лямбда и замыкание: Лямбда - это, по сути, функция, которая определяется inline, а не стандартным методом объявления функций. Лямбды часто могут передаваться как объекты.

Замыкание - это функция, которая окружает свое состояние ссылками на поля, внешние по отношению к её телу. Замкнутое состояние сохраняется при всех вызовах замыкания.


__Further reading/Sources__
* [Lambda Vs Closure](http://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [JavaScript Closures highly voted discussion](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

## Partial Application \ Частичное применение

Частичное применение функции означает создание новой функции путем предварительного заполнения некоторых аргументов исходной функции.


```js
// Помощник для создания частично применяемых функций
// Принимает функцию и некоторые аргументы
const partial = (f, ...args) =>
  // возвращает функцию, которая принимает остальные аргументы
  (...moreArgs) =>
    // и вызывает исходную функцию со всеми из них
    f(...args, ...moreArgs)

// Что-то, что можно применить
const add3 = (a, b, c) => a + b + c

// Частичное применение `2` и `3` к `add3` дает вам одноаргументную функцию
const fivePlus = partial(add3, 2, 3) // (c) => 2 + 3 + c

fivePlus(4) // 9
```

Вы также можете использовать `Function.prototype.bind` для частичного применения функции в JS:

```js
const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
```

Частичное применение помогает создавать более простые функции из более сложных, запекая данные, когда они у вас есть. Функции [Каррирование](#каррирование) автоматически частично применяются.


## Каррирование

Каррирование — процесс преобразования функции, принимающей несколько аргументов, в функцию, принимающую их по одному.

При каждом вызове функции она принимает только один аргумент и возвращает функцию, принимающую один аргумент, пока все аргументы не будут переданы.

```js
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12

```

## Автокаррирование 
Автокаррирование — преобразование функции, принимающей несколько аргументов, в функцию, которая, получив меньше нужного количества аргументов, возвращает функцию, принимающую остальные. Когда функция получает нужное количество аргументов, она оценивается.

У lodash & Ramda есть функция `curry`, которая работает таким образом.

```js
const add = (x, y) => x + y

const curriedAdd = _.curry(add)
curriedAdd(1, 2) // 3
curriedAdd(1) // (y) => 1 + y
curriedAdd(1)(2) // 3
```

__Дальнейшее чтение__
* [Favoring Curry](http://fr.umio.us/favoring-curry/)
* [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

## Композиция функций

Композиция функций действие по объединению двух функций для формирования третьей функции, когда выход одной функции является входом другой.

```js
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // '121'
```

## Продолжение

В любой момент времени в программе часть кода, которая еще не выполнена, называется продолжением.

```js
const printAsString = (num) => console.log(`Given ${num}`)

const addOneAndContinue = (num, cc) => {
  const result = num + 1
  cc(result)
}

addOneAndContinue(2, printAsString) // 'Given 3'
```

Продолжения часто встречаются в асинхронном программировании, когда программе необходимо дождаться получения данных, прежде чем она сможет продолжить работу. Ответ часто передается остальной части программы, которая является продолжением, после его получения.

```js
const continueProgramWith = (data) => {
  // Continues program with data
}

readFileAsync('path/to/file', (err, response) => {
  if (err) {
    // handle error
    return
  }
  continueProgramWith(response)
})
```

## Чистота

Функция является чистой, если возвращаемое значение определяется только её входными значениями и не производит побочных эффектов.

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

В отличие от каждого из перечисленных ниже:

```js
window.name = 'Brianne'

const greet = () => `Hi, ${window.name}`

greet() // "Hi, Brianne"
```

Вывод приведенного выше примера основан на данных, хранящихся вне функции...

```js
let greeting

const greet = (name) => {
  greeting = `Hi, ${name}`
}

greet('Brianne')
greeting // "Hi, Brianne"
```

... а этот изменяет состояние вне функции.

##  Побочные эффекты / Side effects

Считается, что функция или выражение имеет побочный эффект, если помимо возврата значения она работает с внешним изменяемым состоянием (читает из него или записывает в него).

```js
const differentEveryTime = new Date()
```

```js
console.log('IO is a side effect!')
```

## Идемпотент / Idempotent 

Функция является идемпотентной, если ее повторное применение к результату не приводит к другому результату. 
Функция идемпотент - это функция, которую можно применять несколько раз без изменения результата, то есть f(f(x)) совпадает с f(x). Функция может быть чистой, идемпотентной, и той, и другой, или ни одной из них. Поскольку чистые функции не допускают побочных эффектов, чистые функции также тривиально «идемпотентны».

```
f(f(x)) ≍ f(x)
```

```js
Math.abs(Math.abs(10))
```

```js
sort(sort(sort([2, 1])))
```

## Стиль без точек

Написание функций, в определении которых нет явного указания на используемые аргументы. Этот стиль обычно требует [каррирование](#currying) или других [Функций высшего порядка](#higher-order-functions-hof). Также известен как негласное программирование (Tacit programming).

```js
// Дано
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

// Потом

// Не свободен от точек - `numbers` является явным аргументом
const incrementAll = (numbers) => map(add(1))(numbers)

// Без точек - Список является неявным аргументом
const incrementAll2 = map(add(1))
```

`incrementAll` определяет и использует параметр `numbers`, поэтому он не свободен от точек.  `incrementAll2` написан просто путем объединения функций и значений, без упоминания аргументов.  Оно __является_ свободным от точек.

Определения функций без точек выглядят как обычные присваивания без `function` или `=>`.

## Предикат
Предикат - это функция, которая возвращает true или false для заданного значения. Обычно предикат используется в качестве обратного вызова для фильтра массива.

```js
const predicate = (a) => a > 2

;[1, 2, 3, 4].filter(predicate) // [3, 4]
```

## Контракты

Контракт определяет обязательства и гарантии поведения функции или выражения во время выполнения. Он действует как набор правил, которые ожидаются от входа и выхода функции или выражения, и при нарушении контракта обычно сообщается об ошибках.

```js
// Define our contract : int -> boolean
const contract = (input) => {
  if (typeof input === 'number') return true
  throw new Error('Contract violated: expected int -> boolean')
}

const addOne = (num) => contract(num) && num + 1

addOne(2) // 3
addOne('some string') // Contract violated: expected int -> boolean
```

## Категория

Категория в теории категорий - это набор объектов и морфизмов между ними. В программировании, как правило, типы
выступают в качестве объектов, а функции - в качестве морфизмов.

Для того чтобы категория была действительной, необходимо соблюсти 3 правила:

1. Должен существовать морфизм тождества, который отображает объект на себя.
    Где `a` - объект в некоторой категории,
    должна существовать функция от `a -> a`.
2. Морфизмы должны быть составными.
    Где `a`, `b` и `c` - объекты в некоторой категории,
    и `f` - морфизм из `a -> b`, а `g` - морфизм из `b -> c`;
    `g(f(x))` должно быть эквивалентно `(g - f)(x)`.
3. Композиция должна быть ассоциативной
    `f - (g - h)` то же самое, что `(f - g) - h`.

Поскольку эти правила управляют композицией на очень абстрактном уровне, теория категорий отлично подходит для открытия новых способов композиции вещей.

__Дальнейшее чтение__

* [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

## Значение

Все, что может быть присвоено переменной.

```js
5
Object.freeze({name: 'John', age: 30}) // The `freeze` function enforces immutability.
;(a) => a
;[1]
undefined
```

## Константа

Переменная, которая не может быть переназначена после определения.

```js
const five = 5
const john = Object.freeze({name: 'John', age: 30})
```

Константы [ссылочно-прозрачны](#referential-transparency). То есть они могут быть заменены на значения, которые они представляют, без изменения результата.

С двумя вышеуказанными константами следующее выражение всегда будет возвращать `true`.

```js
john.age + five === ({name: 'John', age: 30}).age + (5)
```

## Функтор

Объект, реализующий функцию `map`, которая, перебирая каждое значение в объекте для получения нового объекта, придерживается двух правил:

__Сохраняет индивидуальность__
```
object.map(x => x) ≍ object
```

__Составляемая__

```
object.map(compose(f, g)) ≍ object.map(g).map(f)
```

(`f`, `g` являются произвольными функциями)

Распространенным функтором в JavaScript является `Array`, так как он подчиняется двум правилам функторов:

```js
;[1, 2, 3].map(x => x) // = [1, 2, 3]
```

и

```js
const f = x => x + 1
const g = x => x * 2

;[1, 2, 3].map(x => f(g(x))) // = [3, 5, 7]
;[1, 2, 3].map(g).map(f)     // = [3, 5, 7]
```

## Точечный функтор
Объект с функцией `of`, которая помещает в него _любое_ единичное значение.

ES2015 добавляет `Array.of`, делая массивы указательным функтором.

```js
Array.of(1) // [1]
```

## Подъём \ Lift

Подъём - это когда вы берете значение и помещаете его в объект типа [функтор](#pointed-functor). Если поднять функцию в [Аппликативный функтор](#applicative-functor), то можно заставить её работать со значениями, которые также находятся в этом функторе.

В некоторых реализациях есть функция `lift` или `liftA2`, чтобы облегчить выполнение функций на функторах.

```js
const liftA2 = (f) => (a, b) => a.map(f).ap(b) // обратите внимание, что это `ap`, а не `map`.

const mult = a => b => a * b

const liftedMult = liftA2(mult) // теперь эта функция работает с функторами типа массив

liftedMult([1, 2], [3]) // [3, 6]
liftA2(a => b => a + b)([1, 2], [3, 4]) // [4, 5, 5, 6]
```

Поднятие одноаргументной функции и ее применение делает то же самое, что и `map`.

```js
const increment = (x) => x + 1

lift(increment)([2]) // [3]
;[2].map(increment) // [3]
```


## Прозрачность ссылок

Выражение, которое может быть заменено своим значением без изменения
поведение программы, считается ссылочно прозрачным.

Допустим, у нас есть функция greet:

```js
const greet = () => 'Hello World!'
```

Любой вызов `greet()` может быть заменен на `Hello World!`, поэтому greet является
референциально прозрачно.

##  Equational Reasoning

Когда приложение состоит из выражений и лишено побочных эффектов, истины о системе могут быть получены из частей.

## Lambda

Анонимная функция, с которой можно обращаться как со значением.

```js
;(function (a) {
  return a + 1
})

;(a) => a + 1
```
Лямбды часто передаются в качестве аргументов функциям высшего порядка.

```js
;[1, 2].map((a) => a + 1) // [2, 3]
```

Вы можете присвоить лямбду переменной.

```js
const add1 = (a) => a + 1
```

## Лямбда-исчисление
Ветвь математики, использующая функции для создания [универсальной модели вычислений](https://en.wikipedia.org/wiki/Lambda_calculus).

## Ленивая оценка

Ленивая оценка - это механизм оценки "вызов по необходимости", который откладывает оценку выражения до тех пор, пока не понадобится его значение. В функциональных языках это позволяет использовать такие структуры, как бесконечные списки, которые обычно недоступны в императивных языках, где последовательность команд имеет большое значение.

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

## Моноид

Объект с функцией, которая "объединяет" этот объект с другим объектом того же типа (полугруппой), имеющим значение "тождества".

Одним из простых моноидов является сложение чисел:

```js
1 + 1 // 2
```
В этом случае число является объектом, а `+` - функцией.

Когда любое значение объединяется с "тождественным" значением, результатом должно быть исходное значение. Тождество также должно быть коммутативным.

Тождественным значением для сложения является `0`.

```js
1 + 0 // 1
0 + 1 // 1
1 + 0 === 0 + 1
```

Также требуется, чтобы группировка операций не влияла на результат (ассоциативность):

```js
1 + (2 + 3) === (1 + 2) + 3 // true
```

Конкатенация массивов также образует моноид:

```js
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

Значение идентификатора - пустой массив `[]`

```js
;[1, 2].concat([]) // [1, 2]
```

В качестве контрпримера, вычитание не образует моноид, потому что не существует коммутативного тождества:

```js
0 - 4 === 4 - 0 // false
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

### Homomorphism

A homomorphism is just a structure preserving map. In fact, a functor is just a homomorphism between categories as it preserves the original category's structure under the mapping.

```js
A.of(f).ap(A.of(x)) == A.of(f(x))

Either.of(_.toUpper).ap(Either.of("oreos")) == Either.of(_.toUpper("oreos"))
```

### Catamorphism

A `reduceRight` function that applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.

```js
const sum = xs => xs.reduceRight((acc, x) => acc + x, 0)

sum([1, 2, 3, 4, 5]) // 15
```

### Anamorphism

An `unfold` function. An `unfold` is the opposite of `fold` (`reduce`). It generates a list from a single value.

```js
const unfold = (f, seed) => {
  function go(f, seed, acc) {
    const res = f(seed);
    return res ? go(f, res[1], acc.concat([res[0]])) : acc;
  }
  return go(f, seed, [])
}
```

```js
const countDown = n => unfold((n) => {
  return n <= 0 ? undefined : [n, n - 1]
}, n)

countDown(5) // [5, 4, 3, 2, 1]
```

### Hylomorphism

The combination of anamorphism and catamorphism.

### Paramorphism

A function just like `reduceRight`. However, there's a difference:

In paramorphism, your reducer's arguments are the current value, the reduction of all previous values, and the list of values that formed that reduction.

```js
// Obviously not safe for lists containing `undefined`,
// but good enough to make the point.
const para = (reducer, accumulator, elements) => {
  if (elements.length === 0)
    return accumulator

  const head = elements[0]
  const tail = elements.slice(1)

  return reducer(head, tail, para(reducer, accumulator, tail))
}

const suffixes = list => para(
  (x, xs, suffxs) => [xs, ... suffxs],
  [],
  list
)

suffixes([1, 2, 3, 4, 5]) // [[2, 3, 4, 5], [3, 4, 5], [4, 5], [5], []]
```

The third parameter in the reducer (in the above example, `[x, ... xs]`) is kind of like having a history of what got you to your current acc value.

### Apomorphism

it's the opposite of paramorphism, just as anamorphism is the opposite of catamorphism. Whereas with paramorphism, you combine with access to the accumulator and what has been accumulated, apomorphism lets you `unfold` with the potential to return early.

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

An object that has a `reduce` function that applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.

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

## Function
A **function** `f :: A => B` is an expression - often called arrow or lambda expression - with **exactly one (immutable)** parameter of type `A` and **exactly one** return value of type `B`. That value depends entirely on the argument, making functions context-independant, or [referentially transparent](#referential-transparency). What is implied here is that a function must not produce any hidden [side effects](#side-effects) - a function is always [pure](#purity), by definition. These properties make functions pleasant to work with: they are entirely deterministic and therefore predictable. Functions enable working with code as data, abstracting over behaviour:

```js
// times2 :: Number -> Number
const times2 = n => n * 2

[1, 2, 3].map(times2) // [2, 4, 6]
```

## Partial function
A partial function is a [function](#function) which is not defined for all arguments - it might return an unexpected result or may never terminate. Partial functions add cognitive overhead, they are harder to reason about and can lead to runtime errors. Some examples:
```js
// example 1: sum of the list
// sum :: [Number] -> Number
const sum = arr => arr.reduce((a, b) => a + b)
sum([1, 2, 3]) // 6
sum([]) // TypeError: Reduce of empty array with no initial value

// example 2: get the first item in list
// first :: [A] -> A
const first = a => a[0]
first([42]) // 42
first([]) // undefined
//or even worse:
first([[42]])[0] // 42
first([])[0] // Uncaught TypeError: Cannot read property '0' of undefined

// example 3: repeat function N times
// times :: Number -> (Number -> Number) -> Number
const times = n => fn => n && (fn(n), times(n - 1)(fn))
times(3)(console.log)
// 3
// 2
// 1
times(-1)(console.log)
// RangeError: Maximum call stack size exceeded
```

### Dealing with partial functions
Partial functions are dangerous as they need to be treated with great caution. You might get an unexpected (wrong) result or run into runtime errors. Sometimes a partial function might not return at all. Being aware of and treating all these edge cases accordingly can become very tedious.
Fortunately a partial function can be converted to a regular (or total) one. We can provide default values or use guards to deal with inputs for which the (previously) partial function is undefined. Utilizing the [`Option`](#Option) type, we can yield either `Some(value)` or `None` where we would otherwise have behaved unexpectedly:
```js
// example 1: sum of the list
// we can provide default value so it will always return result
// sum :: [Number] -> Number
const sum = arr => arr.reduce((a, b) => a + b, 0)
sum([1, 2, 3]) // 6
sum([]) // 0

// example 2: get the first item in list
// change result to Option
// first :: [A] -> Option A
const first = a => a.length ? Some(a[0]) : None()
first([42]).map(a => console.log(a)) // 42
first([]).map(a => console.log(a)) // console.log won't execute at all
//our previous worst case
first([[42]]).map(a => console.log(a[0])) // 42
first([]).map(a => console.log(a[0])) // won't execte, so we won't have error here
// more of that, you will know by function return type (Option)
// that you should use `.map` method to access the data and you will never forget
// to check your input because such check become built-in into the function

// example 3: repeat function N times
// we should make function always terminate by changing conditions:
// times :: Number -> (Number -> Number) -> Number
const times = n => fn => n > 0 && (fn(n), times(n - 1)(fn))
times(3)(console.log)
// 3
// 2
// 1
times(-1)(console.log)
// won't execute anything
```
Making your partial functions total ones, these kinds of runtime errors can be prevented. Always returning a value will also make for code that is both easier to maintain as well as to reason about.

## Functional Programming Libraries in JavaScript

* [mori](https://github.com/swannodette/mori)
* [Immutable](https://github.com/facebook/immutable-js/)
* [Immer](https://github.com/mweststrate/immer)
* [Ramda](https://github.com/ramda/ramda)
* [ramda-adjunct](https://github.com/char0n/ramda-adjunct)
* [Folktale](http://folktale.origamitower.com/)
* [monet.js](https://cwmyers.github.io/monet.js/)
* [lodash](https://github.com/lodash/lodash)
* [Underscore.js](https://github.com/jashkenas/underscore)
* [Lazy.js](https://github.com/dtao/lazy.js)
* [maryamyriameliamurphies.js](https://github.com/sjsyrek/maryamyriameliamurphies.js)
* [Haskell in ES6](https://github.com/casualjavascript/haskell-in-es6)
* [Sanctuary](https://github.com/sanctuary-js/sanctuary)
* [Crocks](https://github.com/evilsoft/crocks)
* [Fluture](https://github.com/fluture-js/Fluture)
* [fp-ts](https://github.com/gcanti/fp-ts)

---

__P.S:__ This repo is successful due to the wonderful [contributions](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
