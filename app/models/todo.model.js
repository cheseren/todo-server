const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");

const TodoShema = mongoose.Schema(
    {
        name: String,
        description: String,
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        done: {
            type: String,
            default: "no",
            enum: ["no", "yes"]
        },
    },
    {
        timestamps: true,
    }
)

TodoShema.plugin(mongoosePaginate);

module.exports = mongoose.model('Todo', TodoShema);