const { Client } = require('pg');

const DATABASE_URL = 'postgres://zdtmglwuvutdbi:4fdad7a05817739192e79ea461b9cf6cb57305381be912fe52f459f11eb13686@ec2-3-230-24-12.compute-1.amazonaws.com:5432/d6jpb5mbc1nrop';

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error querying database:', err);
  } else {
    console.log('Database connection successful, Current Time:', res.rows[0].now);
  }
  client.end();
});
