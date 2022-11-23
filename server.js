const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const http = require("http");
const fs = require('fs');
const config = require("./subject.json");
app.use(cors({ credentials: true, origin: ["http://localhost:3000", "https://easyhr870.herokuapp.com"] }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());






app.post("/senddata", (req, res, next) => {

    //reading and writing file
    var data = fs.readFileSync("./subject.json");
    var myObject = JSON.parse(data);

    let x = req.body;
    console.log(x)
    x.average = (parseInt(req.body.fnd) + parseInt(req.body.pa) + parseInt(req.body.bee) + parseInt(req.body.dsa) + parseInt(req.body.iot)) / 5;
    x.totalmarks = (parseInt(req.body.fnd) + parseInt(req.body.pa) + parseInt(req.body.bee) + parseInt(req.body.dsa) + parseInt(req.body.iot));
    x.grade = x.totalmarks > 90 ? 'A' : x.totalmarks > 80 ? 'B' : x.average > 70 ? 'C' : x.totalmarks > 60 ? 'D' : x.totalmarks > 33 ? 'E' : x.totalmarks < 33 ? 'F' : '';
    myObject.push(req.body);

    fs.writeFileSync("./subject.json", JSON.stringify(myObject), (err) => {
        if (err) console.log("Error writing file:", err);
    });

    res.redirect("/getdata");





});

app.get('/getdata', function (req, res, next) {

    var data = fs.readFileSync("./subject.json");
    var myObject = JSON.parse(data);

    res.status(200).send(
        `<head>
        <style>
        .card {
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          width: 40%;
          border-radius: 5px;
          width:100%;
        }
        
        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
        
        img {
          border-radius: 5px 5px 0 0;
        }
        
        .container {
          padding: 2px 16px;
        }
        </style>
        </head>
        <body>
        <div style="display:grid;grid-template-columns:auto auto auto;">
${myObject.map((item) => {
    
            return (
                `<div class="card">
                <div class="container" >
                <h1 style="text-align:center;"><b>Grade: ${item.grade}</b></h1>

                        <h4><b>Id: ${item.id}</b></h4>
                        <h4><b>Name: ${item.name}</b></h4>
                        <h4><b>Address: ${item.address}</b></h4>
                        <h4><b>Fnd Marks: ${item.fnd}</b></h4>
                        <h4><b>PA Marks: ${item.pa}</b></h4>
                        <h4><b>BEE Marks: ${item.bee}</b></h4>
                        <h4><b>DSA Marks: ${item.dsa}</b></h4>
                        <h4><b>IOT Marks: ${item.iot}</b></h4>
                        <h4 style="text-align:center;"><b>Average Marks: ${item.average}</b></h4>
                        <h4 style="text-align:center;"><b>Total Marks: ${item.totalmarks}</b></h4>
                    </div>
                </div>`
            )
        }).join("")


        }
        </div>        
        `
    );


});


app.get('/', function (request, response, next) {

    response.sendFile(__dirname + '/index.html');


});



app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

let servers = http.Server(app)

const server = servers.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on PORT: ${4000} in ${"local"} mode.`)

})
