//build out middleware authentication
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const db = require('../dbConnectExec.js');

const auth = async(req, res, next)=>{
    try{
        //first decode the token
        let myToken = req.header("Authorization").replace("Bearer ","");//remove bearer from string
        let decoded = jwt.verify(myToken, config.JWT);
        let memberID = decoded.pk;

        //compare this token with the one in the database
        let query = `SELECT MemberID, FirstName, LastName, Email FROM MEMBER
        WHERE MemberID=${memberID} AND Token='${myToken}'`;
        let returnedUser = await db.executeQuery(query);
        // console.log("returned user:",returnedUser);

        //save user into the request (req)
        if(returnedUser[0]){
            req.contact = returnedUser[0];
            next();//approve authentication
        }
        else{
            return res.status(401).send("Invalid Credentials")
        }
    }
    catch(err){
        return res.status(401).send("Invalid credentials in middleware catch");
    }
}
module.exports = auth;