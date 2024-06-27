const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subjectSchema = new Schema({
  subjectName: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  details: [
    {
      description: { type: String, required: true },
      isChecked: { type: Boolean, default: false },
    },
  ],
});

const Subject = model("Subject", subjectSchema);

module.exports = Subject;
