
const express=require('express')
let app=express()


//ROUTE=HTTP METHOD+ URL
app.get('/',(req,res)=>{
    res.status(200).json({message:'Hello, world', status:200})
})

app.post('/',()=>{

})


//CREATE A SERVER
const port=8000
app.listen(port , ()=>{
    console.log('Server has started');
})