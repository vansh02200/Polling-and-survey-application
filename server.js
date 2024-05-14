var express = require("express");
var fileupload = require("express-fileupload");
var app = express();
var path = require("path");
var mysql2 = require("mysql2");
var bcrypt = require("bcrypt");
//hello//
const saltRounds = 10;


// ==========================================================


app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(fileupload());


// ==========================================================


app.listen(2005, function(){

    console.log("Server Started");    
    
});


// ==========================================================


app.get("/", function(req, resp)
{
    resp.sendFile(__dirname + "/public/index.html");
})

app.get("/login", function(req, resp)
{
    resp.sendFile(__dirname + "/public/login.html");
})


// ==========================================================

const config={
    host:"127.0.0.1",
    user:"root",
    password:"vansh0220",
    database:"pollweb",
    dateStrings: true
}

var mysqldb = mysql2.createConnection(config);

mysqldb.connect(function(err)
{
    
    if(err==null)
        console.log("DB Connected!");
    else
        console.log(err.message);

})


// ==========================================================


app.get("/regAUTH", function(req, resp)
{

    var uName = req.query.uName;
    var uEmail = req.query.uEmail; 
    var uPass = req.query.uPass;

    bcrypt.hash(uPass.toString(), saltRounds, function(passerr, hash) {
        
        if(passerr)
        {
            console.log(passerr);
        }
        else
        {

            mysqldb.query("insert into allUser value(?, ?, ?)", [uName, uEmail, hash], function(err)
            {

                if(err == null)
                {
                    resp.send("SignUp Successfull !!!");
                }
                else
                    resp.send(err);

            })
        }

    });


})


app.get("/checkDupUser", function(req, resp)
{
    
    var toCheckEmail = req.query.uEmail;

    mysqldb.query("select * from allUser where authEmail=?", [toCheckEmail], function(err, result)
    {

        if(err==null)
        {
            if(result.length!=0)
            {
                resp.send("Email Already Exists !");
            }
            else
                resp.send("");
        }

        else
        {
            resp.send(err.message);
        }

    })

})


app.get("/loginAuth", function(req, resp)
{

    var uEmail = req.query.uEmail;
    var uPass = req.query.uPwd;

    mysqldb.query("select * from allUser where user_email=?", [uEmail], function(err, result)
    {

        if(err == null)
        {

            if(result.length == 1)
            {

                bcrypt.compare(uPass.toString(), result[0].user_pass, function(errr, passRes)
                {

                    if(errr)
                        resp.send("Some Error !");

                    else if(passRes)
                        resp.send("!yesLogin!");

                    else
                        resp.send("Wrong Password !");
                })

            }
            else if(result.length != 1)
                resp.send("User Account Not Found !");

        }

        else
            resp.send(err);

    })

})
