server expectations for GET /api/posts
  authorization token optional

client expectations for GET /api/posts
  must have posts
  posts must be an array
  each post object must have:
    id,
    user,
    content,
    createdAt
  must have users
  any referenced user from the list of posts will be included in users
  each user object must have:
    id,
    username

server expectations for POST /api/posts
  auhorization token must be present
  json content must be present with:
    post object with:
      content
      other properties can be present and are ignored
    other proerties can be present and are ignored

client side expectations for POST /api/posts
  must have post with:
    id,
    user,
    content,
    createdAt
  maybe something about user?

