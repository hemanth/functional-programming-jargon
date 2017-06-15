# Jargon Pemrograman Fungsional

_Functional programming_ (FP) atau pemrograman fungsional memberikan banyak
keuntungan, dan kini popularitasnya telah meningkat sebagai hasilnya. Namun,
setiap paradigma pemrograman datang dengan jargon uniknya masing-masing
dan FP tidak terkecuali. Dengan memberikan glosarium,
kami berharap dapat mempermudah belajar FP.

Contoh yang ada disajikan dalam JavaScript (ES2015).
[Kenapa JavaScript?](https://github.com/hemanth/functional-programming-jargon/wiki/Why-JavaScript%3F)

*Ini adalah sebuah
[WIP](https://github.com/hemanth/functional-programming-jargon/issues/20)
dari
[Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon/)
milik [hemanth](https://github.com/hemanth/); Jangan ragu untuk mengirim PR ;)*

Jika ada, dokumen ini menggunakan istilah yang didefinisikan dalam spesifikasi
[Fantasy Land](https://github.com/fantasyland/fantasy-land).

__Daftar Isi__
<!-- RM(noparent,notop) -->

* [Arity](#arity)
* [Higher-Order Functions (HOF)](#higher-order-functions-hof)
* [Partial Application](#partial-application)
* [Currying](#currying)
* [Closure](#closure)
* [Auto Currying](#auto-currying)
* [Function Composition](#function-composition)
* [Continuation](#continuation)
* [Purity](#purity)
* [Side Effect](#side-effects)
* [Idempotent](#idempotent)
* [Point-Free Style](#point-free-style)
* [Predicate](#predicate)
* [Contract](#contract)
* [Category](#category)
* [Value](#value)
* [Constant](#constant)
* [Functor](#functor)
* [Pointed Functor](#pointed-functor)
* [Lift](#lift)
* [Referential Transparency](#referential-transparency)
* [Equational Reasoning](#equational-reasoning)
* [Lambda](#lambda)
* [Lambda Calculus](#lambda-calculus)
* [Lazy evaluation](#lazy-evaluation)
* [Monoid](#monoid)
* [Monad](#monad)
* [Comonad](#comonad)
* [Applicative Functor](#applicative-functor)
* [Morphism](#morphism)
  * [Endomorphism](#endomorphism)
  * [Isomorphism](#isomorphism)
* [Setoid](#setoid)
* [Semigroup](#semigroup)
* [Foldable](#foldable)
* [Type Signature](#type-signature)
* [Algebraic data type](#algebraic-data-type)
  * [Sum type](#sum-type)
  * [Product type](#product-type)
* [Option](#option)
* [Pustaka Pemrograman Fungsional dalam JavaScript](#pustaka-pemrograman-fungsional-dalam-javascript)


<!-- /RM -->

## Arity

_Arity_ merupakan banyaknya argumen yang diambil oleh fungsi.
Berasal dari kata-kata seperti _unary_, _binary_, _ternary_, dan lain-lain.
Kata ini memiliki perbedaan yang terdiri dari dua sufiks, "-ary" dan "-ity."
Penjumlahan, misalnya, mengambil dua argumen, dan jadi didefinisikan sebagai
fungsi biner (_binary function_) atau fungsi dengan dua _arity_.
Fungsi semacam itu terkadang disebut "_dyadic_" oleh orang-orang yang lebih
menyukai bahasa Yunani dari bahasa Latin.
Demikian juga, fungsi yang mengambil sejumlah variabel argumen disebut
"_variadic_", sedangkan fungsi biner harus diberikan dua dan hanya dua
argumen, meskipun _currying_ dan _partial application_ (lihat di bawah).


```js
const sum = (a, b) => a + b

const arity = sum.length
console.log(arity) // 2

// Arity dari fungsi `sum` adalah dua
```

## Higher-Order Functions (HOF)

_Higher-Order Function_ adalah sebuah fungsi yang mengambil fungsi sebagai
argumen dan/atau mengembalikan sebuah fungsi.


```js
const filter = (predicate, xs) => xs.filter(predicate)
```

```js
const is = (type) => (x) => Object(x) instanceof type
```

```js
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Partial Application

Menerapkan fungsi secara parsial (_Partial Application_ atau Fungsi Parsial)
artinya membuat fungsi baru dengan mengisi beberapa argumen ke fungsi semula.


```js
// Helper membuat sebagian fungsi yang diaplikasikan
// Mengambil sebuah fungsi dan beberapa argumen
const partial = (f, ...args) =>
  // mengembalikan sebuah fungsi yang mengambil sisa argumen
  (...moreArgs) =>
    // dan memanggil fungsi asilnya dengan semuanya
    f(...args, ...moreArgs)

// Sesuatu untuk diaplikasikan
const add3 = (a, b, c) => a + b + c

// Menerapkan `2` dan `3` secara parsial ke `add3`
// Sehingga, memberikan Anda sebuah fungsi dengan satu argumen
const fivePlus = partial(add3, 2, 3) // (c) => 2 + 3 + c

fivePlus(4) // 9
```

Anda juga dapat menggunakan `Function.prototype.bind` untuk menerapkan
fungsi parsial di JavaScript:


```js
const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
```

_Partial application_ atau fungsi parsial membantu menciptakan fungsi yang
lebih sederhana dari yang lebih kompleks dengan memadukan data saat Anda
memilikinya. [_Curried_](#currying) _function_ sudah secara otomatis diterapkan
secara parsial.

## Currying

_Currying_ merupakan sebuah proses mengubah fungsi yang membutuhkan banyak
argumen menjadi fungsi yang membawa mereka satu-persatu.

Setiap kali fungsi dipanggil hanya menerima satu argumen dan mengembalikan
sebuah fungsi yang membutuhkan satu argumen sampai semua argumen dilewatkan.


```js
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12

```

## Closure

_Closure_ merupakan sebuah cara untuk mengakses sebuah variabel yang berada
di luar cakupannya.
Secara formal, _closure_ merupakan sebuah teknik untuk menerapkan _lexically
scoped_ bernama _binding_. Ini adalah cara untuk menyimpan sebuah fungsi
dengan sebuah _environment_.

_Closure_ adalah lingkup yang menangkap variabel lokal dari suatu fungsi untuk
askes bahkan setelah eksekusi telah berpindah dari blok yang didefinisikan.
Yaitu, mereka membiarkan referensi lingkup setelah blok dimana variabel
dinyatakan telah selesai mengeksekusi.


```js
const addTo = x => y => x + y
var addToFive = addTo(5)
addToFive(3) // mengembalikan 8
```

Fungsi `addTo()` mengembalikan sebuah fungsi (secara internal disebut `add()`),
lalu disimpan di variabel yang disebut `addToFive` dengan _curried call_ yang
memiliki parameter `5`.

Idealnya, ketika fungsi `addTo` selesai dieksekusi, cakupannya,
dengan variabel lokal `add`, `x`, `y` seharusnya tidak dapat diakses. Tapi,
itu mengembalikan `8` ketika memanggil `addToFive()`. Ini artinya kondisi
dari fungsi `addTo` disimpan bahkan setelah blok kode selesai dieksekusi.
Jika tidak, tidak mungkin dapat mengetahui bahwa `addTo` telah dipanggil
sebagai `addTo(5)` dan nilai dari `x` telah ditentukan menjadi `5`.

_Lexical scoping_ adalah alasan mengapa ia dapat menemukan nilai dari `x` dan
`add` - sebuah variabel _private_ induk yang telah selesai dieksekusi.
Nilai ini disebut _Closure_.

`Stack` beserta `lexical scope` fungsinya disimpan dalam bentuk referensi
ke induknya. Hal ini mencegah _closure_ dan variabel-variabel mendasar agar
tidak dikumpulkan sebagai sampah (karena setidaknya ada satu refernsi
langsung untuk itu).

__Lambda Vs. Closure__
_Lambda_ pada dasarnya adalah fungsi yang didefinisikan secara _inline_
daripada metode standar untuk mendeklarasikan fungsi. Lambda sering dapat
dilewatkan sebagai objek.

_Closure_ adalah fungsi yang membungkus keadaan sekitarnya dengan
mereferensikan bidang yang ada di luar tubuhnya. _State_ tertutup tetap
berada di seberang seruan _closure_.


__Bacaan lebih lanjut/Sumber__
* [Lambda Vs Closure](http://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda)
* [How do JavaScript Closures Work?](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

## Auto Currying

_Auto currying_ mengubah fungsi yang membutuhkan banyak argumen menjadi
argumen yang jika diberikan kurang dari jumlah argumen yang benar mengembalikan
sebuah fungsi yang mengambil sisanya. Bila fungsi mendapatkan jumlah argumen
yang benar, maka akan dievaluasi.

lodash dan Ramda memiliki fungsi `curry` yang bekerja seperti di bawah.

```js
const add = (x, y) => x + y

const curriedAdd = _.curry(add)
curriedAdd(1, 2) // 3
curriedAdd(1) // (y) => 1 + y
curriedAdd(1)(2) // 3
```

__Bacaan lebih lanjut__
* [Favoring Curry](http://fr.umio.us/favoring-curry/)
* [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

## Function Composition

_Function composition_ atau komposisi fungsi adalah tindakan yang menempatkan
dua fungsi bersama untuk membentuk fungsi ketiga dimana keluaran dari satu
fungsi adalah masukan dari yang lain.


```js
const compose = (f, g) => (a) => f(g(a)) // Definisi
const floorAndToString = compose((val) => val.toString(), Math.floor) // Penggunaan
floorAndToString(121.212121) // '121'
```

## Continuation

Pada suatu titik dalam sebuah program, bagian dari kode yang belum dieksekusi
dikenal sebagai kelanjutan/kontinuitas atau _continuation_.


```js
const printAsString = (num) => console.log(`Given ${num}`)

const addOneAndContinue = (num, cc) => {
  const result = num + 1
  cc(result)
}

addOneAndContinue(2, printAsString) // 'Given 3'
```

Kontinuitas sering terlihat pada pemrograman _asynchronous_ saat program
perlu menunggu untuk menerima data sebelum dapat melanjutkan. Responnya
sering dilewatkan ke sisa program, yang merupakan kelanjutannya, begitu
sudah diterima.


```js
const continueProgramWith = (data) => {
  // Melanjutkan program dengan data
}

readFileAsync('path/to/file', (err, response) => {
  if (err) {
    // mengatasi galat
    return
  }
  continueProgramWith(response)
})
```

## Purity

Sebuah fungsi dikatan murni atau _pure_ jika mengembalikan nilai yang hanya
ditentukan oleh nilai masukannya, dan tidak menghasilkan efek samping
atau _side effect_.


```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

Berbeda dengan masing-masing hal di bawah:


```js
window.name = 'Brianne'

const greet = () => `Hi, ${window.name}`

greet() // "Hi, Brianne"
```

Contoh keluaran di atas didasarkan pada data yang tersimpan di luar fungsi...


```js
let greeting

const greet = (name) => {
  greeting = `Hi, ${name}`
}

greet('Brianne')
greeting // "Hi, Brianne"
```

... dan yang satu ini memodifikasi keadaan di luar fungsi.

## Side Effect

Sebuah fungsi atau ekspresi dikatakan memiliki efek samping jika selain
mengembalikan nilai, ia berinterasksi dengan (membaca dari atau menulis ke)
keadaan yang dapat berubah eksternal.


```js
const differentEveryTime = new Date()
```

```js
console.log('IO is a side effect!')
```

## Idempotent

Suatu fungsi _idempotent_ jika mengaplikasikannya kembali hasilnya tidak
menghasilkan hasil yang berbeda.


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

Menulis fungsi dimana definisi tidak secara eksplisit mengidentifikasi
argumen yang digunakan. Gaya ini biasanya memerlukan [_currying_](#currying)
atau lainnya [_Higher-Order function_](#higher-order-functions-hof).
Alias, _Tacit programming_.


```js
// Diberikan
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

// Lalu

// Bukan points-free - `numbers` merupakan argumen eksplisit
const incrementAll = (numbers) => map(add(1))(numbers)

// Points-free - `list` merupakan argumen implisit
const incrementAll2 = map(add(1))
```

`incrementAll` mengidentifikasi dan menggunakan parameter `numbers`, jadi itu
bukan _points-free_.  `incrementAll2` dituliskan hanya dengan menggabungkan
beberapa fungsi dan beberapa nilai, membuatnya tidak menyebut satu pun
argumennya. Itu __adalah__ _points-free_.

Definisi _points-free function_ terlihat seperti _assignment_ normal tanpa
`function` atau `=>`.

## Predicate

Suatu _predicate_ adalah sebuah fungsi yang mengembalikan nilai `true` atau
`false` untuk suatu nilai yang diberikan. Biasanya digunakan sebagai _callback_
untuk menyaring _array_.


```js
const predicate = (a) => a > 2

;[1, 2, 3, 4].filter(predicate) // [3, 4]
```

## Contract

Suatu _contract_ menentukan kewajiban dan jaminan perilaku dari suatu fungsi
atau ekspresi saat _runtime_. Ini bertindak sebagai seperangkat aturan yang
diharapkan dari masukan dan keluaran suatu fungsi atau ekspresi, dan
kesalahan umumnya dilaporkan setiap kali sebuah kontrak dilanggar.


```js
// Mendefinisikan contract kami : int -> int
const contract = (input) => {
  if (typeof input === 'number') return true
  throw new Error('Contract violated: expected int -> int')
}

const addOne = (num) => contract(num) && num + 1

addOne(2) // 3
addOne('some string') // Contract violated: expected int -> int
```

## Category

Kategori dalam _category theory_ adalah kumpulan objek dan morfisme
(_morphism_) di antara keduanya. Dalam pemrograman, biasanya _types_ bertindak
sebagai objek dan fungsi sebagai morfisme.


Untuk menjadi kategori yang sah, tiga aturan harus dipenuhi:

1. Harus ada morfisme identitas yang memetakan objek itu sendiri.
    Dimana `a` adalah sebuah objek dalam beberapa kategori,
    harus ada fungsi dari `a -> a`.
2. Morfisme harus disusun.
    Dimana `a`, `b`, dan `c` adalah objek dalam beberapa kategori,
    dan `f` adalah morfisme dari `a -> b`, serta `g` adalah morfisme dari
    `b -> c`; `g(f(x))` harus sama dengan `(g • f)(x)`.
3. Komposisi harus asosiatif.
    `f • (g • h)` sama halnya dengan `(f • g) • h`.

Karena aturan ini mengatur komposisi pada tingkat yang sangat abstrak,
teori kategori sangat bagus dalam menemukan cara baru untuk menyusun sesuatu.

__Bacaan lebih lanjut__

* [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)

## Value

Apa saja yang dapat di-_assign_ ke variabel.


```js
5
Object.freeze({name: 'John', age: 30}) // The `freeze` function enforces immutability.
;(a) => a
;[1]
undefined
```

## Constant

Sebuah variabel yang tidak dapat ditetapkan kembali setelah ditentukan nilainya.

```js
const five = 5
const john = Object.freeze({name: 'John', age: 30})
```

_Constant_ atau konstanta adalah
[_referentially transparent_](#referential-transparency). Artinya, mereka
dapat diganti dengan nilai yang mereka wakili tanpa mempengaruhi hasilnya.

Dengan dua konstanta di atas, ekspresi berikut akan selalu mengembalikan
nilai `true`.


```js
john.age + five === ({name: 'John', age: 30}).age + (5)
```

## Functor

Suatu objek yang mengimplementasikan fungsi `map`, yang ketika menjalankan
lebih dari setiap nilai pada objek untuk menghasilkan objek baru, mematuhi
dua aturan:


__Preserves identity__
```
object.map(x => x) ≍ object
```

__Composable__

```
object.map(compose(f, g)) ≍ object.map(g).map(f)
```

(`f`, `g` menjadi fungsi sewenang-wenang)

_Functor_ umum dalam JavaScript adalah `Array` karena mematuhi dua aturan
_functor_, yaitu:


```js
[1, 2, 3].map(x => x) // = [1, 2, 3]
```

dan


```js
const f = x => x + 1
const g = x => x * 2

;[1, 2, 3].map(x => f(g(x))) // = [3, 5, 7]
;[1, 2, 3].map(g).map(f)     // = [3, 5, 7]
```

## Pointed Functor

Suatu objek dengan sebuah fungsi `of` yang mengambil _semua_ nilai tunggal
ke dalamnya.

ES2015 menambahkan `Array.of` yang menjadikannya _pointed functor_.


```js
Array.of(1) // [1]
```

## Lift

_Lifting_ atau mengangkat (dari kata _lift_, angkat) adalah saat Anda
mengambil sebuah nilai dan mengambilnya ke dalam suatu objek seperti
[functor](#pointed-functor). Jika Anda mengangkat sebuah fungsi ke dalam
[Applicative Functor](#applicative-functor), maka Anda dapat membuatnya
bekerja pada nilai-nilai yang juga ada di _functor_ itu.

Beberapa implementasi memiliki fungsi yang disebut `lift`, atau `liftA2` agar
lebih mudah menjalankan fungsi pada _functor_.


```js
const liftA2 = (f) => (a, b) => a.map(f).ap(b) // catatan: itu `ap`, bukan `map`.

const mult = a => b => a * b

const liftedMult = liftA2(mult) // fungsi ini sekarang bekerja pada functor seperti array

liftedMult([1, 2], [3]) // [3, 6]
liftA2(a => b => a + b)([1, 2], [3, 4]) // [4, 5, 5, 6]
```

Mengangkat fungsi satu argumen dan menerapkannya melakukan hal yang sama
seperti `map`.


```js
const increment = (x) => x + 1

lift(increment)([2]) // [3]
;[2].map(increment) // [3]
```

## Referential Transparency

Sebuah ekspresi yang dapat diganti nilainya dengan tanpa mengubah tingkah laku
program tersebut dikatan _referentially_ transparan.

Katakanlah kita memiliki fungsi `greet`:


```js
const greet = () => 'Hello World!'
```

Setiap seruan dari `greet()` dapat ditimpa dengan `Hello World!`, karena itu
`greet` secara referensial transparan.

##  Equational Reasoning

Ketika sebuah aplikasi terdiri dari ekspresi dan tanpa efek samping,
kebenaran tentang sistem dapat diturunkan dari bagian-bagiannya.

## Lambda

Fungsi anonim yang dapat diperlakukan seperti sebuah nilai.


```js
;(function (a) {
  return a + 1
})

;(a) => a + 1
```

_Lambda_ juga sering dilewatkan sebagai argumen ke _Higher-Order function_.


```js
[1, 2].map((a) => a + 1) // [2, 3]
```

Anda dapat menugaskan (_assign_) suatu _lambda_ ke dalam sebuah variabel.


```js
const add1 = (a) => a + 1
```

## Lambda Calculus

Sebuah cabang dari matematika yang menggunakan fungsi untuk membuat suatu
[model universal dari komputasi](https://en.wikipedia.org/wiki/Lambda_calculus).

## Lazy evaluation

_Lazy evaluation_ adalah mekanisme evaluasi panggilan-per-kebutuhan yang
menunda evaluasi suatu ekspresi sampai nilainya dibutuhkan. Dalam bahasa
fungsional, ini memungkinkan struktur seperti _infinite list_, yang biasanya
tidak tersedia dalam bahasa imperatif dimana urutan perintah sangat penting.


```js
const rand = function*() {
  while (1 < 2) {
    yield Math.random()
  }
}
```

```js
const randIter = rand()
randIter.next() // Setiap eksekusi memberikan nilai acak, ekspresi dievaluasi hanya saat dibutuhkan
```

## Monoid

Objek dengan fungsi yang "menggabungkan" objek itu sendiri dengan tipe lain
yang sama.

Salah satu _monoid_ sederhana adalah penjumlahan angka:


```js
1 + 1 // 2
```

Dalam kasus ini, angka adalah objek dan `+` adalah fungsi.

Nilai "identitas" juga harus ada bila dikombinasikan dengan nilai yang tidak
mengubahnya.

Nilai identitas untuk penjumlahan adalah `0`.


```js
1 + 0 // 1
```

Ini juga memerlukan pengelompokkan operasi yang tidak akan mempengaruhi
hasilnya (asosiatif):


```js
1 + (2 + 3) === (1 + 2) + 3 // true
```

Rangkaian _array_ juga membentuk _monoid_:


```js
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

Nilai identitasnya adalah _array_ kosong atau `[]`.


```js
;[1, 2].concat([]) // [1, 2]
```

Jika fungsi identitas dan komposisi disediakan, maka fungsinya membentuk monoid:


```js
const identity = (a) => a
const compose = (f, g) => (x) => f(g(x))
```

`foo` adalah fungsi apapun yang mengambil satu argumen.


```
compose(foo, identity) ≍ compose(identity, foo) ≍ foo
```

## Monad

_Monad_ adalah sebuah objek dengan fungsi [`of`](#pointed-functor) dan `chain`.
`chain` ini seperti [`map`](#functor), kecuali itu "membatalkan" objek
bersarang yang dihasilkan.


```js
// Implementasi
Array.prototype.chain = function (f) {
  return this.reduce((acc, it) => acc.concat(f(it)), [])
}

// Penggunaan
;Array.of('cat,dog', 'fish,bird').chain((a) => a.split(',')) // ['cat', 'dog', 'fish', 'bird']

// Kontras ke map
;Array.of('cat,dog', 'fish,bird').map((a) => a.split(',')) // [['cat', 'dog'], ['fish', 'bird']]
```

`of` juga diketahui sebagai `return` di bahasa fungsional lainnya.
`chain` juga diketahui sebagai `flatmap` dan `bind` di bahasa lainnya.

## Comonad

Suatu objek yang memiliki fungsi `extract` dan `extend`.


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

`extract` mengambil sebuah nilai keluar dari _functor_.


```js
CoIdentity(1).extract() // 1
```

_extend_ menjalankan fungsi di atas _comonad_. Fungsi tersebut seharusnya
mengembalikan tipe yang sama dengan _comonad_.


```js
CoIdentity(1).extend((co) => co.extract() + 1) // CoIdentity(2)
```

## Applicative Functor

Suatu _applicative functor_ adalah sebuah objek dengan fungsi `ap`. `ap`
menerapkan fungsi pada objek ke nilai objek lain dari tipe yang sama.


```js
// Implementasi
Array.prototype.ap = function (xs) {
  return this.reduce((acc, f) => acc.concat(xs.map(f)), [])
}

// Contoh penggunaan
;[(a) => a + 1].ap([1]) // [2]
```

Ini berguna jika Anda memiliki dua objek dan Anda ingin menerapkan fungsi biner
ke isinya.


```js
// Array yang ingin digabungkan
const arg1 = [1, 3]
const arg2 = [4, 5]

// menggabungkan fungsi - harus curried untuk pekerjaan ini
const add = (x) => (y) => x + y

const partiallyAppliedAdds = [add].ap(arg1) // [(y) => 1 + y, (y) => 3 + y]
```

Ini memberi Anda sebuah _array_ dari sejumlah fungsi yang dapat Anda sebut `ap`
untuk mendapatkan hasilnya:


```js
partiallyAppliedAdds.ap(arg2) // [5, 6, 7, 8]
```

## Morphism

Sebuah fungsi transformasi.

### Endomorphism

Sebuah fungsi dimana tipe masukannya sama dengan keluarannya.


```js
// uppercase :: String -> String
const uppercase = (str) => str.toUpperCase()

// decrement :: Number -> Number
const decrement = (x) => x - 1
```

### Isomorphism

Sepasang transformasi antara dua jenis benda yang bersifat struktural dan tidak
ada data yang hilang.

Sebagai contoh, koordinat 2D dapat disimpan sebagai _array_ `[2, 3]` atau objek
`{x: 2, y: 3}`.


```js
// Menyediakan fungsi untuk mengubah kedua arah membuat mereka isomorfik
const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```

## Setoid

Suatu objek yang memiliki fungsi `equals` yang mana dapat digunakan untuk
membandingkan objek lain dengan tipe yang sama.

Menjadikan _array_ suatu _setoid_:


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

Suatu objek yang memiliki fungsi `concat` yang menggabungkannya dengan objek
lain dengan tipe yang sama.


```js
;[1].concat([2]) // [1, 2]
```

## Foldable

Suatu objek yang memiliki fungsi `reduce` yang dapat mengubah objek tersebut
menjadi tipe yang lain.


```js
const sum = (list) => list.reduce((acc, val) => acc + val, 0)
sum([1, 2, 3]) // 6
```

## Type Signature

Seringkali fungsi dalam JavaScript memiliki komentar yang menunjukkan tipe dari
argumen dan nilai pengembaliannya.

Ada sedikit perbedaan di antara komunitas/masyarakat, namun mereka sering
mengikuti pola berikut:


```js
// functionName :: firstArgType -> secondArgType -> returnType

// add :: Number -> Number -> Number
const add = (x) => (y) => x + y

// increment :: Number -> Number
const increment = (x) => x + 1
```

Jika suatu fungsi menerima fungsi lain sebagai argumennya, maka itu dibungkus
dengan tanda kurung.


```js
// call :: (a -> b) -> a -> b
const call = (f) => (x) => f(x)
```

Huruf `a`, `b`, `c`, `d` digunakan sebagai tanda bahwa argumen tersebut dapat
berbentuk apa saja. Layaknya versi dari `map`, mengambil sebuah fungsi
yang mengubah nilai dari bentuk `a` ke bentuk lain `b`, sebuah _array_ dengan
nilai berbentuk `a`, dan mengembalikan sebuah _array_ dengan nilai berbentuk
`b`.


```js
// map :: (a -> b) -> [a] -> [b]
const map = (f) => (list) => list.map(f)
```

__Bacan lebih lanjut__
* [Ramda's type signatures](https://github.com/ramda/ramda/wiki/Type-Signatures)
* [Mostly Adequate Guide](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch7.html#whats-your-type)
* [What is Hindley-Milner?](http://stackoverflow.com/a/399392/22425) di Stack Overflow

## Algebraic data type

Jenis komposit yang dibuat dari jenis lainnya. Dua kelas umum dari tipe aljabar
(_algebraic type_) adalah [_sum_](#sum-type) dan [_product_](#product-type).

### Sum type

_Sum type_ adalah kombinasi dari dua _type_ menjadi satu sama lain. Ini disebut
jumlah (_sum_) karena jumlah nilai yang mungkin terjadi pada _type_ hasil
adalah jumlah dari tipe masukan.

JavaScript tidak memiliki _type_ seperti ini, tapi kita dapat menggunakan `Set`
untuk berpura-pura:


```js
// bayangkan bahwa daripada Set di sini kita memiliki tipe yang hanya memiliki nilai-nilai ini
const bools = new Set([true, false])
const halfTrue = new Set(['half-true'])

// Tipe `weakLogic` mengandung jumlah nilai dari `bools` dan `halfTrue`
const weakLogicValues = new Set([...bools, ...halfTrue])
```

_Sum type_ terkadang disebut _union type_, _discriminated union_, atau _tagged
union_.

Ada [beberapa](https://github.com/paldepind/union-type)
[pustaka](https://github.com/puffnfresh/daggy) dalam JavaScript yang
membantu mendefinisikan dan menggunakan _union type_.

_Flow_ memasukkan [_union type_](https://flow.org/en/docs/types/unions/) dan
TypeScript memiliki
[Enums](https://www.typescriptlang.org/docs/handbook/enums.html) untuk melayani
peran yang sama.

### Product type

Tipe ***product*** menggabungkan beberapa tipe bersama, dengan cara yang mungkin
Anda telah akrab:

```js
// point :: (Number, Number) -> {x: Number, y: Number}
const point = (x, y) => ({x: x, y: y})
```

Ini disebut produk (_product_) karena nilai total dari struktur data adalah
produk dari nilai yang berbeda. Banyak bahasa memiliki tipe _tuple_ yang
merupakan formulasi sederhana dari _product type_.

Lihat juga [teori himpunan](https://id.wikipedia.org/wiki/Teori_himpunan).

## Option

_Option_ adalah suatu _[sum type](#sum-type)_ dengan dua kasus yang sering
disebut `Some` dan `None`.

_Option_ sangat berguna untuk menyusun fungsi-fungsi yang mungkin tidak
mengembalikan sebuah nilai.


```js
// Definisi naif

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

Gunakan `chain` untuk mengurutkan fungsi yang mengembalikan `Option`.


```js

// getItem :: Cart -> Option CartItem
const getItem = (cart) => maybeProp('item', cart)

// getPrice :: Item -> Option Number
const getPrice = (item) => maybeProp('price', item)

// getNestedPrice :: cart -> Option a
const getNestedPrice = (cart) => getItem(obj).chain(getPrice)

getNestedPrice({}) // None()
getNestedPrice({item: {foo: 1}}) // None()
getNestedPrice({item: {price: 9.99}}) // Some(9.99)
```

`Option` juga dikenal sebagai `Maybe`. `Some` terkadang disebut `Just`.
`None` terkadang disebut `Nothing`.

## Pustaka Pemrograman Fungsional dalam JavaScript

* [mori](https://github.com/swannodette/mori)
* [Immutable](https://github.com/facebook/immutable-js/)
* [Ramda](https://github.com/ramda/ramda)
* [ramda-adjunct](https://github.com/char0n/ramda-adjunct)
* [Folktale](http://folktalejs.org)
* [monet.js](https://cwmyers.github.io/monet.js/)
* [lodash](https://github.com/lodash/lodash)
* [Underscore.js](https://github.com/jashkenas/underscore)
* [Lazy.js](https://github.com/dtao/lazy.js)
* [maryamyriameliamurphies.js](https://github.com/sjsyrek/maryamyriameliamurphies.js)
* [Haskell in ES6](https://github.com/casualjavascript/haskell-in-es6)

---

__P.S:__ _Repository_ ini di-_fork_ dari proyek
[_Functional Programming Jargon_](https://github.com/hemanth/functional-programming-jargon/)
milik [hemanth](https://github.com/hemanth/) dan telah dikatakan berhasil karena
[kontribusi](https://github.com/hemanth/functional-programming-jargon/graphs/contributors)
yang luar biasa.
