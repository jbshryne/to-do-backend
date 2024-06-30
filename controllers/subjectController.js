const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Category = require("../models/category");
const Subject = require("../models/subject");

// create new subject - DONE
router.post("/new-subject/:username/:columnIdx", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  // console.log("user", user);

  const category = await Category.findOne({
    user: user._id,
    columnIdx: req.params.columnIdx,
  });
  // console.log("category", category);

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

// create new detail - DONE
router.post("/new-detail/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  // console.log("req.body", req.body);

  const subject = await Subject.findOne({
    _id: req.body.subjectId,
  });

  console.log("user", user);
  console.log("subject", subject);

  if (user && subject) {
    subject.details.push({
      description: req.body.description,
    });

    await subject.save();
    res.json({ subject });
  } else {
    res.json({ message: "User or Subject not found" });
  }
});

// // read all subjects
// router.get("/subjects/:username/:categoryName", async (req, res) => {
//   const user = await User.findOne({ username: req.params.username });

//   const category = await Category.findOne({
//     user: user._id,
//     categoryName: req.params.categoryName,
//   }).populate("subjects");

//   if (user && category) {
//     res.json({ subjects: category.subjects });
//   } else {
//     res.json({ message: "User or Category not found" });
//   }
// });

// update subject - DONE
router.put("/update-subject/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  const subject = await Subject.findOne({
    _id: req.body.subjectId,
  });

  if (user && subject) {
    subject.subjectName = req.body.subjectName;
    subject.description = req.body.description;

    await subject.save();
    res.json({ subject });
  } else {
    res.json({ message: "User or Subject not found" });
  }
});

// update subject order
router.put("/update-subject-order/:username/:columnIdx", async (req, res) => {
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
});

// update detail - DONE
router.put("/update-detail/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  // const category = await Category.findOne({
  //   user: user._id,
  //   categoryName: req.params.categoryName,
  // }).populate("subjects");

  const subject = await Subject.findOne({
    _id: req.body.subjectId,
  });

  if (user && subject) {
    const detail = subject.details.id(req.body.detailId);
    detail.description = req.body.description;
    detail.isChecked = req.body.isChecked;

    await subject.save();
    res.json({ subject });
  } else {
    res.json({ message: "User or Subject not found" });
  }
});

// delete subject - DONE
router.delete("/delete-subject/:username/:columnIdx", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  const category = await Category.findOne({
    user: user._id,
    columnIdx: req.params.columnIdx,
  });

  const subject = await Subject.findOne({
    _id: req.body.subjectId,
  });

  if (user && category && subject) {
    await Subject.deleteOne({ _id: subject._id });
    category.subjects = category.subjects.filter((subject) => {
      console.log("subject", subject);
      console.log("req.body.subjectId", req.body.subjectId);
      return subject != req.body.subjectId;
    });

    console.log("category", category);

    await category.save();
    res.json({ category });
  } else {
    res.json({ message: "User, Category, or Subject not found" });
  }
});

// delete detail - DONE
router.delete("/delete-detail/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  const subject = await Subject.findOne({
    _id: req.body.subjectId,
  });

  if (user && subject) {
    subject.details = subject.details.filter(
      (detail) => detail._id != req.body.detailId
    );

    await subject.save();
    res.json({ subject });
  } else {
    res.json({ message: "User or Subject not found" });
  }
});

module.exports = router;
