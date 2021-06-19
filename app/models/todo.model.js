const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2");


const TodoShema = mongoose.Schema({
    todoId: String,
    name : String,
    description: String,
    category: String,
    dateCreated: Number,
    dateAccomplished: Number
}, )

TodoShema.plugin(mongoosePaginate);

module.exports = mongoose.model('Todo', TodoShema);