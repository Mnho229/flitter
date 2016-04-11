var express = require('express'); //Allows use of Express framework/library
var bodyParser = require('body-parser'); //Library that helps parse content sent from the client-side
var database = require('./database'); //Allows access to Database.JS file
var RSVP = require('rsvp'); //Allows the use of Promises
var router = express.Router(); //Used to create modular mountable route handlers
var urlencodedParser = bodyParser.urlencoded({ extended: false }); //Helps parse content sent from Client-side
var globalusersession= ""; //Whoever is logged in after authenticate is called

// POST Request for the log-in page
router.post('/', urlencodedParser, function(req, res) {

    var username = req.body.user; //grabs form data from client-side
    var password = req.body.pass;
    
    //Calls async request while waiting on the attached promise
    var loginflag = database.authenticate(username, password).then(function(value) {
        
        //If successful, then set whoever logged in as current user and go to the main page
        globalusersession = value;
        res.redirect('/main');

    }, function(value) {
        //if unsuccessful
        res.redirect('/');
    });
    
});

//Handle POST Request from the register page and adds follower of the registeree itself
router.post('/register', urlencodedParser, function(req, res) {

    var username = req.body.user;
    var password = req.body.pass;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var location = req.body.location;

    var register = database.registerUser(username, password, fname, lname, location).then(function(value) {
        database.ownFollower(value).then(function(value1) {
            res.redirect('/'); //go back to login page if successful
        }, function(value1) {
            res.redirect('/register');
        });
    }, function(value) {
        res.redirect('/register');
    });

});
//Handles GET request for the webpage
router.get('/register', function(req, res) {
    res.render('./pages/register');
});

router.get('/', function(req, res) {
    res.render('./pages/index');
});

router.get('/main', function(req, res) {
    res.render('./pages/main');
});

//handles POST request for generating Fleets on the fly
router.post('/generateFleets', urlencodedParser, function(req, res) {

    var fleetObject = database.grabFleets(globalusersession,req.body.limit,req.body.offset).then(function(value) {
        res.send(value);

    }, function(value) {

    });
    
});

// POST request adding a fleet
router.post('/fleet', urlencodedParser, function(req, res) {

    var fleet = database.addFleet(globalusersession, req.body.content).then(function(value) {
        res.send("Fleet added");
    }, function(value) {
        res.send("Fleet not added");
    });
});

// POST request to show current user followers
router.post('/showfollowers', urlencodedParser, function(req, res) {
    var followers = database.showFollowers(globalusersession).then(function(value) {
        res.send(value);
    }, function(value) {
        res.send(value);
    });
});

// POST request for removing a follower
router.post('/removefollower', urlencodedParser, function(req, res) {

    var remove = database.removeFollower(globalusersession, req.body.content).then(function(value) {
        res.send(value);
    }, function(value) {
        res.send(value);
    });
});

// POST request for Fleeters who have not been followed
router.post('/suggestions', urlencodedParser, function(req, res) {
    var suggest = database.suggestFollowers(globalusersession).then(function(value) {
        res.send(value);
    }, function(value) {
        res.send(value);
    });
});

// POST request to follow a Fleeter
router.post('/follow', urlencodedParser, function(req, res) {

    var follow = database.followThis(globalusersession, req.body.content).then(function(value) {
        res.send(value);
    }, function(value) {
        res.send(value);
    });
});

// Log out of the session
router.post('/logout', urlencodedParser, function(req, res) {
    globalusersession = "";
    res.send({redirect: '/'});
});

//POST request for showing who the current session is
router.post('/currProfile', urlencodedParser, function(req, res) {
    var profile = database.getProfile(globalusersession).then(function(value) {
        res.send(value);
    }, function(value) {
        res.send(value);
    });
});

module.exports = router; //exports out 'router' so app.js can use it