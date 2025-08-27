import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../database/client.js';
import { farmers, buyers } from '../database/schema.js';

// 👥 Helper to get table based on role
const getTableByRole = (role) => {
  if (role === 'buyer') return buyers;
  return farmers;
};

//SIGN UP (REGISTER)
export const signup = async (req, res) => {
  const { name, email, password, phone_number, address, location, role} = req.body;
  const table = getTableByRole(role);
  try {
    const existingUser = await db.select().from(table).where(eq(table.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: `${role} with that email already exists` });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.insert(table).values({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      location,
      date_created: new Date(),
    }).returning();
    return res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: result[0],
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Signup failed' });
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
  req.logout(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.status(200).json({ message: 'Logout successful' });
  });
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { email, newPassword, role  } = req.body;
  const table = getTableByRole(role);
  try {
    const user = await db.select().from(table).where(eq(table.email, email));
    if (user.length === 0) {
      return res.status(404).json({ error: `${role} not found` });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.update(table).set({ password: hashedPassword }).where(eq(table.email, email));
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
