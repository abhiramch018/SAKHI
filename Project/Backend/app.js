const express = require("express");
const cors = require("cors");

const awwRoutes = require("./routes/aww.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/awws", awwRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AWW Counselling Platform API is running"
    });
});

module.exports = app;