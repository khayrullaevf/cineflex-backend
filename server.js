const dotnev=require('dotenv')
dotnev.config({path:'./config.env'})

const app=require('./app')

console.log(process.env);


//CREATE A SERVER
const port=process.env.PORT||3000
app.listen(port , ()=>{
    console.log('Server has started');
})