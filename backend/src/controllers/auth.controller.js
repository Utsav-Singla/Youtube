import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */

const registerUser = async (req, res) => {
  try {
    // 1️⃣ Extract data from request body
    const { name, email, password } = req.body;

    // 2️⃣ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // 3️⃣ Validate email format (basic but effective)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // 4️⃣ Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 5️⃣ Check if user already exists
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // 6️⃣ Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 7️⃣ Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // 8️⃣ Send safe response (NO password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    // 9️⃣ Handle Mongo duplicate key error (extra safety)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // 🔟 Fallback server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { registerUser };
