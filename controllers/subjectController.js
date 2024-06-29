const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Category = require("../models/category");
const Subject = require("../models/subject");

// create new subject
router.post("/new-subject/:username/:columnIdx", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  console.log("user", user);

  const category = await Category.findOne({
    user: user._id,
    columnIdx: req.params.columnIdx,
  });
  console.log("category", category);

  if (user && category) {
    const newSubject = await Subject.create({
      category: category._id,
      subjectName: req.body.subjectName,
      description: req.body.description,
    });
    category.subjects.push(newSubject._id);

    await category.save();
    res.json({ newSubject });
  } else {
    res.json({ message: "User or Category not found" });
  }
});

// read all subjects
router.get("/subjects/:username/:categoryName", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  const category = await Category.findOne({
    user: user._id,
    categoryName: req.params.categoryName,
  }).populate("subjects");

  if (user && category) {
    res.json({ subjects: category.subjects });
  } else {
    res.json({ message: "User or Category not found" });
  }
});

// new detail
router.post(
  "/new-detail/:username/:categoryName/:subjectName",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    }).populate("subjects");

    const subject = await Subject.findOne({
      category: category._id,
      subjectName: req.params.subjectName,
    });

    if (user && category && subject) {
      subject.details.push({
        description: req.body.description,
        isChecked: req.body.isChecked,
      });

      await subject.save();
      res.json({ subject });
    } else {
      res.json({ message: "User, Category, or Subject not found" });
    }
  }
);

// update subject
router.post(
  "/new-detail/:username/:categoryName/:subjectName",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    }).populate("subjects");

    const subject = await Subject.findOne({
      category: category._id,
      subjectName: req.params.subjectName,
    });

    if (user && category && subject) {
      subject.details.push({
        description: req.body.description,
        isChecked: req.body.isChecked,
      });

      await subject.save();
      res.json({ subject });
    } else {
      res.json({ message: "User, Category, or Subject not found" });
    }
  }
);

// update subject order
router.put(
  "/update-subject-order/:username/:categoryName",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    });

    if (user && category) {
      category.subjects = req.body.subjects;
      await category.save();
      res.json({ category });
    } else {
      res.json({ message: "User or Category not found" });
    }
  }
);

// update detail
router.put(
  "/update-detail/:username/:categoryName/:subjectName",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    }).populate("subjects");

    const subject = await Subject.findOne({
      category: category._id,
      subjectName: req.params.subjectName,
    });

    if (user && category && subject) {
      const detail = subject.details.id(req.body._id);
      detail.description = req.body.description;
      detail.isChecked = req.body.isChecked;

      await subject.save();
      res.json({ subject });
    } else {
      res.json({ message: "User, Category, or Subject not found" });
    }
  }
);

// delete subject
router.delete(
  "/delete-subject/:username/:categoryName/:subjectName",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    });

    const subject = await Subject.findOne({
      category: category._id,
      subjectName: req.params.subjectName,
    });

    if (user && category && subject) {
      await Subject.deleteOne({ _id: subject._id });
      category.subjects = category.subjects.filter(
        (subject) => subject.subjectName !== req.params.subjectName
      );

      await category.save();
      res.json({ category });
    } else {
      res.json({ message: "User, Category, or Subject not found" });
    }
  }
);

// delete detail
router.delete(
  "/delete-detail/:username/:categoryName/:subjectName/:detailId",
  async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const category = await Category.findOne({
      user: user._id,
      categoryName: req.params.categoryName,
    });

    const subject = await Subject.findOne({
      category: category._id,
      subjectName: req.params.subjectName,
    });

    if (user && category && subject) {
      subject.details = subject.details.filter(
        (detail) => detail._id != req.params.detailId
      );

      await subject.save();
      res.json({ subject });
    } else {
      res.json({ message: "User, Category, or Subject not found" });
    }
  }
);

module.exports = router;
