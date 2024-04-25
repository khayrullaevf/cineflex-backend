const fs=require('fs')

const Movie=require('./../models/movieModel')

const ApiFeatures=require('./../utilis/apiFeatures')



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


    const features=new ApiFeatures(Movie.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

    let movies=await features.query
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



 exports.getMovieStats=async(req,res)=>{
    try {

     const stats=await Movie.aggregate([
        {$match:{ratings:{$gte:4.5}}},
        {$group:{
            _id:'$releaseYear',
            avgRating:{$avg:'$ratings'},
            avgPrice:{$avg:'$price'},
            minPrice:{$min:'$price'},
            maxPrice:{$max:'$price'},
            priceTotal:{$sum:'$price'},
            movieCount:{$sum:1},
        }},
        { $sort:{minPrice:1}},
        {$match:{maxPrice:{$gte:60}}},
     ])



     res.status(200).json({
        status:"success",
        count:stats.length,
        data:{
            stats:stats
        }
    })




        
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
        
    }


}

 exports.getMovieByGenre=async(req,res)=>{
    try {


        const genres=req.params.genre;
        const movies= await Movie.aggregate([
            {$unwind:'$genres'},
            {$group:{
                _id:'$genres',
                movieCount:{$sum:1},
                movies:{
                    $push:`$name`
                },
               
            }},
            {$addFields:{genre:'$_id'}},
            {$project:{_id:0}},
            {$sort:{
                movieCount:-1
            }},
            // {$limit:6}
            {$match:{genre:genres}}

        ])






        res.status(200).json({
            status:"success",
            count:movies.length,
            data:{
                movies:movies
            }
        })


        
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
        
    }

}