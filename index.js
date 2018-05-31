const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cors = require('cors');

// require('./models/Product');

mongoose.connect(keys.mongoURI, () => {
  console.log('Successfully connected to DB!');
});

const app = express();
app.use(cors());

require('./routes/apiRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log(`Server started running on port ${PORT}...`); 