const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/users.routes");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", userRoute);

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
