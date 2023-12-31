const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const connectUrl = 'mongodb://admin1:admin@ac-bohzfp6-shard-00-00.hbabs6g.mongodb.net:27017,ac-bohzfp6-shard-00-01.hbabs6g.mongodb.net:27017,ac-bohzfp6-shard-00-02.hbabs6g.mongodb.net:27017/?ssl=true&replicaSet=atlas-qbgl4j-shard-0&authSource=admin&retryWrites=true&w=majority';
const connectConfig = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true 
}

mongoose.connect(connectUrl, connectConfig)
  .then(() => {
    console.log('+++ Database connected! +++');
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });