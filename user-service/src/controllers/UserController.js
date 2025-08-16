import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] }, // Exclure le mot de passe
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const register = async (req, res) => {
  const { username, email, password, role, avatarId } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,  
      avatarId: avatarId || 1,            
      role: role || 'USER',
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

export const getAnonymUser = async (req, res) => {
  const anonymousUser = {
    id: null, 
    username: 'Anonyme',
    role: 'ANONYMOUS',
    avatar: 'default_avatar.png',
    position: { map: 'reception', x: 300, y: 400 },
  };
  return res.json(anonymousUser);
};

// route: PATCH /api/users/:id/avatar
export const updateUserAvatar = async (req, res) => {
  const { id } = req.params;       // id du user
  const { avatarId } = req.body;   // nouvel avatar à associer

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.avatarId = avatarId;
    await user.save();

    return res.json({ message: 'Avatar updated', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating avatar', error });
  }
};

// route: GET /api/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const testToken = async (req, res) => {
  try {
    console.log('User service : test token : ', req)
    return res.json('TOKEN OK')
  } catch (error) {
    return res.status(500).json({ message: 'Error with token\'s role', error });
  }
}
