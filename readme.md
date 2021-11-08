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

##  Уравнительные рассуждения

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

## Монада

Монада - это объект с функциями [`of`](#pointed-functor) и `chain`. `chain` подобна [`map`](#functor), за исключением того, что она разворачивает результирующий вложенный объект.

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

`of` также известно как `return` в других функциональных языках.
`chain` также известен как `flatmap` и `bind` в других языках.

## Комонада

Объект, имеющий функции `extract` и `extend`.

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

Extract извлекает значение из функтора.

```js
CoIdentity(1).extract() // 1
```

Extend запускает функцию на комонаде. Функция должна возвращать тот же тип, что и комонада.

```js
CoIdentity(1).extend((co) => co.extract() + 1) // CoIdentity(2)
```

## Аппликативный функтор

Аппликативный вектор - это объект с функцией `ap`. Функция `ap` применяет функцию в объекте к значению в другом объекте того же типа.

```js
// Implementation
Array.prototype.ap = function (xs) {
  return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
}

// Example usage
;[(a) => a + 1].ap([1]) // [2]
```

Это полезно, если у вас есть два объекта и вы хотите применить бинарную функцию к их содержимому.

```js
// Массивы, которые вы хотите объединить
const arg1 = [1, 3]
const arg2 = [4, 5]

// объединяющая функция - для ее работы необходимо, чтобы был curried
const add = (x) => (y) => x + y

const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]
```

Это дает вам массив функций, которые вы можете вызвать `ap` для получения результата:

```js
partiallyAppliedAdds.ap(arg2) // [5, 6, 7, 8]
```

## Морфизм

Функция преобразования.

### Эндоморфизм

Функция, в которой тип входа совпадает с типом выхода.

```js
// uppercase :: String -> String
const uppercase = (str) => str.toUpperCase()

// decrement :: Number -> Number
const decrement = (x) => x - 1
```

### Изоморфизм

Пара преобразований между двумя типами объектов, которые носят структурный характер и при этом данные не теряются.

Например, двумерные координаты можно хранить как массив `[2,3]` или объект `{x: 2, y: 3}`.

```js
// Предоставление функций для преобразования в обоих направлениях делает их изоморфными.

const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```

### Гомоморфизм

Гомоморфизм - это просто карта, сохраняющая структуру. На самом деле функтор - это просто гомоморфизм между категориями, поскольку он сохраняет структуру исходной категории при отображении.

```js
A.of(f).ap(A.of(x)) == A.of(f(x))

Either.of(_.toUpper).ap(Either.of("oreos")) == Either.of(_.toUpper("oreos"))
```

### Катаморфизм

Функция `reduceRight`, которая применяет функцию к аккумулятору и каждому значению массива (справа налево), чтобы уменьшить его до одного значения.

```js
const sum = xs => xs.reduceRight((acc, x) => acc + x, 0)

sum([1, 2, 3, 4, 5]) // 15
```

### Анаморфизм

Функция `unfold`. Функция `unfold` является противоположностью `fold` (`reduce`). Она формирует список из одного значения.

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

### Гиломорфизм

Сочетание анаморфизма и катаморфизма.

### Параморфизм

Функция, подобная `reduceRight`. Однако есть разница:

При параморфизме аргументами вашего reducer'а являются текущее значение, сокращение всех предыдущих значений и список значений, которые образовали это сокращение.

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

Третий параметр в редукторе (в примере выше `[x, ... xs]`) - это своего рода история того, что привело вас к текущему значению acc.

### Апоморфизм

это противоположность параморфизму, так же как анаморфизм противоположен катаморфизму. В то время как при параморфизме вы комбинируете с доступом к аккумулятору и тому, что было накоплено, апоморфизм позволяет вам `unfold` с потенциальным возвратом раньше времени.

## Сетоид \ Setoid 

Объект, имеющий функцию `equals`, которая может быть использована для сравнения других объектов одного типа.

Сделайте массив сетоидом:

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

## Полугруппа

Объект, имеющий функцию `concat`, которая объединяет его с другим объектом того же типа.

```js
;[1].concat([2]) // [1, 2]
```

## Складываемый

Объект, имеющий функцию `reduce`, которая применяет функцию к аккумулятору и каждому элементу массива (слева направо), чтобы уменьшить их до одного значения.

```js
const sum = (list) => list.reduce((acc, val) => acc + val, 0)
sum([1, 2, 3]) // 6
```

## Линза ##
Линза - это структура (часто объект или функция), которая сопрягает геттер и не изменяющийся сеттер для некоторой другой структуры данных.
структура.

```js
// Using [Ramda's lens](http://ramdajs.com/docs/#lens)
const nameLens = R.lens(
  // getter for name property on an object
  (obj) => obj.name,
  // setter for name property
  (val, obj) => Object.assign({}, obj, {name: val})
)
```

Наличие пары get и set для данной структуры данных позволяет реализовать несколько ключевых возможностей.

```js
const person = {name: 'Gertrude Blanch'}

// вызываем геттер
R.view(nameLens, person) // 'Gertrude Blanch'

// вызываем сеттер
R.set(nameLens, 'Shafi Goldwasser', person) // {name: 'Shafi Goldwasser'}

// запустить функцию на значении в структуре
R.over(nameLens, uppercase, person) // {name: 'GERTRUDE BLANCH'}
```

Линзы также являются составными. Это позволяет легко выполнять неизменяемые обновления глубоко вложенных данных.

```js
// Эта линза фокусируется на первом элементе в непустом массиве
const firstLens = R.lens(
  // get first item in array
  xs => xs[0],
  // не мутирующий сеттер для первого элемента в массиве
  (val, [__, ...xs]) => [val, ...xs]
)

const people = [{name: 'Gertrude Blanch'}, {name: 'Shafi Goldwasser'}]

// Despite what you may assume, lenses compose left-to-right.
R.over(compose(firstLens, nameLens), uppercase, people) // [{'name': 'GERTRUDE BLANCH'}, {'name': 'Shafi Goldwasser'}]
```

Другие реализации:
* [partial.lenses](https://github.com/calmm-js/partial.lenses) - Tasty syntax sugar and a lot of powerful features
* [nanoscope](http://www.kovach.me/nanoscope/) - Fluent-interface

## Подписи типов

Часто функции в JavaScript содержат комментарии, указывающие на типы их аргументов и возвращаемых значений.

В сообществе существует довольно много различий, но часто они следуют следующим шаблонам:

```js
// functionName :: firstArgType -> secondArgType -> returnType

// add :: Number -> Number -> Number
const add = (x) => (y) => x + y

// increment :: Number -> Number
const increment = (x) => x + 1
```

Если функция принимает в качестве аргумента другую функцию, она заключается в круглые скобки.

```js
// call :: (a -> b) -> a -> b
const call = (f) => (x) => f(x)
```

Буквы `a`, `b`, `c`, `d` используются для обозначения того, что аргумент может быть любого типа. Следующая версия `map` принимает функцию, которая преобразует значение некоторого типа `a` в другой тип `b`, массив значений типа `a` и возвращает массив значений типа `b`.

```js
// map :: (a -> b) -> [a] -> [b]
const map = (f) => (list) => list.map(f)
```

__Дополнительные материалы__
* [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
* [Mostly Adequate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) on Stack Overflow

## Алгебраический тип данных
Составной тип, полученный в результате объединения других типов. Двумя распространенными классами алгебраических типов являются [sum](#sum-type) и [product](#product-type).

### Суммарный тип
Тип Sum - это объединение двух типов в один. Он называется sum, потому что количество возможных значений в типе результата равно сумме входных типов.

В JavaScript нет подобных типов, но мы можем использовать `Set`, чтобы сделать вид:

```js
// imagine that rather than sets here we have types that can only have these values
const bools = new Set([true, false])
const halfTrue = new Set(['half-true'])

// The weakLogic type contains the sum of the values from bools and halfTrue
const weakLogicValues = new Set([...bools, ...halfTrue])
```

Суммовые типы иногда называют союзными типами, дискриминированными союзами или тегированными союзами.

В JS есть [пара](https://github.com/paldepind/union-type) [библиотек](https://github.com/puffnfresh/daggy), которые помогают в определении и использовании типов объединений.

Flow включает [union types](https://flow.org/en/docs/types/unions/), а TypeScript имеет [Enums](https://www.typescriptlang.org/docs/handbook/enums.html) для выполнения той же роли.

### Продукционный тип

Тип **продукт** объединяет типы в единое целое способом, с которым вы, вероятно, более знакомы:

```js
// point :: (Number, Number) -> {x: Number, y: Number}
const point = (x, y) => ({ x, y })
```
Он называется продукционным, потому что общее количество возможных значений структуры данных является произведением различных значений. Многие языки имеют тип кортеж, который является простейшей формулировкой продукционного типа.

См. также [Теория множеств](https://en.wikipedia.org/wiki/Set_theory).

## Опция
Option - это [sum type](#sum-type) с двумя случаями, часто называемыми `Some` и `None`.

Опция полезна для составления функций, которые могут не возвращать значение.

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
Используйте `chain` для последовательности функций, которые возвращают `Option`s.
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

Вариант `Option` также известен как `Maybe`. `Some` иногда называют `Just`. `None` иногда называют `Nothing`.

## Функция
A **function** `f :: A => B` это выражение - часто называемое стрелкой или лямбда-выражением - с **точно одним (неизменяемым)** параметром типа `A` и **точно одним** возвращаемым значением типа `B`. Это значение полностью зависит от аргумента, что делает функции контекстно-независимыми, или [ссылочно-прозрачными] (#referential-transparency). Здесь подразумевается, что функция не должна производить никаких скрытых [побочных эффектов](#side-effects) - функция всегда [чиста](#purity), по определению. Эти свойства делают функции приятными для работы: они полностью детерминированы и поэтому предсказуемы. Функции позволяют работать с кодом как с данными, абстрагируясь от поведения:

```js
// times2 :: Number -> Number
const times2 = n => n * 2

[1, 2, 3].map(times2) // [2, 4, 6]
```

## Частичная функция
Частичная функция - это [функция](#function), которая определена не для всех аргументов - она может вернуть неожиданный результат или никогда не завершиться. Частичные функции увеличивают когнитивную нагрузку, о них сложнее рассуждать и они могут привести к ошибкам во время выполнения. Некоторые примеры:
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

### Работа с частичными функциями
Частичные функции опасны, поскольку к ним нужно относиться с большой осторожностью. Вы можете получить неожиданный (неправильный) результат или столкнуться с ошибками во время выполнения. Иногда частичная функция может вообще не вернуться. Знание и соответствующая обработка всех этих крайних случаев может стать очень утомительным занятием.
К счастью, частичная функция может быть преобразована в обычную (или полную). Мы можем предоставить значения по умолчанию или использовать защитные функции для работы со входами, для которых (ранее) частичная функция не определена. Используя тип [`Option`](#Option), мы можем выдать либо `Some(value)`, либо `None` там, где в противном случае мы бы повели себя неожиданно:

```js
// пример 1: сумма списка
// мы можем предоставить значение по умолчанию, чтобы он всегда возвращал результат
// sum :: [Number] -> Number
const sum = arr => arr.reduce((a, b) => a + b, 0)
sum([1, 2, 3]) // 6
sum([]) // 0

// пример 2: получить первый элемент в списке
// изменить результат на Option
// first :: [A] -> Option A
const first = a => a.length ? Some(a[0]) : None()
first([42]).map(a => console.log(a)) // 42
first([]).map(a => console.log(a)) // console.log не будет выполняться вообще
//наш предыдущий наихудший случай
first([[42]]).map(a => console.log(a[0])) // 42
first([]).map(a => console.log(a[0])) // не будет экзекуции, поэтому здесь у нас не будет ошибки
// более того, вы узнаете по типу возврата функции (Option)
// что для доступа к данным нужно использовать метод `.map`, и вы никогда не забудете.
// проверить свой ввод, потому что такая проверка становится встроенной в функцию

// пример 3: повторить функцию N раз
// мы должны сделать так, чтобы функция всегда завершалась при изменении условий:
// times :: Number -> (Number -> Number) -> Number
const times = n => fn => n > 0 && (fn(n), times(n - 1)(fn))
times(3)(console.log)
// 3
// 2
// 1
times(-1)(console.log)
// won't execute anything
```
Если сделать частичные функции полными, можно предотвратить подобные ошибки во время выполнения. Постоянное возвращение значения также сделает код более легким как для сопровождения, так и для рассуждений.

## Библиотеки функционального программирования на JavaScript

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

__P.S:__ Эта репозиция успешна благодаря замечательным [вкладам](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)!
