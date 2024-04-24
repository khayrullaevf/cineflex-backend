const fs=require('fs')

const Movie=require('./../models/movieModel')

let movies=JSON.parse(fs.readFileSync('./data/movies.json'))





 exports.validateBody=(req,res,next)=>{
    if (!req.body.name||!req.body.duration) {
        return res.status(400).json({
            status:"fail",
            message:'Not a valid movie data'
        })
        
    }
    next()
 }


 
 exports.getHighestRated=(req,res,next)=>{
    req.query.limit=5
    req.query.sorting='-ratings'
    next()
}

 exports.getAllMovies=async (req,res)=>{
    try {

   
    let queryStr=JSON.stringify(req.query)
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
    const queryObj= JSON.parse(queryStr)

    let queries=Movie.find()
    //SORT
    if(req.query.sorting){

       const sortBy=req.query.sorting.split(',').join(' ')

       queries= queries.sort(sortBy)
        
    }else{
        queries= queries.sort('-createdAt')

    }


    //LIMITING FIELDS
    if(req.query.fields){
        const fields=req.query.fields.split(',').join(' ')
        queries=queries.select(fields)
    }else{
        queries=queries.select("-__v")
    }


    //PAGINATION
    const page=req.query.page*1||1
    const limit=req.query.limit*1||10
    //PAGE 1:1-10 ,PAGE 2 : 11-20 ,PAGE 3: 21-30
    const skiping=(page-1)*limit

    queries=queries.skip(skiping).limit(limit)

    if(req.query.page){
        const moviesCount=await Movie.countDocuments()
        if(skiping>=moviesCount){
            throw new Error("This page is not found")
        }

    }






    let movies=await queries



    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status:"fail",
            message:error.message
        })
        
    }

}
 exports.addNewMovie=async (req,res)=>{
    try {
        const movie= await Movie.create(req.body)
        res.status(201).json({
            status:"success",
            data:{
                movie:movie
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }
  

}
 exports.getMovieById=async (req,res)=>{
    try {
        // const movie=await Movie.find({_id:req.params.id})
        const movie=await Movie.findById(req.params.id);
        res.status(200).json({
            status:"success",
            data:{
                movie:movie
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })  
    }

}
 exports.updateMovie=async(req,res)=>{
    try {
       const movie= await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })

    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
        
    }
 }
 exports.deleteMovie=async(req,res)=>{
    try {
       await Movie.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status:"success",
            data:null
        })

        
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
        
    }
  
}


