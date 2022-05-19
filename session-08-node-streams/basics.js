const {
  Readable,
  Writable,
  Transform,
  pipeline,
} = require('stream')

const {
  createReadStream, 
  createWriteStream,
} = require('fs')
const { join } = require('path')

const copyStream = (source, dest) => {
  createReadStream(source).pipe(createWriteStream(dest))
}

copyStream(
  join(__dirname, 'files', 'sales.csv'),
  join(__dirname, 'files', 'sales.copy.csv')
)

Readable
  .from([1, 2, 3, 4, 5])
  .pipe(new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      callback(undefined, chunk + 1)
    }
  }))
  .pipe(new Writable({
    objectMode: true,
    write(chunk, _encoding, callback) {
      setTimeout(() => {
        console.log(chunk)
        callback()
      }, 500)
    }
  }))

const readable = new Readable({ read() {} })
const mapper = new Transform({
  transform(chunk, _encoding, callback) {
    callback(undefined, `mapped: ${chunk}!\n`)
  }
})

pipeline(
  readable,
  mapper,
  process.stdout,
  (error) => {
    if (error) console.error('Deu ruim no pipe', error)
    console.log('Deu certo no pipe')
  }
)

let i = 0
const interval = setInterval(() => {
  readable.push(String(i++))
}, 500)

setTimeout(() => {
  clearInterval(interval)
}, 5_000)

readable.on('data', d => console.log('readable: Via evento', d))
mapper.on('data', d => console.log('mapper: Via evento', d))
readable.on('close', () => console.log('readable terminou'))
