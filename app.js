
const express=require('express')
let app=express()
const fs=require('fs')
const morgan=require('morgan')
const moviesRouter=require('./routes/moviesRoute')


//ROUTE=HTTP METHOD+ URL
const logger=function(req,res,next){
    console.log('custom middleware called');
    next()
}


app.use(express.json())

if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'))
}
app.use(express.static('./public'))
app.use(logger)

app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString()
    next()
})



//ROUTE
app.use('/api/v1/movies',moviesRouter)

module.exports=app

