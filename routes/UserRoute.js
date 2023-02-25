const express = require("express");

const userRouter = express.Router();
const jwt= require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/UserModel");
const { authentication } = require("../middlewears/authentication");

userRouter.post("/register",async(req,res)=>{
    const {email,password} = req.body;

    try {
        const user = UserModel.find({email});
        if(user.length>0){
            res.status(400).send("User already exists")
        } else{
            bcrypt.hash(password,8,async(err,protected)=>{
                if(err){
                 console.log(err);
                }
                else{
                    const newUser = new UserModel({email,password:protected,profile:'https://cdn-icons-png.flaticon.com/512/149/149071.png',name:"user",bio:"demo",phone:1234});
                    await newUser.save();
                    res.status(201).send(`user has been created with email id ${email}`)
                }
            })
        }
    } catch (error) {
        res.status(404).send({message:'something went wrong',error:error.message});
        console.log(error);
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await UserModel.find({email});
        if(user.length > 0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    const token = jwt.sign({email,id:user[0]._id},process.env.KEY);
                    res.status(200).send({message:"User login successfully",token})
                }
                else{
                   console.log(password,user[0].password);
                res.status(400).send('Please fill right credentials')
               }
            })
        }
    } catch (error) {
        res.status(400).send({error:error.message});
        console.log(error);
    }
})

userRouter.use(authentication)

userRouter.get("/getProfile",async(req,res)=>{
    const id = req.body.userID;
    try {
        const data = await UserModel.findById({_id:id});
        res.status(200).send({user:data});
    } catch (error) {
        res.status(404).send('user not found');
    }
})

userRouter.patch("/getProfile",async(req,res)=>{
    const id = req.body.userID;
    try {
        bcrypt.hash(req.body.password,8,async(err,protected)=>{
            if(err){
             console.log(err);
             res.status(400).send("something went wrong")
            }
            else{
                const user = await UserModel.findByIdAndUpdate({_id:id},{email:req.body.email,password:protected,profile:req.body.profile,bio:req.body.bio,name:req.body.name,phone:req.body.phone});
                
                res.status(200).send({user:user,message:'user has been successfully updated'})
                
            }
        })
        // const user = await UserModel.findByIdAndUpdate({_id:id},req.body);
    } catch (error) {
        res.status(400).send('something went wrong')
    }
})
module.exports = {userRouter}