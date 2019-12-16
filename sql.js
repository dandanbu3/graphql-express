const env = require('./config/dev.env');

let post = {username: input.username, imgurl: uploadData.data.data.location};
const db = env.imgDataBase;

const connection = mysql.createConnection({
  host: db.host,
  port: db.port,
  user: db.user,
  password : db.password,
  database : db.database
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
connection.query('INSERT INTO imgupload SET ?', post, function (error, results, fields) {
  if (error) throw error;
});
connection.end();
