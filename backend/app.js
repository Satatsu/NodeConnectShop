const cors = require('cors');
const User = require('../backend/model/User');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');
const app = express();

//autorization d'un autre site pour les requetes
// const corsOptions = {
//     origin: 'http://localhost:5501', // Replace with your actual frontend domain
//     methods: 'POST', // Add other methods if needed
//     optionsSuccessStatus: 204,
//   };
//cors par default accept tt les requete demander par fetch ou axiox
// app.use(cors());


 const corsOptions = {
  origin: 'http://localhost:5501', // site frontend
  credentials: true,
  //active les requete de transfer de cookie dans le port origin
};

app.use(cors(corsOptions));
// app.use(express.static('../frontend/public'));
app.use(express.json());
//permet de lire les cookie
app.use(cookieParser());
app.get('/*', requireAuth);
app.get('http://localhost:5501/frontend/public/src/index.html', requireAuth);
app.use(authRoutes)


//middleware
// app.use(checkUser);
// app.use(requireAuth);
// app.use(express.static('../frontend/public/src/index.html'));



//La ligne app.use(express.static('public')); permet d'activer le middleware pour servir les fichiers statiques du répertoire public. Cela signifie que les fichiers situés dans ce répertoire seront accessibles par le serveur.
// app.set('view engine', 'html');
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/src/index.html');
// });
// app.get('/signup', (req, res) => {
//     res.sendFile(__dirname + '/public/src/signup.html');
// });
// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + '/public/src/login.html');
// });

// Configurez Multer pour gérer le téléchargement d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les images seront stockées
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nommez le fichier avec un horodatage unique
  }
});
const jwt = require('jsonwebtoken');
const upload = multer({ storage: storage });
app.post('/uploads', upload.single('avatar'), async (req, res) => { 
  const token = req.cookies.jwt;
if (!token) {
  return res.status(401).json({ message: 'Token absent' });
}
  try {
    const decoded = jwt.verify(token, 'net ninja secret');
    console.log(decoded.id, 'ddd');
    const decodedUser = await User.findById(decoded.id);
    console.log(decodedUser);
    const user = await User.findOneAndUpdate({ _id: decodedUser._id }, { avatar: req.file.path }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({ message: 'Image téléchargée avec succès', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image' });
  }
});

port = 3000
mongoose.connect('mongodb+srv://ikawarixio:1234@cluster0.hsmlq0e.mongodb.net/?retryWrites=true&w=majority').then(() => {
    app.listen(port, () => {  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode.`); })
   // serveur.listen(3000, () => { console.log('Server is running on port 3000') })
}).catch(err => console.log(err));

app.get('/set-cookies', (req, res) => { 
  //doc.cookie pour voir les cookie existants
   //res.setHeader('Set-Cookie', 'newUser=true');
   //des que le navigateur est fermer le cookie expire
   res.cookie('newUser', 'false');
   //meme si le navigateur est fermer temps que le cooldown n'est pas ecouler le cookie continue
   res.cookie('isEmploye', 'false', { maxAge: 1000 * 60 * 60 * 24, secure: false , httpOnly: true 
  });
   res.send('you got the cookies');
});
app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);
}); 


// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: 'image',
//   filename: function(req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'photo-' + uniqueSuffix + '.jpg');
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|jpg)$/)) {
//       return cb(new Error('Please upload a Word document or a JPEG image'));
//     }
//     cb(null, true);
//   }
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send({
//     message: 'File uploaded successfully',
//     file: req.file // This contains information about the uploaded file
//   });
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message });
// });


