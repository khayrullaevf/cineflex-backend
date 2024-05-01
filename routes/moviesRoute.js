const express=require('express')
const moviesController=require('./../controllers/moviesController')
const router=express.Router()
const authController=require('./../controllers/authController')



router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies)


router.route('/movie-stats').get(moviesController.getMovieStats)
router.route('/movie-genres/:genre').get(moviesController.getMovieByGenre)



router.route('/')
.get(authController.protect,moviesController.getAllMovies)
.post(authController.protect,authController.restrict('admin'),moviesController.validateBody,moviesController.addNewMovie)




router.route('/:id')
.get(authController.protect,authController.restrict('admin'), moviesController.getMovieById)
.patch(authController.protect,authController.restrict('admin'),moviesController.updateMovie)
.delete(authController.protect,authController.restrict('admin'),moviesController.deleteMovie)


 module.exports=router