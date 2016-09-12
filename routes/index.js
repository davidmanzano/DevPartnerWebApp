var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');

var app = express();

var router = express.Router();

var UserData = new mongoose.Schema({ name: String, date: String, unprocessedID: String, processedID: String, status: String });
var User = new mongoose.Schema({ username: String, password: String, data: [UserData] })
var UnprocessedData = new mongoose.Schema({ data: String });
var ProcessedData = new mongoose.Schema({ data: String });
var MQip = 'amqp://abc:123@10.4.21.220'


var userName = "";
var userPwd;
var conPwd;
var dataID = "";
var dataName;


/*MD5 Hash Functions*/
function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
    txt = '';
    var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
        tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
}

/* there needs to be support for Unicode here,
* unless we pretend that we can redefine the MD-5
* algorithm for multi-byte characters (perhaps
* by adding every four 16-bit characters and
* shortening the sum to 32 bits). Otherwise
* I suggest performing MD-5 as if every character
* was two bytes--e.g., 0040 0025 = @%--but then
* how will an ordinary MD-5 sum be matched?
* There is no way to standardize text to something
* like UTF-8 before transformation; speed cost is
* utterly prohibitive. The JavaScript standard
* itself needs to look at this: it should start
* providing access to strings as preformed UTF-8
* 8-bit unsigned value arrays.
*/
function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i)
        + (s.charCodeAt(i + 1) << 8)
        + (s.charCodeAt(i + 2) << 16)
        + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++)
        s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
        + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
}

function hex(x) {
    for (var i = 0; i < x.length; i++)
        x[i] = rhex(x[i]);
    return x.join('');
}

function md5(s) {
    return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}


/* GET home page. */
router.get('/', function (req, res, next) {
    // check if user is loggedin, otherwise redirect to userlist page
    res.render('login', { title: 'Login' });
});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* Return to log in page */
router.get('/logout', function (req, res) {
    userName = "";
    dataID = "";
    res.redirect('/');
});

/* Call to determine whether user is logged out (to prevent back button from accessing logged out pages) */
router.post('/backCheck', function (req, res) {
    if (userName == "") {
        res.send(false);
    }
    else {
        res.send(true);
    }
});

/* Call to determine whether user is logged out (to prevent back button from accessing logged out pages) */
router.post('/fullBackCheck', function (req, res) {
    if (userName == "" || dataID == "") {
        res.send(false);
    }
    else {
        res.send(true);
    }
});


/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    if (userName != "") {
        var db = req.db;
        var collection = db.model('usercollection', User, 'usercollection');
        collection.find({ username: userName }, function (e, docs) {
            chechStatusRefresh = true;
            res.render('userlist', {
                "user": docs[0]
            });
            //res.send(userName + "'s Page")
        });
    }
    else {
        res.redirect('/');
    }
});

/* GET New User page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    userName = req.body.username;
    userPwd = req.body.password;
    conPwd = req.body.confirmPassword;

    console.log(req.body);

    // Set our collection
    var collection = db.model('usercollection', User, 'usercollection');
    // Submit to the DB
    if (userName === "" || userPwd === "" || userName.includes(' ') || userPwd.includes(' ')) {
        console.log("Username and Password cannot contain spaces and cannot be blank")
    }

    else if (userPwd != conPwd) {
        console.log(req.body.confirmPassword);
        console.log(userPwd + " " + conPwd);
        console.log("Password must be the same as Confirm Password");
    }
    else {
        collection.find({
            username: userName
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("An error occurred on login.");
            }
            else {
                // And forward to success page
                console.log(doc.length);
                if (doc.length > 0) {
                    console.log("Username already exists!");
                    res.send(false)

                }
                else {
                    collection({ username: userName, password: md5(userPwd) }).save(
                       function (err, doc) {
                           if (err) {
                               // If it failed, return error
                               res.send("There was a problem adding the information to the database.");
                           }
                           else {
                               // And forward to success page
                               console.log(doc);
                               res.send(true);
                           }
                       });
                }
            }
        });
    }
});

/*Login function to check for correct login info*/
router.post('/login', function (req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    userName = req.body.username;
    userPwd = req.body.password;
    console.log(userName + " " + userPwd);

    // Set our collection
    var collection = db.model('usercollection', User, 'usercollection');

    collection.find({
        username: userName,
        password: md5(userPwd)
    })
    .limit(1)
    .lean()
    .exec(function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("An error occurred on login.");
        }
        else {
            // And forward to success page
            var dataToSend = {};
            dataToSend.destination = '/userlist';
            dataToSend.switch = true;

            if (doc.length > 0) {
                if (userName == "admin")
                    dataToSend.destination = '/admin';
                res.send(dataToSend);
            }
            else {
                dataToSend.switch = false;
                res.send(dataToSend);
                console.log("Navigating to Create Account or Incorrect Username/Password");
            }

        }
    });
});

router.post('/loginasadmin', function (req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    //console.log(req.body.container.username.toString());
    //console.log(req.body.username.toString());
    console.log(req.body.username);
    userName = req.body.username;

    // Set our collection
    var collection = db.model('usercollection', User, 'usercollection');

    collection.find({
        username: userName,
    })
    .limit(1)
    .lean()
    .exec(function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("An error occurred on login.");
        }
        else {
            // And forward to success page
            if (userName === undefined) {
                var dataToSend = {};
                dataToSend.switch = false;
                res.send(false);
            }
            else if (doc.length > 0 && userName != "admin") {
                res.send(true);
            }
            else {
                var dataToSend = {};
                dataToSend.switch = false;
                res.send(false);
            }

        }
    });
});


/* POST to Add User Service */
router.post('/uploaduserdata', function (req, res) {
    var db = req.db;
    var userCollection = db.model('usercollection', User, 'usercollection');
    var dataCollection = db.model('datacollection', UnprocessedData, 'datacollection');

    //get user
    userCollection.find({ username: userName }, function (e, users) {
        var user = users[0];
        user.update();

        // save unprocessed data of user
        dataCollection({ data: req.body.unprocessedData }).save(
            function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem storing the data to the database.");
                }
                else {
                    var request = require('request');
                    request('/processingDone', function (err, res, body) {
                    });

                    // add user to database with name, unprocessed data ID, date, and status
                    user.data.push({ name: req.body.name, unprocessedID: doc._id, date: req.body.date, status: "In Queue" });

                    //save newly added user
                    user.save(function (err) {

                        // send user + id to message queue for processing
                        amqp.connect(MQip, function (err, conn) {
                            if (err) {
                                console.log("OH NO!");
                            }

                            conn.createChannel(function (err, ch) {
                                var q = 'hello'; // queue name
                                var msg = userName + " " + doc._id;
                                ch.assertQueue(q, { durable: false });
                                // Note: on Node 6 Buffer.from(msg) should be used
                                ch.sendToQueue(q, new Buffer(msg));
                                console.log(" [x] Sent %s", msg);
                            });
                            setTimeout(function () { conn.close() }, 500);

                        });

                        console.log("File Uploaded");
                        res.send(doc._id);
                    });
                }
            });
    });
});

/* POST to Delete data Service */
router.post('/deleteUserDataSet', function (req, res) {
    var db = req.db;
    var userCollection = db.model('usercollection', User, 'usercollection');
    var dataCollection = db.model('datacollection', UnprocessedData, 'datacollection');
    var processedDataCollection = db.model('processeddatacollection', ProcessedData, 'processeddatacollection');

    userCollection.find({ username: userName }, function (e, users) {
        var user = users[0];
        var userData = user.data[req.body.i];

        // delete processed + unprocessed data before updating user to indicate they are removed
        dataCollection.find({ _id: user.data[req.body.i].unprocessedID })
            .remove()
            .exec(function (e, data) {
                processedDataCollection.find({ _id: user.data[req.body.i].processedID })
                 .remove()
                 .exec(function (e, data) {
                     userData.remove();
                     user.save(function (err) {
                         console.log("Data Removed");
                         res.send();
                     });
                 });
            });


    });
});

/* POST to Send User Data Info 
    called every second to update user status when it changes
*/
router.post('/sendUserDataInfo', function (req, res) {
    var db = req.db;
    var collection = db.model('usercollection', User, 'usercollection');

    collection.find({ username: userName })
    .limit(1)
    .lean()
    .exec(function(err, users) {
        var user = users[0];
        var userDataInfos = [];

            // get all userData and send to page
        for (i = 0; i < user.data.length ; i++) {
            var userDataInfo = {};
            userDataInfo.name = user.data[i].name
            userDataInfo.date = user.data[i].date;
            userDataInfo.status = user.data[i].status;
            userDataInfo.id = user.data[i].unprocessedID;
            userDataInfos.push(userDataInfo);
        }
        res.send(userDataInfos);
    });

});

/* POST to Save what Data user clicked on for displaying on next page
*/
router.post('/saveDataIndex', function (req, res) {
    var db = req.db;
    var userCollection = db.model('usercollection', User, 'usercollection');
    userCollection.find({ username: userName }, function (e, users) {
        var user = users[0];
        dataID = user.data[req.body.id].processedID;
        dataName = req.body.name;
        res.send();
    });
});

/*
router.post('/check-status', function (req, res) {
    res.send(true);
}); */

/* POST to get processed data to be displayed with table and graph
*/
router.post('/getProcessedData', function (req, res) {
    var db = req.db;
    var processedDataCollection = db.model('processeddatacollection', ProcessedData, 'processeddatacollection');

    console.log(dataID);
    processedDataCollection.find({ id: dataID }, function (e, fullData) {
        var data = fullData[0];
        var dataToSend = {};
        dataToSend.name = dataName;
        dataToSend.data = data.data;
        res.send(dataToSend);
    });
});

/* GET to display csv app (table and graph) page
*/
router.get('/CSVApp', function (req, res) {
    if (userName != "" || dataID != "") {
        res.render('CSVApp', { title: 'CSV Graphs and Charts' });
    }
    else {
        res.redirect('/');
    }
});

/* GET to display admin page
*/
router.get('/admin', function (req, res) {
    if (userName != "" || dataID != "") {
        res.render('admin', { title: 'Admin Page' });
    }
    else {
        res.redirect('/');
    }
});

/* POST to re process all data in database
*/
router.post('/reRunAll', function (req, res) {

    var db = req.db;
    var dataCollection = db.model('datacollection', UnprocessedData, 'datacollection');
    var userCollection = db.model('usercollection', User, 'usercollection');
    var unprocessedData;

    // go through all users
    userCollection.find({}, function (e, users) {
        for (var i = 0; i < users.length; i++) {
            // function for asynchornously going through all users
            function reProcessUser(user) {
                for (var j = 0; j < user.data.length; j++) {
                    // function for asynchornously going through all data
                    function reProcessData(userdata) {
                        userdata.status = "In Queue";
                        user.save(function (err) {

                            //re-send to MQ new status
                            amqp.connect(MQip, function (err, conn) {
                                if (err) {
                                    console.log("OH NO!");
                                }
                                conn.createChannel(function (err, ch) {
                                    var q = 'hello';
                                    var msg = user.username + " " + userdata.unprocessedID;
                                    ch.assertQueue(q, { durable: false });
                                    // Note: on Node 6 Buffer.from(msg) should be used
                                    ch.sendToQueue(q, new Buffer(msg));
                                    console.log(" [x] Sent %s", msg);
                                });
                                setTimeout(function () { conn.close() }, 500);

                            });

                            console.log("File Uploaded");
                        });
                    }
                    reProcessData(user.data[j])
                }
            }
            reProcessUser(users[i]);
        }
        res.send();
    });

});

/* POST to change password
*/
router.post('/changePassword', function (req, res) {

    var db = req.db;
    var userCollection = db.model('usercollection', User, 'usercollection');
    var unprocessedData;
    userCollection.find({ username: userName }, function (e, users) {
        var user = users[0];

        //get hash of entered old passowrd
        var oldPassMd5 = md5(req.body.old)

        //confirm password
        if (user.password != oldPassMd5) {
            res.send(false);
            return;
        }

        //change passowrd
        user.password = md5(req.body.password);
        user.save(function (err) {
            res.send(true);
        });
    });

});

/* POST to Delete whole user */
router.post('/deleteUser', function (req, res) {

    var db = req.db;
    var userCollection = db.model('usercollection', User, 'usercollection');
    var dataCollection = db.model('datacollection', UnprocessedData, 'datacollection');
    var processedDataCollection = db.model('processeddatacollection', ProcessedData, 'processeddatacollection');

    //first remove unprocessed + processed data
    userFound = userCollection.find({ username: userName }, function (e, users) {
        var user = users[0];

        // create array of processed and unprocessed IDs to delete them all
        var processedIDs = [];
        var unprocessedIDS = [];

        for (var i = 0; i < user.data.length; i++) {
            processedIDs.push(user.data[i].processedID);
            unprocessedIDS.push(user.data[i].unprocessedID);
        }

        // reset username + dataID to go back to homepage

        // remove all processed and unprocessed data with thier IDs
        dataCollection.remove({ _id: { $in: unprocessedIDS } }, function (err, data) {
            processedDataCollection.remove({ id: { $in: processedIDs } }, function (err, data) {

                //remove user after all processed and unprocessed data removed
                userFound.remove(function (err, user) {
                    res.send();
                });
            });
        });

    });

});



module.exports = router;
