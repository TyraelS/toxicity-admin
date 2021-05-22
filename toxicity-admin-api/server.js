const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const app = express();


connectDB();

app.get('/', (req, res) => {
  res.send('API Running');
});

var corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//Init Middleware

app.use(express.json({ extended: false }));
app.use(cors(corsOptions));

//Define routes

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
