let express = require('express');
let router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/users/new', function (req, res) {
    res.render('signup.ejs', {
        title: 'Create User Account',
        // errors: req.flash('errors')
    });
});

router.post('/users', function (req, res) {
    const params = req.body;

  
    const user = new User({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        countryCode: '91',
        password: params.password
    });

    user.save(function(err, doc) {
        if (err) {
           
            res.redirect('/users/new');
        } else {
           
            user.sendAuthyToken(function(err) {
                if (err) {
                     req.flash('errors', 'There was a problem sending your token - sorry :(');
                }
            
                res.redirect(`/users/${doc._id}/verify`);
            });
        }
    });
});

router.get('/users/:id/verify', function (req, res) {
    res.render('verify.ejs', {
        title: 'Verify Phone Number',
    
        id: req.params.id
    });
});


router.post('/users/:id/resend', function (request, response) {

    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
        
            return die('User not found for this ID.');
        }
      
        user.sendAuthyToken(postSend);
    });

   
    function postSend(err) {
        if (err) {
           
            return die('There was a problem sending you the code - please '
                + 'retry.');
        }

       
        response.redirect('/users/'+request.params.id+'/verify');
    }

    
    function die(message) {
       
        response.redirect('/users/'+request.params.id+'/verify');
    }
});

router.post('/users/:id/verify', function (request, response) {
    let user = {};

    User.findById(request.params.id, function(err, doc) {
        if (err || !doc) {
            return die('User not found for this ID.');
        }

        
        user = doc;
        user.verifyAuthyToken(request.body.code, postVerify);
    });

    
    function postVerify(err) {
        if (err) {
            return die('The token you entered was invalid - please retry.');
        }

        
        user.verified = true;
        user.save(postSave);
    }

  
    function postSave(err) {
        if (err) {
            return die('There was a problem validating your account please enter your token again.');
        }

       
        const message = 'You did it! Signup complete :)';
        user.sendMessage(message, function() {
            
            response.redirect(`/users/${user._id}`);
        }, function(err) {
            
        });
    }
    
    function die(message) {
      
        response.redirect('/users/'+request.params.id+'/verify');
    }
});

router.get('/users/:id', function (request, response, next) {
    User.findById(request.params.id, function(err, user) {
        if (err || !user) {
            return next();
        }
        response.render('main.ejs', {
            title: 'Hi there ' + user.fullName + '!',
            user: user
            
        });
    });
});

module.exports = router;