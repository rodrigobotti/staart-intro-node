// generator function
function* example(arg) {
  const incremented = arg + 1
  console.log(`me invocou com ${arg}`)
  yield arg

  console.log('estava "suspeded" mas agora estou "resumed"')
  console.log(`ainda tenho o contexto da função: arg=${arg}, incremented=${incremented}`)
  const resumedArg = yield incremented

  console.log(`fui "resumed" recebendo o valor ${resumedArg}`)
  yield resumedArg + 3

  console.log('"resumed" novamente, mas agora é a última')
  return 42
}

// console.log(example)
// const generator = example(1)
// console.log(generator)
// console.log(generator.next())
// console.log(generator.next())
// console.log(generator.next(5))
// console.log(generator.next())

// console.log(generator.next())
// console.log(generator.next())
// console.log(generator.next())

function* naturals() {
  let n = 0
  while(true) {
    yield n++
  }
}

// não vai travar: só cria o generator
const N = naturals()

const take = (limit, gen) => {
  const acc = []
  for (let i = 0; i < limit; i ++) {
    const { value, done } = gen.next()
    if (done) {
      if (value !== undefined) {
        acc.push(value)
      }
      break
    }
    
    acc.push(value)
  }
  return acc
}

console.log(
  take(10, N)
)

function* hello() {
  yield 'hello'
  yield 'world'
  yield '!'
}

for (const msg of hello()) {
  console.log(msg)
}

// for (const n of naturals()) {
//   if (n >= 20) break
//   console.log(n)
// }

// iterator protocol
// Iterator = { next: () => { value: T, done: boolean } }

const ZeroToNIterator = (n) => ({
  counter: 0,
  next() {
    const done = this.counter > n
    return  {
      done,
      value: done ? undefined : this.counter++,
    }
  }
})

// Iterable protocol
// Iterable = { [Symbol.iterator]: () => Iterator }

const ZeroToN = (n) => ({
  [Symbol.iterator]() {
    return ZeroToNIterator(n)
  }
})

for(const n of ZeroToN(5)) {
  console.log(n)
}

const AlternatingMessages = (n) => ({
  messages: ['hello', 'bye'],
  *[Symbol.iterator]() {
    for (let i = 0; i < n; i++) {
      const message = i % 2 === 0 ? this.messages[0] : this.messages[1]
      yield message
    }
  }
})

for (const msg of AlternatingMessages(6)) {
  console.log(msg)
}
