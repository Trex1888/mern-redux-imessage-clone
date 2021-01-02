import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 9000,
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost/mern",
  SECRET_KEY: process.env.SECRET_KEY || "secret",
};
