const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Veritabanı yerine basit bir dizi (gerçek uygulamada MongoDB gibi bir veritabanı kullanılmalı)
let notlar = [];
let dersler = [];
let ibadetler = [];

// Not API'leri
app.get('/api/notlar', (req, res) => {
  res.json(notlar);
});

app.post('/api/notlar', (req, res) => {
  const yeniNot = {
    id: Date.now(),
    baslik: req.body.baslik,
    icerik: req.body.icerik,
    tarih: new Date()
  };
  notlar.push(yeniNot);
  res.status(201).json(yeniNot);
});

// Benzer şekilde dersler ve ibadetler için API'ler eklenebilir

app.listen(port, () => {
  console.log(`Server ${port} numaralı portta çalışıyor`);
}); 