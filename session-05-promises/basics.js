const {
  promises: {
    readFile,
    writeFile,
  }
} = require('fs')
const { join } = require('path')

// Promise: Rejected | Fulfilled

// .then((data) => { ... })
// .catch((error) => { ... })

const packageJsonPath = join(__dirname, '..', 'package.json')
const destPath = join(__dirname, 'package.copy.promise.json')
const notExistsPath = join(__dirname, 'notexists')

readFile(packageJsonPath)
  .then(
    // só cai aqui se o readFile der certo
    // podemos retornar valores puros
    (data) => '\n\n\n' + data
  )
  .then(
    // podemos retornar outra promise
    (data) => writeFile(destPath, data)
  )
  .then(
    // só cai aqui se o writeFile for "fulfilled"
    () => console.log('cópia deu certo')
  )
  .catch(
    // lidando com erro
    (error) => {
      console.error('Vish deu erro, mas eu posso tratar')
      if (error.code === 'ENOENT') {
        return Promise.reject(Error('Arquivo não existe'))
      }
      return Promise.reject(error)
    }
  )
  .catch(
    // tratamento de erro -> engolindo o erro
    error => {
      console.error(error.message)
    }
  )
  .finally(() => {
    console.log('Eu rodo independentemente de ter dado ruim')
  })


// console.log('*'.repeat(20))

// Promise.resolve(
//   // valor puro
//   // outra Promise
// )

let cachedContent = null

const readPackageJson = () => {
  console.log('vou ler o arquivo')
  return readFile(packageJsonPath, { encoding: 'utf8' }).then(data => {
    console.log('Eu li o arquivo')
    cachedContent = data
    return data
  })
}

const getPackageJsonContent = () =>
  Promise.resolve(
    cachedContent ?? readPackageJson()
  )

getPackageJsonContent()
  .then(data => console.log(data))
  .then(() => getPackageJsonContent())
  .then(data => console.log(data))


const bagulhoBaseadoEmCallbacks = (param, callback) => {
  setTimeout(() => {
    // callback(undefined, param)
    callback(Error('de proposito'))
  }, 1000)
}

const bagulhoBaseadoEmPromises = param =>
  new Promise((resolve, reject) => {
    bagulhoBaseadoEmCallbacks(param, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })

bagulhoBaseadoEmPromises('será mesmo?')
  .then((data) => console.log(`${data}\né mesmo hein...`))
  .catch((error) => console.error(`${error.message}\n mas mesmo assim ainda é promises`))

// multiplas promises - Promise.all

Promise.all([
  Promise.resolve(1),
  Promise.reject(Error('a segunda falhou')),
  Promise.resolve(3),
  // ...
]) // Promise [ r1, r2, r3, ... ]
  .then(([ r1, r2, r3 ]) => r1 + r2 + r3)
  .then(console.log)
  .catch(console.error)

// multiplas promises - Promise.allSettled

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(Error('a segunda falhou')),
  Promise.resolve(3),
])
  // [ { status: 'fulfilled', value: T } | { status: 'rejected', reason: Error } ]
  .then(results => 
    results.filter(r => r.status === 'fulfilled').map(r => r.value)  
  )
  .then(console.log)
  
// multiplas promises - Promise.race

const delay = (time) =>
  new Promise((resolve) => 
    setTimeout(resolve, time)
  )

Promise.race([
  // delay(500).then(() => '500ms'),
  delay(1000).then(() => '1s'),
  delay(2000).then(() => '2s'),
  Promise.reject(Error('AAAAAAA'))
])
  .then(console.log)
  .catch(console.error)

// multiplas promises - Promise.any

Promise.any([
  Promise.reject(Error('primeiro erro')),
  Promise.resolve('deu certo'),
  // Promise.reject(Error('segundo erro')),
  Promise.reject(Error('terceiro erro')),
])
  .then(console.log)
  .catch(err => console.error('Nao devo ser chamado', err))
