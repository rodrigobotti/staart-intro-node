const {
  promises: {
    readFile,
  }
} = require('fs')
const { join } = require('path')

const { splitBuffer } = require('../helpers')

const salesFilePath = join(__dirname, 'files', 'sales.csv')

const naiveApproach = async () => {
  const data = await readFile(salesFilePath)

  const lines = splitBuffer(data, '\n').map(buffer => buffer.toString('utf8'))

  // ... for (const line of lines) ...
}

naiveApproach()
