const mongoose=require('mongoose')
const dotnev=require('dotenv')
dotnev.config({path:'./config.env'})


process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
 })






const app=require('./app')

console.log(process.env);


mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((con)=>{
    // console.log(con);
    console.log('Connection success');
}).catch((err)=>{
    console.log('Error happened');
})




//CREATE A SERVER
const port=process.env.PORT||3000
app.listen(port , ()=>{
    console.log('Server has started');
})





process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');
 
    server.close(() => {
     process.exit(1);
    })
 })


//  console.log(x);