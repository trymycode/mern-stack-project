const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Victoria Memorial",
    description:
      "Elegant, domed, white marble museum, opened in 1921, housing displays on the history of Kolkata.",
    location: {
      lat: 22.5448082,
      lng: 88.0624064,
    },
    address:
      "Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Victoria Memorial 2",
    description:
      "2-Elegant, domed, white marble museum, opened in 1921, housing displays on the history of Kolkata.",
    location: {
      lat: 22.5448082,
      lng: 88.0624064,
    },
    address:
      "2-Victoria Memorial Hall, 1, Queens Way, Maidan, Kolkata, West Bengal 700071",
    creator: "u1",
  },
];
// function expression with arrow function
const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id !!!", 404)
    );
  }
  res.json({ place, message: "Place details" });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a places for the provided id !!!", 404)
    );
  }
  res.json({ places, message: "user details" });
};
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};
const updatePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
