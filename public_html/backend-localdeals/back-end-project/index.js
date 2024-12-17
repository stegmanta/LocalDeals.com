const express = require ('express');
const port = 5000;
const app = express();
const db = require ('./dbConnectExec.js'); // enables execteQuery()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('C:\\Users\\tae\\Desktop\\SQL server config for now\\config.js');
const auth = require('./middleware/authenticate.js')
const cors = require ('cors');

app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("API runnings");
});

//1. What is the link to GET all the records in the data entity
app.get("/Locations", (req,res) => {
    db.executeQuery("SELECT * FROM LOCATION LEFT JOIN LOCATIONTYPE ON LOCATIONTYPE.LocationTypeID = LOCATION.LocationTypeID;")
    .then((theResults)=> {
        res.status(200).send(theResults);
    })
    .catch((err)=> {
        console.log(err);
        res.status(500).send();
    });
});

//2. What is the link to GET a particular record in your data entity? (parameterized GET endpoint)
app.get("/Location/id/:id", (req,res)=> {
    let id = req.params.id;//extract  value after contributor as id
   
    let myQuery = `SELECT * FROM LOCATION LEFT JOIN LOCATIONTYPE ON LOCATIONTYPE.LocationTypeID = LOCATION.LocationTypeID WHERE LOCATION.LocationID = ${id}`;
    db.executeQuery(myQuery)
        .then((result) => {
            if(result[0]) { //if there is data in the only row of array
                res.status(200).send(result[0]);
            }
            else {
                res.status(404).send("bad request, entity not found");
            }
        })
        .catch((err) => {
            console.log("Error in /Location/id/:id", err);
            res.status(500).send();
        });
});
//3. What is the link to POST a new user?
app.post("/Member/signup", async (req,res)=>{
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    //make sure json require variables were assigned (all fields provided)
    if(!firstName || !lastName || !email || !password){
        return res.status(400).send("Bad Request");
    }
    if(email === ""){
        return res.status(400).send("Bad Request");
    }
    //now that we verified data was posted correct
    //we will clean it
    //to make sure data is ready for SQL query
    firstName = firstName.replace("'","''");
    lastName = lastName.replace("'", "''");
    lastName = lastName.replace(" ","");//remove spaces in last name
    lastName = lastName.trim();
    firstName = firstName.trim();
    //see if email already exists
    let emailCheckQuery = `SELECT Email FROM MEMBER Where Email='${email}'`;
    let existingUser = await db.executeQuery(emailCheckQuery);
    // console.log("existing user ", existingUser);
    if(existingUser[0]){
        //query returns means it is duplicate
        return res.status(409).send("Duplicate email");
    }
    else{//non existing email
        //encrypt password
        let hashedPW = bcrypt.hashSync(password);
        let insertQuery = `INSERT INTO MEMBER(FirstName,LastName,Email,Password)
        VALUES ('${firstName}','${lastName}','${email}','${hashedPW}')`;
        // console.log(insertQuery);
        db.executeQuery(insertQuery)
        .then(()=>{
            res.status(201).send("User added to database");
        })
        .catch((err)=>{
            console.log("error in post /Member/Signup",err);
        })
    }
});//end post /contributor/signup

//4. What is the POST API to login a user?
app.post("/Member/login", async(req, res)=>{
    console.log("User login attempt started");
    //do some data validation
    let email = req.body.email;
    let password = req.body.password;
    let expirationStr = "60 minutes" 
    if(!email || !password){
        return res.status(400).send("Bad request");
    }
    //check for the user in the database
    let userQuery = `SELECT * FROM MEMBER WHERE email='${email}'`;
    let result;
    try{
        result = await db.executeQuery(userQuery);
    }
    catch(err){
        console.log("error in Member/login catch",err);
        return res.status(500).send();
    }
    //see if user exists
    if(!result[0]){
        return res.status(401).send("Invalid email");
    }
    let user = result[0];
    //check password is correct
    if(!bcrypt.compareSync(password,user.Password)){
        //password incorrect
        return res.status(401).send("Invalid Password");
    }
    //Generate JSON Web Token
    let token = jwt.sign({pk:user.MemberID}, config.JWT, {expiresIn: expirationStr});
    //Update the token in the database and send response to endpoint
    let setTokenQuery = `UPDATE MEMBER SET Token='${token}' WHERE MemberID = '${user.MemberID}'`;
    try{
        await db.executeQuery(setTokenQuery);
        res.status(200).send({
            token: token,
            user:{
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                MemberID: user.MemberID
            },
        });
        console.log(`User login successful, authorized for ${expirationStr}`);
    }
    catch(err){
        console.log("error in setting user token in login",err);
        res.status(500);
    }
});//end post login

//5.	What is the POST link to create a transaction?
//authenticated deal report post
app.post("/Report", auth,async(req,res)=>{
    try{
        console.log("Authenticated user accessing report");
        //gather request variables for deal report
        //assuming date discovered is the day the report is posted to database
        let descWhat = req.body.descWhat;
        let descWhen = req.body.descWhen;
        let originalPrice = req.body.originalPrice;
        let discountAmount = req.body.discountAmount;
        let locationID = req.body.locationID;
        let isLimitedTime = req.body.isLimitedTime;
        //basic validation, will make more complex later
        if(!descWhat || !descWhen || !Number.isFinite(originalPrice) || !Number.isFinite(discountAmount) || !locationID ||!isLimitedTime){
            return res.status(400).send("Bad request (missing datapoint)");
        }
        //make sure value matches Database constraints
        if((isLimitedTime != "True" && isLimitedTime != "False")){
            return res.status(400).send("Bad request, is limited time must be true or false");
        }
        //clean up JSON strings for SQL
        descWhat = descWhat.replace("'","''");
        descWhen = descWhen.replace("'","''");
        isLimitedTime = isLimitedTime.replace("'","''");
        //create insert query
        let insertQuery = `INSERT INTO Report(DescWhat, DescWhen, OriginalPrice, DiscountAmount, IsLimitedTime, IsActiveDeal, MemberID, LocationID, DateDiscovered)
                            OUTPUT inserted.ReportID, inserted.DescWhat, inserted.DescWhen, inserted.OriginalPrice, inserted.DiscountAmount, inserted.IsLimitedTime, inserted.IsActiveDeal,
                            inserted.MemberID, inserted.LocationID,inserted.DateDiscovered
                            VALUES('${descWhat}', '${descWhen}',${originalPrice},${discountAmount}, '${isLimitedTime}',
                            'True', ${req.contact.MemberID}, ${locationID}, GETDATE())`;
                            //datediscovered currently returns time as well, however the value is correct in DB so should be okay
        let insertedDeal = await db.executeQuery(insertQuery);
        console.log(insertedDeal);
        res.status(201).send(insertedDeal[0]);
    }catch(err){
        console.log("error in /Report catch",err);
        res.status(500).send;
    }             
});//end /dealreport post

//6.	What is the GET route to get all transactions (events/orders) records for a user?
app.get("/Member-reports", auth, async(req,res)=>{
    try{
        //get contact from auth method
        let contact = req.contact.MemberID;
        //create a query to find all dealreports for authenticated user
        //make this query a little more advanced so it includes all records ask prof about this
        let reportQuery = `SELECT [Report].*, [Location].*, [LocationType].* 
                            FROM REPORT LEFT JOIN LOCATION ON Report.LocationID = Location.LocationID 
                            LEFT JOIN LOCATIONTYPE ON Location.LocationTypeID = LocationType.LocationTypeID
                            WHERE [Report].MemberID = ${contact}`
        let memberReports = await db.executeQuery(reportQuery);
        res.status(200).send(memberReports);
    }catch(err){
        console.log("error in get /Member-reports",err);
        res.status(500).send;
    }
});

//7.	What is the POST link to logout a user? 
app.post("/Member/logout", auth,(req,res)=>{
    //query to delete token
    let updateQuery = `UPDATE MEMBER SET Token=NULL WHERE MemberID=${req.contact.MemberID}`;
    //execute
    db.executeQuery(updateQuery)
        .then(()=>{
            console.log("User logged out");
            res.status(200).send("logout successful");
        })
        .catch((err)=>{
            console.log("error in /Member/logout",err);
            res.status(500).send("server error in logout");
        })
});

app.listen(port,()=>{
    console.log("app is running on port", port);
});


// OLD CODE BEFORE DATABASE CHANGE

// 1. What is the link to GET all the records in the data entity
// app.get("/DealReports", (req,res) => {
//     db.executeQuery("SELECT * FROM DealReport")
//     .then((theResults)=> {
//         res.status(200).send(theResults);
//     })
//     .catch((err)=> {
//         console.log(err);
//         res.status(500).send();
//     });
// });

// //2. What is the link to GET a particular record in your data entity? (parameterized GET endpoint)
// app.get("/DealReport/id/:id", (req,res)=> {
//     let id = req.params.id;//extract  value after contributor as id
   
//     let myQuery = `SELECT * FROM DealReport WHERE DealReport.DealReportID = ${id}`;
//     db.executeQuery(myQuery)
//         .then((result) => {
//             if(result[0]) { //if there is data in the only row of array
//                 res.status(200).send(result[0]);
//             }
//             else {
//                 res.status(404).send("bad request, entity not found");
//             }
//         })
//         .catch((err) => {
//             console.log("Error in /DealReport/id/:id", err);
//             res.status(500).send();
//         });
// });
// //3. What is the link to POST a new user?
// app.post("/contributor/signup", async (req,res)=>{
//     let firstName = req.body.firstName;
//     let lastName = req.body.lastName;
//     let email = req.body.email;
//     let password = req.body.password;
//     let address = req.body.address;
//     let zipcode = 90001;//maybe add zipcode validation if there is time for now they will all be LA
//     let accuracyRating = 5.0;
//     //make sure json require variables were assigned (all fields provided)
//     if(!firstName || !lastName || !email || !password || !address){
//         return res.status(400).send("Bad Request");
//     }
//     if(email === ""){
//         return res.status(400).send("Bad Request");
//     }
//     //now that we verified data was posted correct
//     //we will clean it
//     //to make sure data is ready for SQL query
//     firstName = firstName.replace("'","''");
//     lastName = lastName.replace("'", "''");
//     lastName = lastName.replace(" ","");//remove spaces in last name
//     lastName = lastName.trim();
//     firstName = firstName.trim();
//     //see if email already exists
//     let emailCheckQuery = `SELECT Email FROM CONTRIBUTOR Where Email='${email}'`;
//     let existingUser = await db.executeQuery(emailCheckQuery);
//     // console.log("existing user ", existingUser);
//     if(existingUser[0]){
//         //query returns means it is duplicate
//         return res.status(400).send("Duplicate email");
//     }
//     else{//non existing email
//         //encrypt password
//         let hashedPW = bcrypt.hashSync(password);
//         let insertQuery = `INSERT INTO CONTRIBUTOR(FirstName,LastName,Email,Password,Address,Zipcode,AccuracyRating)
//         VALUES ('${firstName}','${lastName}','${email}','${hashedPW}','${address}','${zipcode}','${accuracyRating}')`;
//         // console.log(insertQuery);
//         db.executeQuery(insertQuery)
//         .then(()=>{
//             res.status(201).send("User added to database");
//         })
//         .catch((err)=>{
//             console.log("error in post /contacts",err);
//         })
//     }
// });//end post /contributor/signup

// //4. What is the POST API to login a user?
// app.post("/contributor/login", async(req, res)=>{
//     console.log("User login attempt started");
//     //do some data validation
//     let email = req.body.email;
//     let password = req.body.password;
//     let expirationStr = "60 minutes" 
//     if(!email || !password){
//         return res.status(400).send("Bad request");
//     }
//     //check for the user in the database
//     let userQuery = `SELECT * FROM CONTRIBUTOR WHERE email='${email}'`;
//     let result;
//     try{
//         result = await db.executeQuery(userQuery);
//     }
//     catch(err){
//         console.log("error in contributor/login catch",err);
//         return res.status(500).send();
//     }
//     //see if user exists
//     if(!result[0]){
//         return res.status(401).send("Invalid email");
//     }
//     let user = result[0];
//     //check password is correct
//     if(!bcrypt.compareSync(password,user.Password)){
//         //password incorrect
//         return res.status(401).send("Invalid Password");
//     }
//     //Generate JSON Web Token
//     let token = jwt.sign({pk:user.ContributorID}, config.JWT, {expiresIn: expirationStr});
//     //Update the token in the database and send response to endpoint
//     let setTokenQuery = `UPDATE CONTRIBUTOR SET Token='${token}' WHERE ContributorID = '${user.ContributorID}'`;

//     try{
//         await db.executeQuery(setTokenQuery);
//         res.status(200).send({
//             token: token,
//             user:{
//                 firstName: user.FirstName,
//                 lastName: user.LastName,
//                 email: user.Email,
//                 ContributorID: user.ContributorID
//             },
//         });
//         console.log(`User login successful, authorized for ${expirationStr}`);
//     }
//     catch(err){
//         console.log("error in setting user token in login",err);
//         res.status(500);
//     }
// });//end post login

// //5.	What is the POST link to create a transaction?
// //authenticated deal report post
// app.post("/dealreport", auth,async(req,res)=>{
//     try{
//         console.log("Authenticated user accessing report");
//         //gather request variables for deal report
//         //assuming date discovered is the day the report is posted to database
//         let description = req.body.description;
//         let isLimitedTime = req.body.isLimitedTime;
//         //basic validation, will make more complex later
//         if(!description || !isLimitedTime){
//             return res.status(400).send("Bad request");
//         }
//         //make sure value matches Database constraints
//         if((isLimitedTime != "True" && isLimitedTime != "False")){
//             return res.status(400).send("Bad request");
//         }
//         //clean up JSON strings for SQL
//         description = description.replace("'","''");
//         isLimitedTime = isLimitedTime.replace("'","''");
//         //create insert query
//         let insertQuery = `INSERT INTO DealReport(ContributorID, Description, DateDiscovered, IsLimitedTime, ActiveDeal)
//                             OUTPUT inserted.DealReportID, inserted.ContributorID, inserted.Description,inserted.DateDiscovered,
//                             inserted.IsLimitedTime, inserted.ActiveDeal
//                             VALUES(${req.contact.ContributorID}, '${description}', GETDATE(), '${isLimitedTime}', 'True')`;
//                             //datediscovered currently returns time as well, however the value is correct in DB so should be okay
//         let insertedDeal = await db.executeQuery(insertQuery);
//         console.log(insertedDeal);
//         //inserting a generic DealItem record for now, just so you don't have to fill out a bunch of information to create a report
//         let genericDealItemQuery = `INSERT INTO DealItem(ItemID, DealReportID,QuantityRequired,DiscountAmount)
//                                     VALUES (1, ${insertedDeal[0].DealReportID}, 1, 1)`
//         let genericDealItem = await db.executeQuery(genericDealItemQuery);
//         res.status(201).send(insertedDeal[0]);
//     }catch(err){
//         console.log("error in /dealreport catch",err);
//         res.status(500).send;
//     }             
// });//end /dealreport post

// //6.	What is the GET route to get all transactions (events/orders) records for a user?
// app.get("/contributor-reports", auth, async(req,res)=>{
//     try{
//         //get contact from auth method
//         let contact = req.contact.ContributorID;
//         //create a query to find all dealreports for authenticated user
//         //make this query a little more advanced so it includes all records ask prof about this
//         let reportQuery = `SELECT [DealReport].DealReportID, [DealReport].Description, [DealItem].ItemID, [DealItem].DiscountAmount, [Item].ItemName, 
//                             [Item].ItemPrice,[Item].ItemType
//                             FROM DealReport LEFT JOIN DealItem ON DealReport.DealReportID = DealItem.DealReportID LEFT JOIN Item ON DealItem.ItemID = Item.ItemID
//                             WHERE [DealReport].ContributorID = ${contact}`
//         let contributorReports = await db.executeQuery(reportQuery);
//         res.status(200).send(contributorReports);
//     }catch(err){
//         console.log("error in get /contributor/reports",err);
//         res.status(500).send;
//     }
// });

// //7.	What is the POST link to logout a user? 
// app.post("/contributor/logout", auth,(req,res)=>{
//     //query to delete token
//     let updateQuery = `UPDATE CONTRIBUTOR SET Token=NULL WHERE ContributorID=${req.contact.ContributorID}`;
//     //execute
//     db.executeQuery(updateQuery)
//         .then(()=>{
//             console.log("User logged out");
//             res.status(200).send("logout successful");
//         })
//         .catch((err)=>{
//             console.log("error in /contributor/logout",err);
//             res.status(500).send("server error in logout");
//         })
// });

// app.listen(port,()=>{
//     console.log("app is running on port", port);
// });