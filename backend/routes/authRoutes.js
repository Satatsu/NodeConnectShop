const express = require('express');
const authController = require('../controller/authController');
const app = express();

app.post('/signup',authController.signup_post);
app.delete('/deleteAll', authController.deleteAll_delete);
app.get('/users', authController.getAll_get);
app.delete('/deleteById/:id', authController.deleteId_delete);
app.put('/editUser/:id', authController.editUser_put);
app.put('/editPassword/:email', authController.editPassword_put);
app.put('/editPasswordConnect', authController.editPasswordConnect_put);
app.post('/login', authController.login_post);
app.post('/verify', authController.verify_post);
module.exports = app;

