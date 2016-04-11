var mysql = require('mysql'); //MySQL Enabler
var RSVP = require('rsvp'); //Promise Support

//Connection to the MySQL HOST
var connection = mysql.createConnection({
    host : '*',
    user : '*',
    password : '*',
    database : '*'
});

//Query for existing Fleeter
var authenticate = function(user, pass)
{
    // Allows async request to be handled properly via resolve and reject callback
    return new RSVP.Promise(function(resolve, reject) {
        //NOTE: connection.escape(param) puts in the param in the query with quotes around it while also preventing SQL Injection Attacks.
        var query = connection.query('SELECT * FROM Fleeters WHERE username = ' + connection.escape(user) + ' && password = ' + connection.escape(pass), function(error, rows, fields) {
            
            if (error) {throw error;}
            if (!rows.length) //If no such user exists
            {
                reject(rows);
            }
            else {
                resolve(rows[0].pid); //send the pid with the rows grabbed from SQL query
            }
        });
        
    });
};

//Query to Register a user
var registerUser = function(user, pass, fname, lname, loc)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query("INSERT INTO Fleeters(username, password, fname, lname, location) VALUES (" + connection.escape(user) + ", " + connection.escape(pass) + ", " + connection.escape(fname) + ", " + connection.escape(lname) + ", " + connection.escape(loc) + ")", function(error) {
            
            if (error) 
            {
                reject(error);
            }
            
        });
        connection.query("SELECT pid FROM Fleeters WHERE username = " + connection.escape(user), function(error, rows, fields) {
            if (error)
            {
                throw error;
            }
            else
            {
                resolve(rows[0].pid);
            }
        });
    });
};

//Query to make new user a follower of itself
var ownFollower = function(pid)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query("INSERT INTO Followers(followerid, followeeid) VALUES (" + connection.escape(pid) + ", " + connection.escape(pid) + ")", function(error) {
            if (error)
            {
                reject(error);
            }
            else
            {
                resolve(1)
            }
        });
    });
}

//Query to make a profile in the left navbar
var getProfile = function(pid)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query("SELECT username, fname, lname FROM Fleeters WHERE pid =" + connection.escape(pid), function(error, rows, fields) {
            if (error)
            {
                throw error;
            }
            if (!rows.length)
            {
                reject("No User! Please log in properly!");
            }
            else
            {
                resolve(rows);
            }
        });
    });
}

//Getting fleets with constraints in mind
var grabFleets = function(currID, limit, offset)
{
    var constraint;
    if (limit <= 0 && offset <= 0)
    {
        constraint = "";
    }
    else if (limit > 0 && offset <= 0)
    {
        constraint = " LIMIT " + limit;
    }
    else if (limit <= 0 && offset > 0)
    {
        constraint = " LIMIT " + 9999999999 + " OFFSET " + offset;
    }
    else 
    {
        constraint = " LIMIT " + limit + " OFFSET " + offset;
    }
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query('SELECT content, username FROM Fleets NATURAL JOIN Followers NATURAL JOIN Fleeters WHERE followeeid = uid AND pid = uid AND followerid = ' + connection.escape(currID) + ' ORDER BY fid desc ' + constraint, function(error, rows, fields) {

            if (error) {throw error;}
            if (!rows.length)
            {
                reject(rows);
            }
            else 
            {
                resolve(rows);
            }
        });
    });
};

//Add a fleet QUERY
var addFleet = function(currID, contentToAdd)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query('INSERT INTO Fleets(content, uid) VALUES (' + connection.escape(contentToAdd) + ',' + connection.escape(currID) +')', function(error) {

            if (error) 
            {
                reject(error)
                throw error;
            }
            else
            {
                resolve("Fleet added!");
            }


        });
    });
};

//Show followers QUERY
var showFollowers = function(currID)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query('SELECT pid, username, fname, lname, location FROM Fleeters NATURAL JOIN Followers WHERE Fleeters.pid = Followers.followeeid AND followerid = ' + connection.escape(currID) + ' AND followeeid NOT LIKE ' + connection.escape(currID), function(error, rows, fields) {

            if (error) 
            {
                throw error;
            }
            if (!rows.length)
            {
                reject(0);
            }
            else
            {
                resolve(rows);
            }
        });
    });
};

//Remove a follower query
var removeFollower = function(currID, unfollowID)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query('DELETE FROM Followers WHERE followerid = ' + connection.escape(currID) + ' AND followeeid = ' + connection.escape(unfollowID), function(error) {

            if (error) 
            {
                throw error;
                reject(error);
            }
            else
            {
                resolve("Unfollowed! Press refresh the Followers by clicking on Current Followers!");
            }
        });
    });
};

//Show unadded followers QUERY
var suggestFollowers = function(currID)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query("SELECT Fleeters.* FROM Fleeters WHERE Fleeters.pid NOT IN (SELECT pid FROM Fleeters NATURAL JOIN Followers WHERE pid = followeeid AND Followerid = " + connection.escape(currID) + ")", function(error, rows, fields) {

            if (error) 
            {
                throw error;
            }
            if (!rows.length)
            {
                reject(0);
            }
            else
            {
                resolve(rows);
            }
        });
    });
};

//Add a follower QUERY
var followThis = function(currID, followID)
{
    return new RSVP.Promise(function(resolve, reject) {

        var query = connection.query('INSERT INTO Followers(followerid, followeeid) VALUES (' + connection.escape(currID) + ', ' + connection.escape(followID) + ')', function(error) {

            if (error) 
            {
                throw error;
                reject(error);
            }
            else
            {
                resolve("Followed! Press refresh the Followers by clicking on Current Followers!");
            }
        });
    });
};
//Allows use of functions outside of file
module.exports.authenticate = authenticate;
module.exports.grabFleets = grabFleets;
module.exports.addFleet = addFleet;
module.exports.showFollowers = showFollowers;
module.exports.removeFollower = removeFollower;
module.exports.registerUser = registerUser;
module.exports.ownFollower = ownFollower;
module.exports.suggestFollowers = suggestFollowers;
module.exports.followThis = followThis;
module.exports.getProfile = getProfile;

