var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  type Query {
    hello: String
    user(id: String): User
    password(password: String, page: String): String
    username(username: String): String
  }
  type User {
    id: String
    name: String
  }
`);

var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

// root 提供所有 API 入口端点相应的解析器函数
var root = {
  hello: (args, context, info) => {
    console.log(args);
    return 'this is my "Hello world!"';
  },
  username: (args, context, info) => {
    console.log(args, 111);
    return 'ducafecat';
  },
  password: (args, context, info) => {
    console.log(args, 222);
    return '12321321321321432';
  },
  user: function (args, context, info) {
    console.log(args, context.db);
    if (!args.id) {
      return {age: 22, name: 33, id: 'tet'};
    }
    return fakeDatabase[args.id];
  }
};
var app = express();

app.all('/graphql', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// app.post('/graphql', graphqlHTTP(async (request, response, graphQLParams) => ({
//   schema: schema,
//   rootValue: root
//   graphiql: true
// })));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
