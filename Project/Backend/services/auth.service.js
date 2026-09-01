const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const otpService = require("./otp.service");

const register = async (data) => {
    const { name, email, phone, password, role } = data;

    if (!name || !email || !phone || !password) {
        throw new Error("Name, email, phone, and password are required");
    }

    if (role === "ADMIN") {
        throw new Error("Admin accounts cannot be registered publicly");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await otpService.sendRegistrationOTP({
        email: normalizedEmail,
        name: name.trim(),
        phone: phone.trim(),
        passwordHash
    });

    return {
        email: normalizedEmail
    };
};

const login = async (email, password) => {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};

module.exports = {
    register,
    login
};
