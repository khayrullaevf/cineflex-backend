
const express=require('express')
let app=express()
const fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))


//ROUTE=HTTP METHOD+ URL
const logger=function(req,res,next){
    console.log('custom middleware called');
    next()
}


app.use(express.json())
app.use(logger)

app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString()
    next()
})



//route handler function
const getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        requestedAt:req.requestedAt,
        data:{ 
            movies:movies
        }})
}
const addNewMovie=(req,res)=>{
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

}
const getMovieById=(req,res)=>{
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

}
const updateMovie=(req,res)=>{
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
 
 }
const deleteMovie=(req,res)=>{
    const id=req.params.id*1;
    const movieToDelete=movies.find((movie)=>movie.id===id)
    if (!movieToDelete) {
        return  res.status(400).json({
            status:"fail",
            message:'No Movie with id '+id+' not found'
          })
       }
    let deleteIndex=movies.indexOf(movieToDelete)

    movies.splice(deleteIndex,1)
    fs.writeFile("./data/movies.json",JSON.stringify(movies),(err)=>{
        res.status(204).json({
            status:"success",
            data:{
                movie:null
            }
        })
    
       })




}





//GET-/api/v1/movies
//get all  movies

// app.get('/api/v1/movies',getAllMovies)
// //POST--/api/v1/movies
// //add new movie
// app.post('/api/v1/movies',addNewMovie)
// //GET= /api/v1/movies/:id
// //get movie by id
// app.get('/api/v1/movies/:id',getMovieById)
// //PATCH -update release year
// //update movie by id
// app.patch('/api/v1/movies/:id',updateMovie)
// //DELETE- /api/v1/movies/:id
// //delete movie by id
// app.delete('/api/v1/movies/:id',deleteMovie)


app.route('/api/v1/movies')
.get(getAllMovies)
.post(addNewMovie)




app.route('/api/v1/movies/:id')
.get(getMovieById)
.patch(updateMovie)
.delete(deleteMovie)











//CREATE A SERVER
const port=3000
app.listen(port , ()=>{
    console.log('Server has started');
})