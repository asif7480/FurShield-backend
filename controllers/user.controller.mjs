import asyncHandler from "express-async-handler";
import User from "../models/user.model.mjs";
import Product from "../models/product.model.mjs";
import petModel from "../models/pet.model.mjs";

const getAllOwners = asyncHandler(async (request, response) => {
  const owners = await User.find({ role: "owner" });
  response.status(200).json({
    message: "Owners retrieved successfully.",
    success: true,
    data: owners,
  });
});

const getAllShelters = asyncHandler(async (request, response) => {
  const shelters = await User.find({ role: "shelter" });
  response.status(200).json({
    message: "Shelters retrieved successfully.",
    success: true,
    data: shelters,
  });
});

const getAllVets = asyncHandler(async (request, response) => {
  const vets = await User.find({ role: "vet" });
  response.status(200).json({
    message: "Vets retrieved successfully.",
    success: true,
    data: vets,
  });
});

const totalCounts = asyncHandler( async(request, response) => {
  const totalProducts = await Product.countDocuments()
  const totalVets = await User.find({ role: "vet" }).countDocuments()
  const totalShelters = await User.find({ role: "shelter"}).countDocuments()
  const totalUsers = await User.find({ role: "owner" }).countDocuments()
  const totalPets = await petModel.countDocuments()

  response.status(200).json({
    products: totalProducts,
    pets: totalPets,
    vets: totalVets,
    shelters: totalShelters,
    users: totalUsers
  })

})

export { getAllOwners, getAllShelters, getAllVets, totalCounts };
