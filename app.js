require("dotenv").configure();
const express = require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/SecretsDB" , {useNewUrlParser:true});

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/" , function(req,res){
  res.render("home");
});

app.get("/login" , function(req,res){
  res.render("login");
});

app.get("/register" , function(req,res){
  res.render("register");
});

                      // Creating a Schema
const userschema = new mongoose.Schema({
  email:String,
  password:String
});

userschema.plugin(encrypt , {secret:process.env.SECRET, encryptedFields:["password"]});

                    // Creating a model
const User = new mongoose.model("User", userschema);


            // POST REQUEST OF REGISTER ROUTE
app.post("/register" , function(req,res){

  const User1 = new User({
        email:  req.body.username,
        password: req.body.password
  });

User1.save(function(err){
  if(err){
    console.log(err);
  }
  else{
    res.render("secrets");
  }
});
});

          // POST REQUEST OF LOGIN ROUTE
app.post("/login" , function(req,res){

const username =  req.body.username;
const password = req.body.password;

User.findOne({email:username} , function(err,foundUser){

  if(err){
    console.log(err);
  }
  else{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  }
});
});

app.listen("3000" , function(){
     console.log("Secrets Application is running at Port 3000");
});
