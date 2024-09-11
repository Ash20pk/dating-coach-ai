import connectDB from '../../utils/connectDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectDB();
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ 
        name, 
        email, 
        password: hashedPassword,
        onboardingComplete: false  // Ensure this field is set for new users
      });
      await user.save();

      // Generate token for the new user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(201).json({ 
        message: "User created successfully",
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          onboardingComplete: user.onboardingComplete 
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}