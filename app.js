require('dotenv').config();
require('express-async-errors');

const path = require('path');
// extra security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require("cors");
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);


app.use(express.json());
app.use(helmet());

app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(
  cors({
    methods: "GET, POST, PUT,PATCH,DELETE",
    origin:"*"

  })
);
// app.use((req, res, next) => {
//   console.log("origin ", req.headers.origin);
//   let allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];
//   let origin = req.headers.origin;
//   if (allowedOrigins.indexOf(origin) > -1) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH,DELETE");
//   res.header("Access-Control-Allow-Credentials", "TRUE");
//   res.header("X-XSS-Protection", "1; mode=block");
//   res.header("Strict-Transport-Security", "max-age=31536000");
//   res.header("X-Frame-Options", "SAMEORIGIN");
//   res.header("X-Content-Type-Options", "nosniff");

//   if (res.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//     return res.status(204).json({});
//   }
//   next();
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
