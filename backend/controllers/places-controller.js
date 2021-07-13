const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const {validationResult} = require("express-validator");
const Place = require("../models/place");
// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Victoria Memorial",
//     description:
//       "Elegant, domed, white marble museum, opened in 1921, housing displays on the history of Kolkata.",
//     location: {
//       lat: 22.5448082,
//       lng: 88.0624064,
//     },
//     address:
//       "Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Victoria Memorial 2",
//     description:
//       "2-Elegant, domed, white marble museum, opened in 1921, housing displays on the history of Kolkata.",
//     location: {
//       lat: 22.5448082,
//       lng: 88.0624064,
//     },
//     address:
//       "2-Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
//     creator: "u1",
//   },
// ];
// function expression with arrow function

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("errors",errors)
    return next(new HttpError('Invalid inputs passed, please check your data',422))
  }
   const { title, description, location, address, creator } = req.body;
   const createdPlace = new Place({
     title,
     description,
     image:"https://images.pexels.com/photos/1289845/pexels-photo-1289845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
     address,
     location: location,
     creator
   });
   try{
     await createdPlace.save();
   }
   catch(err ){
    const error = new HttpError("Creating place failed, please try again.",500);
    console.log(err);
   return next(error);
 }
  
  
   res.status(201).json({ place: createdPlace });
 };

 const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try{
    place= await Place.findById(placeId);
  }catch(err){
    const error = new HttpError("Something went wrong, could not find a place", 500)
  return next(error);
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id !!!", 404)
    );
  }
  res.json({ place: place.toObject({getters: true}) });
};
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try{
    places = await Place.find({creator:userId})
  }catch(err){
    const error = new HttpError("Something went wrong, could not find a place", 500)
  return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a places for the provided id !!!", 404)
    );
  }
  res.json({ places:places.map(place=>place.toObject({getters: true})) });
};
const updatePlace = async (req, res, next) => {
  const errors= validationResult(req);
 if(!errors.isEmpty()){
   console.log("errors",errors)
   return next(new HttpError('Invalid inputs passed, please check your data',422))
 }
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let place;
  try{
    // find the place From Place model by id and store it in place variable
    place = await Place.findById(placeId)
  }catch(err){
    const error = new HttpError("Something went wrong.Could not update place", 500)
  return next(error);
  }
  // change the title, description 
  place.title = title;
  place.description = description;
// now save the changed value in database
try{
await place.save();
}
  catch(err){
    const error = new HttpError("Something went wrong.Could not update place", 500)
  return next(error);
  }
  res.status(200).json({ place: place.toObject({getters:true}) });
};
const deletePlace = async(req, res, next) => {
  const placeId = req.params.pid;
 let place;
 try{
   place = await Place.findById(placeId);

 }catch(err){
  const error = new HttpError("Something went wrong.Could not delete place", 500)
  return next(error);
 }
// remove and save the data 
try{
  await place.remove();
}catch(err){
  const error = new HttpError("Something went wrong.Could not delete place", 500)
  return next(error);
 } 
  res.status(200).json({ message: "Deleted successfully" });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
