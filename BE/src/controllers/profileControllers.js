import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../database/client.js';
import { farmers, buyers, notifications } from '../database/schema.js';
import { transporter } from '../config/nodemailer.js';

// Get profile
export const getProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const table = role === 'buyer' ? buyers : farmers;
    
    const user = await db.select().from(table).where(eq(table.id, parseInt(userId)));
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password
    const { password, ...userData } = user[0];
    res.status(200).json(userData);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const updateData = { ...req.body };
    const table = role === 'buyer' ? buyers : farmers;
    
    // Don't allow password update through this endpoint
    delete updateData.password;
    delete updateData.id;
    
    const result = await db.update(table)
      .set(updateData)
      .where(eq(table.id, parseInt(userId)))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create notification
    await db.insert(notifications).values({
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      type: 'profile_update',
      farmerId: role === 'farmer' ? parseInt(userId) : null,
      buyerId: role === 'buyer' ? parseInt(userId) : null,
    });
    
    // Send email notification
    const user = result[0];
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Profile Updated - Smart Agro Companion',
        html: `
          <h2>Profile Updated</h2>
          <p>Your profile has been successfully updated.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
        `,
      });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }
    
    const { password, ...userData } = result[0];
    res.status(200).json({ message: 'Profile updated successfully', user: userData });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const { currentPassword, newPassword } = req.body;
    const table = role === 'buyer' ? buyers : farmers;
    
    // Get user
    const user = await db.select().from(table).where(eq(table.id, parseInt(userId)));
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.update(table)
      .set({ password: hashedPassword })
      .where(eq(table.id, parseInt(userId)));
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const { password } = req.body; // Require password confirmation
    const table = role === 'buyer' ? buyers : farmers;
    
    // Get user
    const user = await db.select().from(table).where(eq(table.id, parseInt(userId)));
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }
    
    // Delete user
    await db.delete(table).where(eq(table.id, parseInt(userId)));
    
    res.status(200).json({ message: 'Profile deleted successfully', redirectToSignup: true });
  } catch (err) {
    console.error('Delete profile error:', err);
    res.status(500).json({ error: err.message });
  }
};

