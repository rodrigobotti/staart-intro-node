const { EventEmitter } = require('events')

const pingPongServer = () => {
  const pingpong = new EventEmitter()

  pingpong
    .on('ping', () => {
      console.log('ping!')
      setTimeout(() => {
        pingpong.emit('pong')
      }, 0)
    })
    .on('pong', () => {
      console.log('pong!')
      setTimeout(() => {
        pingpong.emit('ping')
      }, 0)
    })

  pingpong.emit('ping')
}

const delay = (time) => 
  new Promise(resolve => setTimeout(resolve, time))

const pingPongServerP = async () => {
  const pingpong = new EventEmitter()

  pingpong
    .on('ping', async () => {
      console.log('ping')
      await delay(500)
      pingpong.emit('pong')
    })
    .on('pong', async () => {
      console.log('pong')
      await delay(500)
      pingpong.emit('ping')
    })

  pingpong.emit('ping')
}

// pingPongServerP()
const errors = async () => {
  const pingpong = new EventEmitter({
    captureRejections: true,
  })

  pingpong
    .on('ping', async () => {
      console.log('ping')
      await delay(500)
      pingpong.emit('pong')
    })
    .on('pong', async () => {
      console.log('pong')
      await delay(500)
      pingpong.emit('ping')
    })
    .on('error', (error) => {
      console.error('eu capturei o erro emitido via on', error.message)
    })
    .on('forceExplodeAsync', error => Promise.reject(error))

  // necessário no node 14
  // prioritário
  pingpong[Symbol.for('nodejs.rejection')] = (error) => {
    console.error('eu capturei o erro emitido via propriedade', error.message)
  }
    
  pingpong.emit('ping')
  
  await delay(2000)
  pingpong.emit('error', Error('deu ruim depois de 2s'))

  await delay(1000)
  pingpong.emit('forceExplodeAsync', Error('deu ruim depois de 3s'))
}

errors()
