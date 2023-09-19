const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require('pg');
const connectionString = 'postgres://zdtmglwuvutdbi:4fdad7a05817739192e79ea461b9cf6cb57305381be912fe52f459f11eb13686@ec2-3-230-24-12.compute-1.amazonaws.com:5432/d6jpb5mbc1nrop';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error querying database:', err);
  } else {
    console.log('Database connection successful, Current Time:', res.rows[0].now);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save_store', (req, res) => {
  const storeName = req.body.store_name;
  const category = req.body.category;
  const phoneNumber = req.body.phone_number;
  const menu = req.body.menu;
  const photoUrl = req.body.photo_url;

  const query = 'INSERT INTO raitto_store(store_name, category, phone_number, menu, photo_url) VALUES($1, $2, $3, $4, $5)';
  const values = [storeName, category, phoneNumber, menu, photoUrl];

  pool.query(query, values, (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('데이터가 성공적으로 추가되었습니다.');
      res.redirect('/');
    }
  });
});

const fetchDataByCategory = (category, res) => {
  pool.query('SELECT * FROM raitto_store WHERE category = $1', [category], (err, result) => {
    if (err) {
      console.error('Error querying data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
};

app.get('/place_restaurant', (req, res) => {
  fetchDataByCategory('식당', res);
});

app.get('/place_drink_alcohol', (req, res) => {
  fetchDataByCategory('술집', res);
});

app.get('/place_drink_caffeine', (req, res) => {
  fetchDataByCategory('카페', res);
});

app.get('/place_play_game', (req, res) => {
  fetchDataByCategory('PC방', res);
});

app.get('/place_sing', (req, res) => {
  fetchDataByCategory('노래방', res);
});

app.get('/place_exercise', (req, res) => {
  fetchDataByCategory('운동 시설', res);
});

app.get('/place_convenience', (req, res) => {
  fetchDataByCategory('편의점', res);
});

app.get('/place_book', (req, res) => {
  fetchDataByCategory('책방', res);
});

app.get('/place_laundry', (req, res) => {
  fetchDataByCategory('빨래방', res);
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
