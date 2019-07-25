const express = require('express');
const next = require('next');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
//var MongoClient = require('mongodb').MongoClient;
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos',{useNewUrlParser : true});
const connection = mongoose.connection;

connection.once('open',function(){
    console.log("MongoDB database connection established successfully");
})
//FIRST ENDPOINT
//SENDING HTTP REQUEST TO CERTAIN ENDPOINT
//GET REQUEST
todoRoutes.route('/').get(function(req,res){
    Todo.find(function(err, todos){
        if(err){
            console.log(err);
        }
        else{
            res.json(todos);
        }
    });
});

//2nd ENDPOINT
//Retrieve 1 specific todo 
todoRoutes.route('/:id').get(function(req,res){
    let id = req.params.id;
    Todo.findById(id , function(err,todo){
        res.json(todo);
    });
});
//ADDING ENDPOINT
todoRoutes.route('/add').post(function(req,res){
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo':'todo added sucessfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

//UPDATE ENDPOINT
todoRoutes.route('/update/:id').post(function(req,res){
    Todo.findById(req.param.id,function(err,todo){
        if(!todo)
            res.status(400).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority    = req.body.todo_priority;
            todo.todo_completed   = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            })
    })
})

app.use('/todos',todoRoutes);

app.listen(PORT, function(){
    console.log("Server is running on Port: " + PORT);
});
