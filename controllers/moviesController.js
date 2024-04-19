const fs=require('fs')


let movies=JSON.parse(fs.readFileSync('./data/movies.json'))


 exports.getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        requestedAt:req.requestedAt,
        data:{ 
            movies:movies
        }})
}
 exports.addNewMovie=(req,res)=>{
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
 exports.getMovieById=(req,res)=>{
    const id=req.params.id*1
    let movie= movies.find((movie)=>movie.id===id)
   if(!movie){
    return  res.status(404).json({
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
 exports.updateMovie=(req,res)=>{
    let id=req.params.id*1;
    let movieToUpdate=movies.find((movie)=>movie.id===id)
    if (!movieToUpdate) {
     return  res.status(404).json({
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
 exports.deleteMovie=(req,res)=>{
    const id=req.params.id*1;
    const movieToDelete=movies.find((movie)=>movie.id===id)
    if (!movieToDelete) {
        return  res.status(404).json({
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


