const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("./model/User"); 
const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  
  const resetToken = user.generateResetToken();
  await user.save();

  // Trimite email de resetare
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
  

  const resetUrl = `https://localhost:5173/reset-password/${resetToken}`;

  try {
    await transporter.sendMail({
        to: user.email,
       // to: 'ruxi.andro@gmail.com',
        from: process.env.EMAIL_USER, 
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    res.status(200).json({ message: "Password reset email sent" });
} catch (error) {
    res.status(500).json({ message: "Failed to send email", error: error.message });
}

});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log('Reset password request received');
  console.log('Token:', token);
  console.log('Password:', password);

  
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  /*const user = await User.findOne({
    resetPasswordToken: crypto.createHash('sha256').update(token).digest('hex'),
    resetPasswordExpires: { $gt: Date.now() },
  });*/

  if (!user) {
   // console.log('Invalid or expired token');
    return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
  }

 //actualizare parola
 user.password = password;
  console.log("New hashed password:",  user.password);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  console.log('Password before save:', user.password);
  await user.save();
  console.log('Password after save:', user.password);

  console.log('Password reset successfully');
  res.status(200).json({ message: 'Password has been reset' });
});

router.post('/confirm-reservation', async (req, res) => {
  const { userEmail, reservationDetails } = req.body;

 
  if (!userEmail || !reservationDetails) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { roomId, checkInDate, checkOutDate, guests, totalCost } = reservationDetails;
  const confirmationUrl = `https://localhost:5173/confirmation/${roomId}`;

  try {
    await transporter.sendMail({
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: "Reservation Confirmation",
      html: `<p>Your reservation for Room ID: ${roomId} has been confirmed.</p>
             <p>Check-In Date: ${checkInDate}</p>
             <p>Check-Out Date: ${checkOutDate}</p>
             <p>Number of Guests: ${guests}</p>
             <p>Total Cost: $${totalCost}</p>
             <p>For more details, visit <a href="${confirmationUrl}">this link</a>.</p>`,
    });
    res.status(200).json({ message: "Reservation confirmation email sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send confirmation email", error: error.message });
  }
});

module.exports = router;
