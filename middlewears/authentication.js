require("dotenv").config();;
const jwt = require("jsonwebtoken")

const authentication = (req,res,next)=>{
    const token = req.headers.authorization;
    console.log(token);
    if(token){
        console.log('inside');
        const decoded = jwt.verify(token,process.env.KEY);
        if(decoded){
            req.body.userID = decoded.id;
            next()
        }
        else{
            res.status(400).send("Please login")
        }
    }
    else{
        res.status(400).send("Please login")
    }
}

module.exports = {authentication}