const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
const mysql = require("mysql2");
const spawner = require('child_process').spawn;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "root", 
    database: "python_to_sql"
});

app.get("/api/scrap", (req, res)=>{
    const {searchedname} = req.query;
    // const userName = "ElvishInsaan";
    // const password = "Gautam@962";
    // const searchedname = "MansiSwaraj";
    console.log(searchedname);
    const data_to_pass_in = [searchedname];

    const python_process = spawner('python', ['./2.py', JSON.stringify(data_to_pass_in)]);

    python_process.stdout.on('data', (data) => {
        if (data.toString().trim() === 'Success') {
            console.log('Data received from python script', data.toString().trim());
        } else {
            console.log(data.toString());
        }
    });
    
    python_process.on('exit', (code) => {
        if (code === 0) {
            res.send("Success");
            // res.json({ message: 'Login successful' });
            console.log('1.py script executed successfully.');
        } else {
            // res.status(400).send({ error: 'Failure' });
            console.log(`1.py script exited with code ${code}.`);
        }
    });
})

app.get("/api/get", (req, res)=>{
    const {searchedname} = req.query;
    const sqlGet = `SELECT * FROM ${searchedname}`;
    console.log(searchedname);
    db.query(sqlGet, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.send(result);
    });
});


// app.post("/api/post", (req, res)=>{
//     const {name, email, contact} = req.body;
//     const sqlInsert = "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";
//     db.query(sqlInsert, [name, email, contact], (err, result)=>{
//         if(err){
//             console.log(err);
//         }
//     });
// });

// app.delete("/api/remove/:id", (req, res)=>{
//     const {id} = req.params;
//     const sqlRemove = "DELETE FROM contact_db WHERE id = ?";
//     db.query(sqlRemove, id, (error, result)=>{
//         if(error){
//             console.log(error);
//         }
//     });
// });

// app.get("/api/get/:id", (req, res)=>{
//     const {id} = req.params;

//     const sqlGet = "SELECT * FROM contact_db WHERE id = ?";
//     db.query(sqlGet, id, (error, result)=>{
//         if(error){
//             console.log(error);
//         }
//         res.send(result);
//     });
// });

// app.put("/api/update/:id", (req, res)=>{
//     const {id} = req.params;
//     const {name, email, contact} = req.body;

//     const sqlUpdate = "UPDATE contact_db SET name = ?, email = ?, contact = ? WHERE id = ?";
//     db.query(sqlUpdate, [name, email, contact, id], (error, result)=>{
//         if(error){
//             console.log(error);
//         }
//         res.send(result);
//     });
// });


// app.get("/", (req, res)=>{

//     // const sqlInsert = "INSERT INTO contact_db (name, email, contact) VALUES ('radhe', 'radhe123@gmail.com', 7015792491)";
//     // db.query(sqlInsert, (err, result)=>{
//     //     console.log("err", err);
//     //     console.log("result", result);
//     //     res.send("Hello Express");
//     // })
    
// })


app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
});



