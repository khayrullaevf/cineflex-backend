
const express=require('express')
let app=express()
const fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))


//ROUTE=HTTP METHOD+ URL

//GET-api/movies

app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{ 
            movies:movies
        }})
})


//CREATE A SERVER
const port=3000
app.listen(port , ()=>{
    console.log('Server has started');
})