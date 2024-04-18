
const express=require('express')
let app=express()
const fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))


//ROUTE=HTTP METHOD+ URL
app.use(express.json())

//GET-api/movies

app.get('/api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{ 
            movies:movies
        }})
})

//POST--api/movies
app.post('/api/v1/movies',(req,res)=>{
    const newId=movies[movies.length-1].id+1
    const newMovie=Object.assign({id:newId},req.body)
    movies.push(newMovie)
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movie:newMovie
            }
        })

    })

})


//CREATE A SERVER
const port=3000
app.listen(port , ()=>{
    console.log('Server has started');
})