const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  columnIdx: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  categoryName: { type: String, required: true },
  description: { type: String },
  sharedWith: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      columnIdx: { type: Number },
    },
  ],
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

const Category = model("Category", categorySchema);

module.exports = Category;
