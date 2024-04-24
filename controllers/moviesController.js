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

 exports.getAllMovies=async (req,res)=>{
    try {
   
        // const excludeFields=['sort', 'page','limit','fields']

        // const queryObj={...req.query}
        // excludeFields.forEach((el)=>{
        //    delete queryObj[el]
        // })
        // console.log(req.query);
        let queryStr=JSON.stringify(req.query)

       queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
       const queryObj= JSON.parse(queryStr)
    //    console.log(queryObj);

    const movies= await Movie.find(queryObj)
    // const movies= await Movie.find()
    // .where('duration')
    // .gte(req.query.duration)
    // .where('ratings')
    // .gte(req.query.ratings)
    // .where('price')
    // .lte(req.query.price)



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


