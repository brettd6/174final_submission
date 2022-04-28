/*
    Brett Davis - 174 Final Backend
    backend using node js and express to interact with the mysql database using CRUD endpoints,
    security features include: prepared statements on all relevent calls to database, password hashing
    on user accounts, and http request filtering to prevent unwanted access to backend
*/

//required dependencies to connect to database and manipulate data
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const { query } = require('express');
const bcrypt = require('bcrypt'); //needed for password hashing
const saltRounds = 10;
//allowed urls for backend access
const clientUrl = 'http://bd174.herokuapp.com' 
const clientUrls = 'https://bd174.herokuapp.com'

//placeholder database info - actual info in pdf submission
const db = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: '',
})

//needed to manipulate data from react front end
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    //on every CRUD endpoint to ensure requests are coming from front end
    if (req.get('origin') !== clientUrl || req.get('origin') === clientUrls) 
        res.send('Access Denied.');
})
        
//sql function called to display total facilities in database
app.get('/api/facilCount', (req,res) => {
    
    if (req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const sqlSelectCount = "SELECT facilCount('both') as facilCount;";

        db.query(sqlSelectCount, (err,result) => {
            if(err) {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})
    
//selects all gyms in database to list as potential bookings
app.get('/api/getGyms', (req,res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const sqlSelectGyms = "SELECT * FROM GYM;";
        db.query(sqlSelectGyms, (err, result) => {
            if(err)  {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})
        
 //selects all gym available times to so front end can sort and display
app.get('/api/getGymTimes', (req,res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const sqlSelectGymTimes = "SELECT * FROM GYM_AVAILTIME;";

        db.query(sqlSelectGymTimes, (err, result) => {
            if(err) {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})
    
//selects all pools in database to list as potential bookings
app.get('/api/getPools', (req,res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {    
        const sqlSelectPools = "SELECT * FROM POOL;";
        db.query(sqlSelectPools, (err, result) => {
            if(err)  {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})

//selects all gym available times to so front end can sort and display
app.get('/api/getPoolTimes', (req,res) => {
    
    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {

        const sqlSelectPoolTimes = "SELECT * FROM POOL_AVAILTIME;";

        db.query(sqlSelectPoolTimes, (err, result) => {
            if(err)  {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})

//adds a row to the CUSTOMER table
app.post('/api/createaccount', (req, res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const username = req.body.username;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        const street = req.body.street;
        const city = req.body.city;
        const state = req.body.state;
        const zip = req.body.zip;

        const sqlInsert = "INSERT INTO CUSTOMER VALUES (?,?,?,?,?,?,?,?);";
        
        bcrypt.hash(password, saltRounds, (err, hash) => { //hashes password
            
            if(err) 
                console.log(err);
            
            db.query(sqlInsert, [username, hash, fname, lname, street, city, state, zip], (err, result) =>{
                if(err)  {
                    res.send(err);
                    console.log(err);
                }
                else res.send(result);
            });
        });
    }
    else res.send('Access Denied.');
})

//validates password for login
app.get('/api/validatepassword', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    
    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const sqlGetUser = "SELECT hPassword FROM CUSTOMER where username = ?";

        db.query(sqlGetUser, [username], (err, result) => {
            if(err)  {
                console.log(err);
            }

            if(result.length > 0)  { //ifusername is in database
                bcrypt.compare(password, result[0].hPassword, (error, response) => { //compares input password to hashed passwords
                    if(error)
                        console.log(error);
                    res.send(response);
                });
            } 
            else
                res.send(false);
        })
    }
    else res.send('Access Denied.');
})

//gets password for same address in facility entry
app.get('/api/getAddress', (req, res) => {
    
    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {

        const sqlGetAddress = "SELECT street, city, state, zip FROM CUSTOMER where username = ?;";


        db.query(sqlGetAddress, [req.query.username], (err, result) => {
            if(err) {
                console.log(err);
                res.send(err);
            }
            else   
            res.send(result);
        })
    }
    else res.send('Access Denied.');
})

//adds a new gym to database
app.post('/api/uploadgym', (req, res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const username = req.body.username;
        const hasDumbbells = req.body.hasDumbbells;
        const hasTreadmill = req.body.hasTreadmill;
        const street = req.body.street;
        const city = req.body.city;
        const state = req.body.state;
        const zip = req.body.zip;
        const timeStart = Number(req.body.timeStart);
        const timeEnd = Number(req.body.timeEnd);

        const sqlInsertGym = "INSERT INTO GYM (hostName, hasTreadmill, hasDumbbells, street, city, state, zip) VALUES (?,?,?,?,?,?,?);";
        const sqlInsertGymTimes = "INSERT INTO GYM_AVAILTIME VALUES (?,?);";

        //promise to add new gym to database ensures that new gym id will be retrieved before attempt to enter new gym_availtimes
        queryPromise = () => {
            return new Promise((resolve, reject) => {
                var hd;
                var ht;
                if (hasDumbbells === 'Yes') hd = 1;
                else hd = 0;
                if (hasTreadmill === 'Yes') ht = 1;
                else ht = 0;
                db.query(sqlInsertGym, [username, hd, ht, street, city, state, zip], (err, result) => {
                    if(err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        }
        //after new gym is inserted the gym id is retrieved and used to insert available times
        async function uploadGym() {
            try {
                const result = await queryPromise();      
                for (var i = timeStart; i < timeEnd; i++) {
                    db.query(sqlInsertGymTimes, [result.insertId, i], (err, result) => {
                        if(err) 
                            console.log(err);
                    })
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        uploadGym();
    }
    else res.send('Access Denied.');
})

//inserts new rental time to database, triggers ensure this time will be removed from available times
app.post('/api/rentGym', (req, res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const username = req.body.username;
        const gid = req.body.gid;
        const availTime = req.body.availTime;

        const sqlInsertCRG = "INSERT INTO CUSTOMER_RENTS_GYM (guestName, gid, timeSlot) VALUES (?,?,?)";

        db.query(sqlInsertCRG, [username, gid, availTime], (err, result) => {
            if(err)  {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        })
    }
    else res.send('Access Denied.');
})

//adds new pool to database
app.post('/api/uploadpool', (req, res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const username = req.body.username;
        const size = req.body.size;
        const hasLifeguard = req.body.hasLifeguard;
        const street = req.body.street;
        const city = req.body.city;
        const state = req.body.state;
        const zip = req.body.zip;
        const timeStart = Number(req.body.timeStart);
        const timeEnd = Number(req.body.timeEnd);
        
        const sqlInsertPool = "INSERT INTO POOL (hostName, size, hasLifeguard, street, city, state, zip) VALUES (?,?,?,?,?,?,?);";
        const sqlInsertPoolTimes = "INSERT INTO POOL_AVAILTIME VALUES (?,?);";
        
        //promise to add new pool to database ensures that new pool id will be retrieved before attempt to enter new pool_availtimes
        queryPromise = () => {
            return new Promise((resolve, reject) => {
                var hl;
                if (hasLifeguard === 'Yes') hl = 1;
                else hl = 0;
                db.query(sqlInsertPool, [username, size, hl, street, city, state, zip], (err, result) =>{
                    if(err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(result);
                })
            })
        }
        //after new pool is inserted the pool id is retrieved and used to insert available times
        async function uploadPool() {
            try {
                const result = await queryPromise();     
                for (var i = timeStart; i < timeEnd; i++) {
                    db.query(sqlInsertPoolTimes, [result.insertId, i], (err, result) => {
                        if(err)
                            console.log(err);
                    })
                }  
            }
            catch(error) {
                console.log(error)
            }
        }
        uploadPool();
    }
    else res.send('Access Denied.');
})

//inserts new rental time to database, triggers ensure this time will be removed from available times
app.post('/api/rentPool', (req, res) => {

    if(req.get('origin') === clientUrl || req.get('origin') === clientUrls) {
        const username = req.body.username;
        const pid = req.body.pid;
        const availTime = req.body.availTime;

        const sqlInsertCRP = "INSERT INTO CUSTOMER_RENTS_POOL (guestName, pid, timeSlot) VALUES (?,?,?)";

        db.query(sqlInsertCRP, [username, pid, availTime], (err, result) =>{
            if(err)  {
                res.send(err);
                console.log(err);
            }
            else res.send(result);
        });
    }
    else res.send('Access Denied.');
});

app.listen(process.env.PORT, () =>  {
    console.log(`Server running on port ${process.env.PORT}`);
});