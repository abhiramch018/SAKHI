const express = require("express");
const cors = require("cors");

const awwRoutes = require("./routes/aww.routes");
const beneficiaryRoutes = require("./routes/beneficiary.routes");
const counsellingRoutes = require("./routes/counselling.routes");
const decisionTreeRoutes = require("./routes/decisionTree.routes");
const aiRoutes = require("./routes/ai.routes");
const chatRoutes = require("./routes/chat.routes");
const reportRoutes = require("./routes/report.routes");
const ruleRoutes = require("./routes/rule.routes");
const performanceRoutes = require("./routes/performance.routes");
const milestoneRoutes = require("./routes/milestone.routes");
const learningRoutes = require("./routes/learning.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const authRoutes = require("./routes/auth.routes");
const otpRoutes = require("./routes/otp.routes");


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
app.use("/api/rules", ruleRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);           
app.get("/", (req, res) => {
    res.json({
        message: "AWW Counselling Platform API is running"
    });
});

module.exports = app;