const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");


const Category = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true, },
    //   userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true
  }
  )


Category.plugin(mongoosePaginate);

module.exports = mongoose.model("Category", Category)