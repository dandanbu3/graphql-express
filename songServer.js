var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var { includeNum } = require('./includeData.js');
// 使用 GraphQL Schema Language 创建一个 schema
var schema = buildSchema(`
  type Query {
    hello: String,
    user(id: String): User,
    password(password: String, page: Int): String,
    username(username: String): String
    songInfo(songId: String): songInfo
    code: String
    msg: String
    pageList(page: Int, pageSize: Int): [pageItem]
    includeList(songId: String, page: Int, pageSize: Int): [includeItem]
    userInfo: userinfo
    totalSize: Int
    curPage(page: Int): Int
  }
  type User {
    id: String
    name: String
  }
  type songInfo {
    id: String
    uid: String
    lyric: String
    cover: String
    activityId: Int
    attr: Int
    author: String
    cid: Int
    coin_num: Int
    crtype: Int
    duration: Int
    intro: String
    limit: Int
    title: String
    uname: String
    time: String
    musicType: [String]
    statistic: Statistic
  }
  type pageItem {
    num: Int
  }
  type Mutation {
    removeUser(id: ID!): removeuser
    collectStatus(check: Boolean, songId: String): Boolean
    code: String
    msg: String
  }
  type removeuser {
    id: String
    name: String
  }
  type Statistic {
    collect: Int
    comment: Int
    play: Int
    share: Int
  }
  type includeItem {
    id: Int
    uid: Int
    uname: String
    title: String
    author: String
    cover: String
  }
  type userinfo {
    uid: Int
    uname: String
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
      return { age: 22, name: 33, id: 'tet' };
    }
    return fakeDatabase[args.id];
  },
  songInfo: (args, context, info) => {
    return { "id":41222,"uid":2089809,"uname":"不给改","author":"321321 · ewqewq · 321321 · ewqewq","title":"HurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurtsHurts","cover":"http://i0.hdslb.com/bfs/music/e68c24a351b96e16641613ac3139c5aa2c94feb4.jpg","intro":"dhsajkhdjsahdjksah\nkldasjkdasjk sakhdjas    \ngsajklajdklsajkljgsajklajdklsajkljgsajklajdklsajkljgjdska","lyric":"http://uat-i0.hdslb.com/bfs/static/152401790941222.lrc","crtype":1,"duration":175,"passtime":1521628843,"curtime":1540369190,"aid":null,"cid":0,"msid":0,"attr":32,"limit":0,"activityId":0,"limitdesc":"","ctime":null,"statistic":{"sid":41222,"play":0,"collect":125,"comment":12,"share":44},"collectIds":[31900],"coin_num":0,musicType: ['音乐','VOCALOID歌手','翻唱','其他语种','网络歌曲','阿卡贝拉'], time: '3-21' };
  },
   // '音乐、VOCALOID歌手、翻唱、其他语种、网络歌曲、阿卡贝拉'
  code: (args, context, info) => {
    return '0';
  },
  msg: (args, context, info) => {
    console.log(args, info.parentType);
    return 'success';
  },
  pageList: (args, context, info) => {
    var page = args.page;
    var pageSize = args.pageSize;
    var pageList=[];
    for(var i=0;i < pageSize;i++) {
      pageList[i] = {num: page, name: 'Bob'};
    }
    return pageList;
  },
  removeUser: (args, context, info) => {
    console.log(args, 222);
    return {id: '44', name: 'name'};
  },
  includeList: (args, context, info) => {
    console.log(args.songId, 222);
    var includeList = includeNum.slice((args.page - 1) * args.pageSize, args.page * args.pageSize);
    return includeList;
  },
  totalSize: (args, context, info) => {
    console.log(args, 222);
    return includeNum.length;
  },
  curPage: (args, context, info) => {
    console.log(args.page, 333);
    return args.page;
  },
  collectStatus: (args, context, info) => {
    console.log(args, 444);
    return true;
  },
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
