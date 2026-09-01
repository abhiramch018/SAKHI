require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@sakhi.com";
        const password = "Admin@12345";

        const existingAdmin = await User.findOne({
            email
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const admin = await User.create({
            name: "SAKHI Admin",
            email,
            phone: "9999999999",
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Password:", password);
        console.log("Role:", admin.role);

        process.exit(0);
    } catch (error) {
        console.error(
            "Failed to create admin:",
            error.message
        );

        process.exit(1);
    }
};

createAdmin();