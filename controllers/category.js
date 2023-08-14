import Category from "../models/category.js";
import Courses from "../models/courses.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const emptyCategory = async (req, res) => {
  res.status(200).json([]);
};

export const getCategoriesByName = async (req, res) => {
  try {
    const { query } = req.params;

    const categories = await Category.find({
      categoryName: { $regex: query, $options: "i" },
    }).limit(10);

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryName = await Category.findById(id);
    res.status(200).json(categoryName);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    // const newCategory = await Category.create({
    //   categoryName,
    //   // timestamp: Date.now(),
    // });
    const newCategory = await Category.create(req.body);

    res.status(200).json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const s = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true }
    );
    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const r = await Courses.findOne({
      categoryId: id,
    });

    if (r) {
      return res.status(403).json({ message: "Course Exist" });
    }

    const s = await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
