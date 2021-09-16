const app = require('express')()
 
const mongoose = require('mongoose')
 
const bodyParser = require('body-parser')
 
app.use(bodyParser.json())

const url = "mongodb+srv://thanh:thanh@cluster0.ntvke.mongodb.net/mydb?retryWrites=true&w=majority"

const cors = require('cors')

app.use(cors())

mongoose.connect(url)


//define a "table" structure
var StudentSchema = new mongoose.Schema({
    name: String
 })

 
 var StudentModel = mongoose.model('Student', StudentSchema)  //name of collection

 app.get('/students', function(req, res){
    StudentModel.find({}, function(err, students){
        res.send(students)
    })
 })

  
app.post('/students', function(req, res){
    StudentModel.create(req.body, function(err, student){
        res.send(student)
    })
 }) 
 

 app.delete('/students/:_id', function(req, res){
    StudentModel.deleteOne({_id: req.params._id}, function(err, result){
        res.send(result)
    })
 })
  
 app.put('/students', function(req, res){
    StudentModel.findOneAndUpdate({_id: req.body._id},{ name: req.body.name}, function(err, result){
        res.send(result)
    })
 })
  
  
 app.get('/students/search/:keyword', function(req, res){
    StudentModel.find({name: req.params.keyword}, function(err, result){
        res.send(result)
    })
 })
 

 app.listen(4001)
  
 



