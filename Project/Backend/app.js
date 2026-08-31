const express = require("express");
const cors = require("cors");

const awwRoutes = require("./routes/aww.routes");
const beneficiaryRoutes = require("./routes/beneficiary.routes");
const counsellingRoutes = require("./routes/counselling.routes");
const decisionTreeRoutes = require("./routes/decisionTree.routes");
const aiRoutes = require("./routes/ai.routes");
const chatRoutes = require("./routes/chat.routes");
const reportRoutes = require("./routes/report.routes");




const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/awws", awwRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/counselling", counsellingRoutes);
app.use("/api/decision-tree", decisionTreeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AWW Counselling Platform API is running"
    });
});

module.exports = app;