const mongoose=require('mongoose')

const dotnev=require('dotenv')
dotnev.config({path:'./config.env'})

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