import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminName = process.env.ADMIN_NAME || "Admin User";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      console.log(`Updated existing user (${adminEmail}) to admin role.`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin user created successfully: ${adminEmail}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
    process.exit(1);
  }
};

seedAdmin();
