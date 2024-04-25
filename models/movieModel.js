const mongoose=require('mongoose')

const fs=require('fs')

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
       },
       createdBy:String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60


})


//.save() 

movieSchema.pre('save',function(next) {

    this.createdBy='Fazliddin'

    console.log('Save middleware is called');
    next()
})


movieSchema.post('save',function(doc,next) {
    const content=`A new  movie document with name ${doc.name}  has been created by ${doc.createdBy}\n`
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err.message);
    })

    next()
})

const Movie=mongoose.model('Movie',movieSchema)

module.exports=Movie

