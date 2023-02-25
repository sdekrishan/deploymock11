require("dotenv").config()
const express = require('express');
const app = express();
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/UserRoute");
app.use(cors({
    origin:'*'
}))
app.use(express.json());

app.use("/",userRouter)

app.listen(process.env.PORT,async(req,res)=>{
    try {
        await connection;
        console.log('server has been started');
    } catch (error) {
        console.log(error);
    }
})



module.exports = app