const User = require("../models/User");

const users = [
  {
    _id: "65b8e564ea5ce114184ccb96",
    name: "demo user",
    email: "demo@gmail.com",
    password:'$2a$10$GH8p5cAsGFEdYsLaSfTQ3e1eUs7KbLmVBltjbX4DDCj2eyO2KW/Ze',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },

  {
    _id: "681b605fc17cc21630dab4af",
    name: "admin",
    email: "admin@gmail.com",
    password:'$2a$10$ZiVYmg0EsGCwE6LWaTZrHukxxoyVUsZp33Agaor98SPJ63ADEAGbm',
    isVerified: true,
    isAdmin: true,
    __v: 0,
  },
  
];

exports.seedUser = async () => {
  try {
    await User.insertMany(users);
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
