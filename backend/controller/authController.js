const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { response } = require('../routes/authRoutes');


module.exports.deleteAll_delete = async (req, res) => {
  try {
    const deleteAll = await User.deleteMany({})
    res.status(200).json(deleteAll);
  } catch (error) {
    res.status(400).json(error.message)
  }

}

module.exports.getAll_get = async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message)
  }
}
module.exports.deleteId_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message)
  }
}
module.exports.editUser_put = async (req, res) => {
  try {
    const id = req.params.id;
    const findandUpdate = await User.findByIdAndUpdate(id, req.body);
    const user = await User.findById(id)
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
}

//1
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', { expiresIn: maxAge });
};
module.exports.signup_post = async (req, res) => {
  const { email, password, confirmed } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email address.' });
    }
    if (confirmed === false) {
      return res.status(400).json({ error: 'The passwords are not exactly the same.' });
    }
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    // Set cookies
    res.cookie('jwt', token, { maxAge: maxAge * 1000, sameSite: 'Strict', secure: true, domain: 'localhost' });

    res.status(201).json({ user: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });


  }
};

//4 const { verifyToken, createCurrentUserCookie } = require('./path/to/authUtils'); // Assuming you have the verifyToken function and createCurrentUserCookie function in authUtils.js

module.exports.login_post = async (req, res) => {
  console.log(req.body);
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // Verify token and set cookie for the current user
    await verifyToken(token, res);
    const ageToken = rememberMe ? 3 * 24 * 60 * 60 : null;
    res.cookie('jwt', token, { maxAge: ageToken, sameSite: 'Strict', secure: true, domain: 'localhost' });
    res.status(200).json({ user: user._id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const verifyToken = async (token, res) => {
  try {
    const decodedToken = await jwt.verify(token, 'net ninja secret');
    console.log('Decoded Token:', decodedToken);
    const decodedUser = await User.findById(decodedToken.id);
    console.log('Decoded User:', decodedUser);
  } catch (err) {
    console.error('Erreur de vérification du token :', err.message);
    res.status(401).json({ error: 'Erreur de vérification du token' });
  }
};

const fs = require('fs').promises;

module.exports.verify_post = async (req, res) => {
  const token = req.body.token;
  console.log('mon token :', token);
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  try {
    const decoded = jwt.verify(token, 'net ninja secret');
    const user = await User.findById(decoded.id);
    user.password = undefined;
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (user.avatar) {
      const avatarContent = await fs.readFile(user.avatar, { encoding: 'base64' });
      return res.status(200).json({ message: 'Token valide', user: { user, avatar: avatarContent } });
    }
    res.status(200).json({ message: 'Token valide', user: { user: user } });


  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports.editPassword_put = async (req, res) => {
  try {
    const email = req.params.email;
    const newPassword = req.body.password;
    if (newPassword.length >= 8) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      return res.status(200).json({ redirect: true, message: 'Mot de passe mis à jour avec succès.' });
    } else {
      return res.status(400).json({ redirect: false, message: 'Échec de la mise à jour du mot de passe.' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};


module.exports.editPasswordConnect_put = async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'Token absent' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    const decoded = jwt.verify(token, 'net ninja secret');
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { _id: decoded.id },
      { password: hashedPassword },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

