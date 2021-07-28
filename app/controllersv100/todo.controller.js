const Todo = require('../models/todo.model')
const asyncHandler = require('express-async-handler');
const { populate } = require('../models/todo.model');

//create and save a new todo
exports.createNewTodo = asyncHandler(async (req, res) => {
    const { description, dateCreated, todoId, name, todoDate, category } = req.body;

    if (!description) {
        return res.status(400).json({
            message: "Todo description can not be empty"
        });
    }

    if (!category) {
        return res.status(403).json({
            success: false,
            message: "Make sure you provide the category"
        });
    }

    //create a todo
    const todo = new Todo({
        name: name || "Untitled Todo",
        description: description,
        category: category._id
    })

    //check if id is same
    var item = await Todo.findOne({ name: name })
    if (item) { return res.status(400).send({ message: "Already Exist" }) }
    //save todo in a database
    await todo.save(
        
        function (error, doc) {

        if (error) return res.status(403).json({ message: "Can not save todo! Try later!" });

        doc.populate('category', function(error) {
            if (error) {
                console.log(err)
            }

            res.send({
                success: true,
                message: "Todo Added Successfully!",
                doc: doc
            });
    
        })



    })

})

//retrieve and return  all todos from databaase
exports.getAllTodos = asyncHandler(async (req, res) => {
    const { offset, limit, queryString } = req.query;
    // console.log(offset + '------> offset')
    // console.log(limit+ '------> limit')
    // console.log(queryString + '------> queryString')

    let queryList = [];
    if (queryString) {
        queryList.push({ name: { $regex: new RegExp(queryString), $options: "i" } },)
    }

    let query = {
        $or: queryList
    }
    if (queryList.length == 0) {
        query = {}
    }

    await Todo.paginate(query, {
        offset: offset || 0,
        limit: limit || 20,
        populate: 'category'

    }).then((data) => {
        // console.log(data)
        return res.status(200).json({
            success: true,
            data: data
        });
    })
        .catch((error) => {
            // console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message
            });
        })
})

// reetrieve a single todo with an id
exports.getOneTodo = asyncHandler(async (req, res) => {
    const id = req.params.id
    // console.log(id)
    var result = await Todo.findById(id).populate('category');
    if (!result) return res.status(404).send({
        success: false,
        message: 'Item Not Found'
    });
    return res.status(200).send({
        success: true,
        doc: result
    });

})

//update a todo identified by the id in the request
exports.updateTodo = asyncHandler(async (req, res) => {
    //validate description
    // console.log(req.body.done)
    let todo = {};
    if (req.params.id == null) {
        return res.status(403).send({
            success: false,
            message: "Todo update unsuccessfull!"
        })
    }
    var itemResult = await Todo.findById(req.params.id);
    if (!itemResult) return res.status(404).json({
        success: false,
        message: "Todo not found!"
    });

    todo = itemResult;
    // console.log(product)


    //find todo and update 
    Todo.findByIdAndUpdate(req.params.id,
        {
            $set: {
                name: req.body.name ? req.body.name : todo.name,
                description: req.body.description ? req.body.description : todo.description,
                done: req.body.done ? req.body.done : todo.done,
                category: req.body.category ? req.body.category._id : todo.category,
            }
        },
        { new: true , populate: 'category'},
        (err, doc) => {
            if (err) {
                if (err.kind === "ObjectId") {
                    return res.status(404).send({
                        message: "Todo not found with id " + id
                    });
                }
                // console.log(err)
                return res.status(500).send({
                    message: "Error updating todo with id " + id
                });
            }

                return res.status(200).send({
                    success: true,
                    doc: doc,
                    message: 'Item Updated Successfully!'
                });
            

        })

})



//delete todo
exports.deleteTodo = asyncHandler(async (req, res) => {

  
    // console.log(data);
    await Todo.findByIdAndDelete(req.params.id);
    return res.status(200).send({
        success: true,
        message: "Todo deleted successfully"
    });
    //     })
})