const logCalled = () => {
  console.log('> Fui chamada')
}

setTimeout(() => {
  logCalled()
}, 1000)

setTimeout(logCalled, 1000)

const timeoutId = setTimeout(() => {
  logCalled()
  setTimeout(logCalled, 1000)
}, 3000)

clearTimeout(timeoutId)

const intervalId = setInterval(() => {
  console.log('> Chamada no intervalo')
}, 1000)

setTimeout(() => {
  clearInterval(intervalId)
}, 5000)