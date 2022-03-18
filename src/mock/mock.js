import Mock from 'mockjs'

Mock.mock('http://localhost:3000/getList', {
  "array|5": [
    {
      "id|+1": 1,
      "title": "@ctitle",
      "content": "@cparagraph",
      "datetime": "@datetime('yy-MM-dd a HH:mm:ss')"
    }
  ]
})

Mock.mock('http://localhost:3000/getDataById', {
  "object": {
    "title": "@ctitle",
    "content": "@cparagraph",
    "datetime": "@datetime('yyyy-MM-dd HH:mm:ss')"
  }
})