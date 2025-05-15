const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const printRoutes = require('./routes/print');
const queueRoutes = require('./routes/queue');
const vendorRoutes = require('./routes/vendor');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/print', printRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/vendor', vendorRoutes);

app.get('/', (req, res) => {
  res.send('QueueBot backend running');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
