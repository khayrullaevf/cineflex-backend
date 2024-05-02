
const express=require('express')
// const fs=require('fs')
// const morgan=require('morgan')
const moviesRouter=require('./routes/moviesRoute')
const authRouter=require('./routes/authRouter')
const userRouter=require('./routes/userRoute')
const CustomErr=require('./utilis/customError')
const globalErrHandler=require('.//controllers/error-controller')
const helmet=require('helmet')
const sanitize=require('express-mongo-sanitize')
const xss=require('xss-clean');
const hpp=require('hpp');

let app=express()



app.use(helmet())








const rateLimit=require('express-rate-limit')
let limiter=rateLimit({
    max:1000,
    windowMs:60*60*1000,
    message:"We have received too many requests from this IP, Please try after one hour."
});



app.use('/api',limiter)

 






//ROUTE=HTTP METHOD+ URL
const logger=function(req,res,next){
    console.log('custom middleware called');
    next()
}


app.use(express.json({
    limit:'10kb'
}))

app.use(xss())
app.use(hpp({waitlist:[
    'duration',
    'ratings',
    'releaseYear',
    'genres',
    'directors',
    'releaseDate',
    'actors'
]}))



app.use(sanitize())

// if(process.env.NODE_ENV==='development'){
// app.use(morgan('dev'))
// }



app.use(express.static('./public'))
app.use(logger)

app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString()
    next()
})



//ROUTE
app.use('/api/v1/movies',moviesRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)

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

