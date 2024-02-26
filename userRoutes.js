const express = require('express');
// joi used to validate schema
const Joi = require('joi');
const User = require('./model/User');
const jwt = require('jsonwebtoken');





const router = express.Router();

// Validation schema for user signup using joi
const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  // Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

  // API endpoint for user signup

  router.post('/signup',async(req,res)=>{
    try {
        // Validate request body using joi
        const { error } = signupSchema.validate(req.body);
        if (error) {
          return res.status(401).json({ message: error.details[0].message });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
          }

          const newUser = new User({ username, email, password });

          await newUser.save();
          res.status(201).json(newUser);

        } catch (err) {
            res.status(500).json({ message: err.message });
          }

  })




  // API endpoint for user login

  router.post('/login', async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords (in plain text)
    if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }

         // Generate JWT token
         const token = jwt.sign({ userId: user._id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

    
  
      res.status(200).json({ message: 'Login successful',token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  module.exports = router;
