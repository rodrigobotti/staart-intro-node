const {
  withPromises: {
    authenticate,
    listPosts,
    getPost,
  },
} = require('../helpers/social-media')

const getFirstPost = (username, password) =>
  authenticate(username, password)
    .then(token =>
      listPosts(token)
        .then(([{ id }]) => getPost(token, id))
    )

const listPostsLinear = (token) =>
  listPosts(token)
    .then(posts => ({ posts, token })) // Promise<{ posts, token }>

const getPostLinear = ({ token, posts: [{ id }] }) =>
  getPost(token, id)

const getFirstPostLinear = (username, password) =>
  authenticate(username, password)
    .then(listPostsLinear)
    .then(getPostLinear)


getFirstPost('staart', 'nodelife')
  .then(console.log)
  .catch(console.error)
