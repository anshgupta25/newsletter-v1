const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { env } = require("process");
app.use(bodyParser.urlencoded({extended: true}));



// here we donot get the css styling bcoz these are the static elemnts of the cpmuter to use them we have to use 
app.use(express.static("static"));
// we make a new folder static and put the css files in a folder css and then put them in static
// we have to create a folder for every elememt thatis static ie local to the computer

app.get("/" , function(req , res ){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req , res){

    var fname = req.body.fName;
    var lname = req.body.lName;
    var email = req.body.eMail;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }

            }
        ]
    };
    // now this is a object but to send it to the browser we need to convert it into json
    const jsondata = JSON.stringify(data);

    // now we have to send this data to mailchimp using https module
    const url ="https://us2.api.mailchimp.com/3.0/lists/8eba370cd4";

    const options = {
        method:"POST",
        auth:"ansh25:5879a0a4ae6bcbceb29d86b78d41ca2e-us2"
    }

   const request =  https.request(url , options , function(response){
    if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
    }
    else{
        res.sendFile(__dirname+"/faliure.html");
    }

        response.on("data" , function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsondata);
    request.end();
});

app.post("/faliure" , function(req , res){
    res.redirect('/');
});
//API key - 5879a0a4ae6bcbceb29d86b78d41ca2e-us2
// list id - 8eba370cd4


app.listen(process.env.PORT || 3000, function(){
    console.log("server running at 3000");
});