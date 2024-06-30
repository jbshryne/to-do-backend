const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Category = require("../models/category");
const Subject = require("../models/subject");

// create new category - DONE
router.post("/new-category/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (user) {
    const newCategory = await Category.create({
      user: user._id,
      categoryName: req.body.categoryName,
      description: req.body.description,
    });

    user.categories.push(newCategory._id);
    await user.save();
    res.json({ newCategory });
  } else {
    res.json({ message: "User not found" });
  }
});

// read all categories - DONE
router.get("/categories/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).populate(
    "categories"
  );

  // populate subjects
  for (let i = 0; i < user.categories.length; i++) {
    const category = user.categories[i];
    const subjects = await Subject.find({
      category: category._id,
    });
    category.subjects = subjects;
  }

  if (user) {
    res.json({ categories: user.categories });
  } else {
    res.json({ message: "User not found" });
  }
});

// update category - DONE
router.put("/update-category/:username/:columnIdx", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const category = await Category.findOne({
    user: user._id,
    columnIdx: req.params.columnIdx,
  });

  if (user && category) {
    category.categoryName = req.body.categoryName;
    category.description = req.body.description;
    await category.save();
    res.json({ category });
  } else {
    res.json({ message: "User or Category not found" });
  }
});

//update category order
router.put("/update-category-order/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (user) {
    user.categories = req.body.categories;
    // console.log("user.categories", user.categories);
    console.log("req.body.categories", req.body.categories);
    await user.save();
    res.json({ user });
  } else {
    res.json({ message: "User not found" });
  }
});

// delete category - DONE
router.delete("/delete-category/:username/:categoryName", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const category = await Category.findOne({
    user: user._id,
    categoryName: req.params.categoryName,
  });

  if (user && category) {
    await Category.deleteOne({ _id: category._id });
    user.categories = user.categories.filter(
      (category) => category.categoryName !== req.params.categoryName
    );
    await user.save();
    res.json({ user });
  } else {
    res.json({ message: "User or Category not found" });
  }
});

module.exports = router;
