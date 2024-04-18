
const express=require('express')
let app=express()


//ROUTE=HTTP METHOD+ URL


//CREATE A SERVER
const port=8000
app.listen(port , ()=>{
    console.log('Server has started');
})