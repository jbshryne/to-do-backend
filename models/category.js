const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  categoryName: { type: String, required: true },
  description: { type: String },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

const Category = model("Category", categorySchema);

module.exports = Category;
