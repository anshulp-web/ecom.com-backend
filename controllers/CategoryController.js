import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';

//CREATE CATEGORY
export const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: 'Name is required',
      });
    }
    //CHECK EXISTING CATEGORY
    const existingcategory = await categoryModel.findOne({ name });
    if (existingcategory) {
      return res.status(200).send({
        success: false,
        message: 'Category Already Exist',
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    return res.status(200).send({
      success: true,
      message: 'Category Created Successfully',
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in category creation',
      error,
    });
  }
};
//UPDATE CATEGORY
export const UpdateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(401).send({
        success: false,
        message: 'Name is required',
      });
    }

    // UPDATE CATEGORY
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: 'Category Updated Successfully',
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in updating category',
      error,
    });
  }
};
//GET ALL CATEGORY
export const CategoryController = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: 'Category fetched successfully',
      allCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in fetch all category',
      error,
    });
  }
};
//SINGLE CATEGORY
export const SingleCategoryController = async (req, res) => {
  try {
    const singleCategory = await categoryModel.findOneAndReplace({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: 'Get Single Category',
      singleCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching single category',
      error,
    });
  }
};
//DELETE CATEGORY
export const DeleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: 'Category Deleted Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in delete category',
      error,
    });
  }
};
