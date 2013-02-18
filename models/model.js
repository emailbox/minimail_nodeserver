

// Database Models (User, App, etc.) are BELOW


// MySQL pooling
//var mysql = require("db-mysql");
var defaultMySqlConnection = {
  "host": creds.mysql_hostname,
  "user": creds.mysql_user,
  "password": creds.mysql_pass,
  "database": creds.mysql_db,
  "port": creds.mysql_port,
  "debug" : false
};

var mysql = require('mysql');
var poolModule = require('generic-pool');
var mysqlPool = poolModule.Pool({
  name     : 'mysql',
  create   : function(callback) {
    var c = mysql.createConnection(defaultMySqlConnection);
    c.connect();

    // parameter order: err, resource
    // new in 1.0.6
    callback(null, c);
  },
  destroy  : function(client) { console.log('destroy mysql');client.end(); },
  max      : 4,
  min      : 0, // optional. if you set this, make sure to drain() (see step 3)
  idleTimeoutMillis : 30000, // specifies how long a resource can stay idle in pool before being removed
  log : false // if true, logs via console.log - can also be a function
});


// Test connecting to MySQL
var connection_test = mysql.createConnection(defaultMySqlConnection);

connection_test.connect(function(err){
  connection_test.end();
  if(err){
    console.log('Error');
    console.log(err);
    console.log('Creds');
    console.log(creds);
    node.exit();
  } else {
    console.log('MySQL connect success');
  }
});

mysqlPool.acquire(function(err, client) {
  if (err) {
    // handle error - this is generally the err from your
    // factory.create function 
    return;
  }
  client.query(
    'SELECT * FROM f_users LIMIT 1'
    ,[]
    , function(error, rows, fields) {

      mysqlPool.release(client);

      // Send them to the Apps page where they can manage their installed apps

      if (error) {
        console.log('Failed loading MySQL Pool');
        return false;
      }

      console.log('MySQL Pool connect success');

    }
  );

});


// Memcache
// var memcache = require('memcache');
// var mc_client = new memcache.Client(11211, process.env.MEMCACHIER_SERVERS);
// mc_client.on('connect', function(){
//   console.log('Memcache connect success');
// });

// mc_client.on('close', function(){
//   console.log('Memcache closed');
// });

// mc_client.on('timeout', function(){
//   console.log('Memcache timeout');
// });

// mc_client.on('error', function(e){
//   console.log('Memcache error');
//   console.log(e);
// });
// // connect to the memcache server
// mc_client.connect()


// Export back to app
exports.mysql = mysqlPool;
// exports.cache = mc_client;

// Database Models
exports.Api = require('./api.js');
exports.Emailbox = require('./emailbox.js');
exports.User = require('./user.js');
exports.Parse = require('./parse.js');
// exports.Payment = require('./payment.js');


