const mongoose=require('mongoose')

const fs=require('fs')
const validator=require('validator')

const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        trim:true,
        maxlength:[100,'Movie name must not have more than 100 characters'],
        minlength:[4,'Movie name must have at least 4 characters'],
        validate:[validator.isAlpha,'Name show only contain alphabets(a-z,A-Z).']
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
        default:1.0,
        min:[1,'Ratings must be 1 or greater than 1'],
        max:[10,'Ratings must be 10 or less than 10']
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
        required:[true,'Genres are required'],
        enum:{values:["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
        message:'This genre does not exist'
    }
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

//find
movieSchema.pre(/^find/, function(next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.startTime = Date.now()
    next();
});
//find
movieSchema.post(/^find/,function(docs,next) {
    this.find({releaseDate: {$lte: Date.now()}});
    this.endTime = Date.now();
    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents.`
    fs.writeFileSync('./log/log.txt', content, {flag: 'a'}, (err) => {
        console.log(err.message);
    });
    next()
})



movieSchema.pre('aggregate', function(next) {
   this.pipeline().unshift({$match:{releaseDate:{$lte:new Date()}}})
   next()
})


const Movie=mongoose.model('Movie',movieSchema)

module.exports=Movie

