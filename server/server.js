const express = require('express');
const path = require('path');
require('dotenv/config');

const app = express();

// Bring in routes
const authRoute = require('./routes/auth-route');
const apiRoute = require('./routes/api-route');

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/auth', authRoute);
app.use('/api', apiRoute);

// Serve static files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.resolve(__dirname, '../client/dist')));

  // Home endpoint
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });
}

// Global Error handler
app.use((err, req, res, next) => {
  // Set up default error
  const defaultError = {
    log: 'Error caught in global error handler',
    status: 500,
    msg: {
      err: 'Check logs for more information',
    },
  };

  // Update default error message with provided error if there is one
  const output = Object.assign(defaultError, err);

  res.send(output);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
