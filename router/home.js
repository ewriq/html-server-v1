const express = require('express');
const config = require('../config/cnf');
const router = express.Router();
const formatDate = require('../modules/date.js');
const fs = require('fs');
const formatFileSize = require('../modules/size.js');
const upload = require("../config/uploads.js");
const login = require('../middleware/oauth');
const path = require('path');
const open = require('../open');
const publicPath = path.join(__dirname, '../server/public');



router.get("/", (req, res) => {
  res.render('index');
});



router.get("/admin", login, (req, res) => {
  fs.readdir(publicPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('ERR');
    }

    const fileDetails = files.map(file => {
      const filePath = path.join(publicPath, file);
      const stats = fs.statSync(filePath);

      return {
        delete: file,
        name: file,
        size: formatFileSize(stats.size),
        created: formatDate(stats.birthtime)
      };
    });

    res.render('admin', { files: fileDetails, });
  });
});



router.post("/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  if (name === config.username && password === config.username) {
    req.session.user = name;
    res.redirect("/admin");
  } else {
    console.log('--------------------------------');
    console.log(config.username);
    console.log(config.password);
    console.log('--------------------------------');
    console.log(name);
    console.log(password);
    console.log('--------------------------------');
    res.redirect("/");
  }
});




router.post('/storage/uploads/file', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('Başarısız oldu');
    return;
  }
  res.send('Yüklendi');
});


router.get('/storage/uploads', (req, res) => {
  res.send(uploadedFiles);
});



router.post('/storage/delete/:id', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(publicPath, id);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).send('Bulunmadı');
      } else {
        res.status(500).send('Hata');
      }
      return;
    }

    if (stats.isDirectory()) {
      fs.rmdir(filePath, { recursive: true }, (err) => {
        if (err) {
          res.status(500).send('Hata');
        } else {
          res.send('Silindi.');
        }
      });
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(500).send('Hata');
        } else {
          res.send('Silindi');
        }
      });
    }
  });
});




router.post('/storage/download/:id', (req, res) => {
  const id = req.params.id;
  const filePath = path.join(publicPath, id);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
});


module.exports = router;