//import express
const express = require('express');

//imported dataservice to index.js
const dataService = require('./services/data.service')

const jwt = require('jsonwebtoken')
//to parse json
var app = express();

app.use(express.json());
//create an app using express

// const app = express()

//resolve http request from client
//get-to read data 
app.get('/',(req,res)=>{
    res.status(401).send(" It's a get method")
})

//post-to create data 
app.post('/',(req,res)=>{
    res.send(" It's a post method")
})

//put-to update/modify data 
app.put('/',(req,res)=>{
    res.send(" It's a put method")
})

//patch-to partial modification data 
app.patch('/',(req,res)=>{
    res.send(" It's a patch method")
})

//delete-to partial modification data 
app.delete('/',(req,res)=>{
    res.send(" It's a delete method")
})

//application specific middleware
 const appMiddleware = (req,res,next)=>{
    console.log("Application specific middleware");
    next()
 }
 app.use(appMiddleware)

//Bank app  - API

// to verify token middleware
const jwtMiddleware = (req,res,next)=>{
 try {const token = req.headers["x-access-token"]

  //verify token
 const data =  jwt.verify(token,'supersecretkey123')
 req.currentAcno = data.currentAcno
 next()}
 catch{
     res.status(422).json({
         statusCode:422,
         status:false,
         message:"Please Log In"
     })
 }

}
//1)                                            //register API
app.post('/register',(req,res)=>{
   const result = dataService.register(req.body.acno,req.body.password,req.body.uname)
   res.status(result.statusCode).json(result)
})

//2)                                            //login API
app.post('/login',(req,res)=>{
    const result = dataService.login(req.body.acno,req.body.password)
    res.status(result.statusCode).json(result)
 })

 //3)                                            //deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    const result = dataService.deposit(req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
 })

 //4)                                            //withdraw API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    const result = dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
    res.status(result.statusCode).json(result)
 })

 //5)                                            //transaction API
app.post('/transaction',jwtMiddleware,(req,res)=>{
    const result = dataService.getTransaction(req.body.acno)
    res.status(result.statusCode).json(result)
 })
//set up the port number
app.listen(3000,()=>{
    console.log("server started at port no:3000");
})