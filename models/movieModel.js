const mongoose=require('mongoose')



const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is required']
    },
    duration:{
        type:Number,
        required:[true,'Duration is required']
    },
    ratings:{
        type:Number,
        default:1.0
    },
    totalRatings:{
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true,'ReleaseYear is required']
    }
    ,
    releaseDate:{
        type:Date

    },
    createdAt:{
       type:Date,
       default:Date.now(),
       select:false
    },
    genres:{
        type:[String],
        required:[true,'Genres are required']
     },
     directors:{
         type:[String],
         required:[true,'Directors are required']
      },
      coverImage:{
          type:String,
          required:[true,'Cover image is required']
       },
       actors:{
        type:[String],
        required:[true,'Actors image is required']
       }
       ,
       price:{
        type:Number,
        required:[true,'Price is required']
       }
})

const Movie=mongoose.model('Movie',movieSchema)

module.exports=Movie

