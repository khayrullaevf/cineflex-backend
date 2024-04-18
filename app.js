
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

//GET= api/v1/movies/:id
app.get('/api/v1/movies/:id',(req,res)=>{
    const id=req.params.id*1
    let movie= movies.find((movie)=>movie.id===id)


   if(!movie){
    return  res.status(400).json({
        status:"fail",
        message:'Movie with id '+id+' not found'
      })
   }

    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })

})

//PATCH -update release year
app.patch('/api/v1/movies/:id',(req,res)=>{
   let id=req.params.id*1;
   let movieToUpdate=movies.find((movie)=>movie.id===id)
   if (!movieToUpdate) {
    return  res.status(400).json({
        status:"fail",
        message:'No Movie with id '+id+' not found'
      })
   }




   let movieIndex=movies.indexOf(movieToUpdate)
   Object.assign(movieToUpdate,req.body)
   movies[movieIndex]=movieToUpdate

   fs.writeFile("./data/movies.json",JSON.stringify(movies),(err)=>{
    res.status(200).json({
        status:"success",
        data:{
            movie:movieToUpdate
        }
    })

   })

})

//CREATE A SERVER
const port=3000
app.listen(port , ()=>{
    console.log('Server has started');
})