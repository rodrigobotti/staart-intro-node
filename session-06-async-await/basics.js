(async () => {
  const {
    promises: {
      readFile,
      writeFile,
    },
  } = require('fs')
  const { join } = require('path')

  const {
    withPromises: {
      authenticate,
      listPosts,
      getPost,
    }
  } = require('../helpers/social-media')
  
  const copyFile = async (source, dest) => {
    try {
      const data = await readFile(source)
      await writeFile(dest, data)
    } catch (error) {
      console.error('peguei no catch', error)
    } finally {
      console.log('Executo idenpendemente de erro ou sucesso')
    }
  }
  
  const exemplo = async () => {
    const [r1, r2, r3] = await Promise.all([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    return r1 + r2 + r3
  }
  
  const packageJsonPath = join(__dirname, '..', 'package.json')
  const destPath = join(__dirname, 'package.copy.json')
  
  await copyFile(packageJsonPath, destPath)
  
  console.log(await exemplo())

  const getFirstPost = async (username, password) => {
    const token = await authenticate(username, password)
    const [{ id }] = await listPosts(token)
    // const firstPost = await getPost(token, id)
    // return firstPost
    return getPost(token, id)
  }

  try {
    const post = await getFirstPost('staart', 'nodelife')
    console.log(post)
  } catch (error) {
    console.error('deu ruim', error)
  }

})()

