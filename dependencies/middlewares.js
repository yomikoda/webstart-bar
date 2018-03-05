const User = require('../models/user');
const Bar = require('../models/bar');
const config = require('../dependencies/config');
const jwt = require('jsonwebtoken');

const err401 = 'Accès non autorisé.';

module.exports = {
  checkBodyRequest: (property) => {
    return (req, res, next) => {
      if (req.body[property] === undefined ) {
        console.log(`ERROR : missing property ${property}`);
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      } else {
        next();
      }
    }
  },

  checkExistingUserEmail: (req, res, next) => {
    req.body.email = req.body.email.toLocaleLowerCase().trim();
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      } else if (user) {
        console.log('inside check email', user);
        return res.status(500).json({
          success: false,
          message: 'Cet e-mail est déjà utilisé, merci d’en choisir un autre.'
        });      
      } else { next() }
    });
  },
  
  checkExistingUserNickname: (req, res, next) => {
    req.body.nickname = req.body.nickname.toLocaleUpperCase().trim();
    User.findOne({ nickname: req.body.nickname }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      } else if (user) {
        return res.status(500).json({
          success: false,
          message: 'Ce nom d’utilisateur est déjà utilisé, merci d’en choisir un autre.'
        });      
      } else { next() }
    });
  },

  findUser: (req, res, next) => {
    req.body.email = req.body.email.toLocaleLowerCase().trim();
    User.findOne({ email: req.body.email, password: req.body.password }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      } else if (user) {
        req.body.nickname = user.nickname;      
        req.body.role = user.role;
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: 'Identifiants incorrects.'
        });       
      }
    });
  },

  getUserRoleInToken: (req, res, next) => {
    if (!req.header('Authorization')) {
      return res.status(401).json({
        success: false,
        message: err401,
        
      });              
    }
    const authorizationParts = req.header('Authorization').split(' ');
    let token = authorizationParts[1];
    const decodedToken = jwt.verify(
      token,
      config.jwtSecret,
      (err, decodedToken) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: err401
          });              
        } else {
          req.body.role = decodedToken.role;
          
          next();
        }
      }
    );
  },

  checkUserRole: (role = 'admin' || 'member') => {
    return (req, res, next) => {
      if (role !== req.body.role) {
        return res.status(401).json({
          success: false,
          message: err401
        });                
      } else {
        next();
      }
    }
  },

  checkUserRoleFromArray: (rolesArray) => {
    return (req, res, next) => {
      let auth = undefined;
      const reqBodyRole = () => req.body.role;
      for (const role of rolesArray){
        if(rolesArray.find(reqBodyRole)){
          auth=true;
        };
        
      }
      if(!auth){
        return res.status(401).json({
          success : false,
          message : err401
        });
      }else{
        console.log('GET USER ROLE FROM ARRAY');
        next();
      }
      
    }
  },

  checkExistingBarName: (req, res, next) => {
    req.body.name = req.body.name.toLocaleLowerCase().trim();
    Bar.findOne({ name: req.body.name }, (err, bar) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      } else if (bar) {
        console.log('inside check name', bar);
        return res.status(500).json({
          success: false,
          message: 'Ce nom de bar est déja exisatant.'
        });      
      } else { next(); }
    });
  }
}  


