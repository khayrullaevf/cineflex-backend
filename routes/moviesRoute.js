const express=require('express')
const moviesController=require('./../controllers/moviesController')
const router=express.Router()



router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies)


router.route('/movie-stats').get(moviesController.getMovieStats)
router.route('/movie-genres/:genre').get(moviesController.getMovieByGenre)



router.route('/')
.get(moviesController.getAllMovies)
.post(moviesController.validateBody,moviesController.addNewMovie)




router.route('/:id')
.get(moviesController.getMovieById)
.patch(moviesController.updateMovie)
.delete(moviesController.deleteMovie)


module.exports=router