const { createReadStream } = require('fs')
const { join } = require('path')
const { pipeline, Readable } = require('stream')

const { delay } = require('../helpers')

async function* ticks() {
  while (true) {
    await delay(1000)
    yield
  }
}

console.log(ticks)
console.log(ticks())

const clocks = async () => {
  const firstClock = async () => {
    for await (const _ of ticks()) {
      console.log('first')
    }
  }

  const secondClock = async () => {
    for await (const _ of ticks()) {
      console.log('second')
    }
  }

  await Promise.all([
    firstClock(),
    secondClock(),
  ])
}

async function* toLines(source, _signal) {
  source.setEncoding('utf8')
  let lineBuffer = ''

  for await (const chunk of source) {
    const lines = lineBuffer.concat(chunk).split('\n')
    lineBuffer = lines.pop()
    for (const line of lines) {
      await delay(500)
      yield line
    }
  }

  if (lineBuffer.length) yield lineBuffer
}

async function* prefixLines(source, _signal) {
  for await (const line of source) {
    yield `line: ${line}\n`
  }
}

const processFile = () => {
  pipeline(
    createReadStream(join(__dirname, '..', 'package.json')),
    toLines,
    prefixLines,
    process.stdout,
    (error) => error ? console.error(error) : console.log('deu certo')
  )
}

const iterateStream = async () => {
  const readable = Readable.from([1, 2, 3, 4, 5])
  for await(const n of readable) {
    console.log(n)
  }
}

// iterateStream()

// AsyncIterable = { [Symbol.asyncIterator]: AsyncIterator }

const InfiniteClockAsyncIterable = () => ({
  async *[Symbol.asyncIterator]() {
    while(true) {
      await delay(1000)
      yield
    }
  }
})

const iterateTheClock = async () => {
  let counter = 0
  for await(const _ of InfiniteClockAsyncIterable()) {
    if (counter > 5) break
    console.log('passou 1 segundo')
    counter++
  }
}

iterateTheClock()
