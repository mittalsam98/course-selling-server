require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const paymentRoutes = require('./routes/payment');
app.use(bodyParser.json());
app.use(cors());
/// Routes
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', paymentRoutes);

app.get('/ping', function (req, res) {
  return res.send('pong');
});

// Connection
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
