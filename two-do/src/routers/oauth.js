const express = require('express')
const router =  express.Router()
const passport= require('passport')
const auth = require('../middleware/auth')
const User = require('../models/user')
const app= express();
const auth = require('../middleware/auth')
router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email','openid']
    })
  );
router.get(
    '/auth/callback',// on 2nd call req.user 2nd , app.get 1st
    passport.authenticate('google'),
   async (req, res) => {
    if(req.user.firsttimeentry&&!app.get('user1')){ // first time user not found in db e12,  setting user | firsttimeentry true ////setting ,checking
       app.set('user1',req.user);  //     
       console.log('seeting 1')//+app.get('user1'))
       res.redirect('/auth/google2')//
    }       
    else if(!req.user.firsttimeentry){          
      app.set('user1',null);
      res.redirect('/sal')// logged in
    }
    else if(app.get('user1')){//set
        const profile=app.get('user1'); console.log(app.get('user1')+'is the profile');
//        console.log('now has data of second time user as response and first user as get')
        const user = await new User({ token: profile.token,
            name:profile.name,
            email1:profile.email1,//emails[0].value,
            avatar:profile.avatar,
            email2:req.user.email1,
            name2: req.user.name,
            avatar2: req.user.avatar
          }).save();
          app.set('user1',null)
          console.log(app.get('user1')+'is the profile');
          res.redirect('/auth/google2')// form page
    }
    console.log('not first time')
    }
  );
  router.get(
    '/auth/google2',
    passport.authenticate('google', {
      scope: ['profile', 'email','openid']
    })
  );
  router.get('/sal',auth,(req,res)=>{
  res.send(`<div> auth checked and working</div>`)  })
  /*
  router.get(
    '/auth/callback2',
    passport.authenticate('google'),
    (req, res) => {
        console.log(req.user)
      res.redirect('/people/me');
    }
  );*/
router.get('/logout',auth, (req, res) => {
    req.logout();
    res.redirect('/sal');
  });
module.exports=router