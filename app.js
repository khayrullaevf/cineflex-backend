
const express=require('express')
let app=express()
const fs=require('fs')
const morgan=require('morgan')
const moviesRouter=require('./routes/moviesRoute')
const CustomErr=require('./utilis/customError')
const globalErrHandler=require('.//controllers/error-controller')


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

app.all('*',(req,res,next)=>{
    // res.status(400).json({
    //     status:"fail",
    //     message:`Can't find ${req.originalUrl} on the server!`
    // })
    // const err= new Error(`Can't find ${req.originalUrl} on the server!`)
    // err.status="fail"
    // err.statusCode=404
    const err=new CustomErr(`Can't find ${req.originalUrl} on the server!`,404)
    next(err)
})

app.use(globalErrHandler)







module.exports=app

