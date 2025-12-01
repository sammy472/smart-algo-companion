import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import db from '../database/client.js';
import { farmers, buyers, passwordResetTokens, notifications } from '../database/schema.js';
import { transporter } from '../config/nodemailer.js';

//Helper to get table based on role
const getTableByRole = (role) => {
  if (role === 'Buyer') return buyers;
  return farmers;
};

//SIGN UP (REGISTER)
export const signup = async (req, res) => {
  const { name, email, password, phone, address, location, city, country, userType } = req.body;
  console.log(req.body);
  const table = getTableByRole(userType);
  try {
    const existingUser = await db.select().from(table).where(eq(table.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} with that email already exists`,
        success: true,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.insert(table).values({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      location,
      city,
      country,
      dateCreated: new Date(),
    }).returning();
    
    // Create system notification for profile creation
    const userId = result[0].id;
    await db.insert(notifications).values({
      title: 'Account Created',
      message: 'Your account has been successfully created.',
      type: 'system',
      farmerId: userType === 'Farmer' ? userId : null,
      buyerId: userType === 'Buyer' ? userId : null,
    });
    
    return res.status(201).json({
      message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} registered successfully. Please login.`,
      success: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Signup failed.\n' + error.message, success: false });
  }
};

//LOCAL LOGIN (handled via passport)
export const login = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const role = req.user.role || 'farmer';
  res.status(200).json({
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
    user: req.user,
  });
};

// LOGOUT
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful', sessionDestroyed: true });
    });
  });
};

// REQUEST PASSWORD RESET (Send email with token)
export const requestPasswordReset = async (req, res) => {
  const { email, role } = req.body;
  const table = getTableByRole(role);
  
  try {
    const user = await db.select().from(table).where(eq(table.email, email));
    if (user.length === 0) {
      // Don't reveal if user exists for security
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing tokens for this email
    await db.delete(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.email, email),
        eq(passwordResetTokens.role, role)
      ));

    // Create new token
    await db.insert(passwordResetTokens).values({
      email,
      token,
      role,
      expiresAt,
    });

    // Send email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&role=${role}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Smart Agro Companion',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
          Reset Password
        </a>
        <p>This link will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Create notification
    const userId = user[0].id;
    await db.insert(notifications).values({
      title: 'Password Reset Requested',
      message: 'A password reset link has been sent to your email.',
      type: 'password_reset',
      farmerId: role === 'farmer' ? userId : null,
      buyerId: role === 'buyer' ? userId : null,
    });

    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

// RESET PASSWORD WITH TOKEN
export const resetPassword = async (req, res) => {
  const { token, newPassword, role } = req.body;
  
  try {
    // Find valid token
    const resetToken = await db.select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.role, role),
        eq(passwordResetTokens.used, false)
      ));

    if (resetToken.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const tokenData = resetToken[0];

    // Check if token is expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Update password
    const table = getTableByRole(role);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.update(table)
      .set({ password: hashedPassword })
      .where(eq(table.email, tokenData.email));

    // Mark token as used
    await db.update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenData.id));

    // Get user for notification
    const user = await db.select().from(table).where(eq(table.email, tokenData.email));
    
    // Check if user exists (race condition protection)
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userId = user[0].id;

    // Create notification
    await db.insert(notifications).values({
      title: 'Password Reset Successful',
      message: 'Your password has been successfully reset.',
      type: 'password_reset',
      farmerId: role === 'farmer' ? userId : null,
      buyerId: role === 'buyer' ? userId : null,
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// OAUTH SUCCESS HANDLER (Google / Facebook)
export const oauthSuccess = (req, res) => {
  if (req.user) {
    const role = req.user.role || 'farmer';
    res.status(200).json({ message: `${role} OAuth login successful`, user: req.user });
  } else {
    res.status(401).json({ error: 'OAuth login failed' });
  }
};
