const express = require('express');
const User = require('./model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/register', async(req,res) =>{
    console.log(req.body);
    const { username, password,email, role } = req.body;

    try{
        const user = new User({username,password,email,role});
        await user.save();
        res.status(201).send('User registered');

    }catch(error){
      if (error.code === 11000) { // Cod pentru duplicare în MongoDB
        res.status(400).json({ message: 'Duplicate key error' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
});

/*router.post('/login', async(req,res) => {
    const{ username, password} = req.body;
    try{
        const user = await User.findOne({username}); //metoda din Mongoose
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = user.generateAuthToken();
        console.log(token);
        res.status(200).json({
            token: token,
            role: user.role 
        });
    }catch(error){
        res.status(500).json({ message: 'Server error' });
    }

});*/

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generează token și răspunde
      const token = user.generateAuthToken();
      res.json({ token, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;