const Todo = require('../models/todo.model')
const asyncHandler = require('express-async-handler');
const { query } = require('express');

//create and save a new todo
exports.createNewTodo = asyncHandler(async (req, res) => {
    const { description, dateCreated, todoId, name } = req.body;

    if (!description) {
        return res.status(400).send({
            message: "Todo description can not be empty"
        });
    }

    if (!dateCreated) {
        return res.status(400).send({
            message: "Todo date created can not be empty"
        });
    }

    if (!todoId) {
        return res.status(400).send({
            message: "Todo todo Id can not be empty"
        });
    }

    //create a todo
    const todo = new Todo({
        name: name || "Untitled Todo",
        description: description,
        dateCreated: dateCreated,
        todoId: todoId
    })

    //check if id is same
    var item = await Todo.findOne({ todoId: todoId });
    if (item) { return res.status(400).send({ message: "Pick new id" }) }
    //save todo in a database
    await todo.save(function (error, data) {

        if (error) return res.status(403).json({ message: error.message });

        res.send(data);

    })

})

//retrieve and return  all todos from databaase
exports.getAllTodos = asyncHandler(async (req, res) => {
    const { offset,limit, queryString} = req.query;
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
        offset: offset ||  0,
        limit: limit || 20

    }).then((data) => {
        // console.log(data)
        return res.status(200).json({
            success: true,
            data: data
        });
    })
        .catch((error) => {
            // console.log(error)
            return res.status(403).json({
                success: false,
                message: error.message
            });
        })
})

// reetrieve a single todo with an id
exports.getOneTodo = asyncHandler(async (req, res) => {
    const id = req.params.id
    // console.log(id)
    var result = await Todo.findOne({ todoId: id });
    if (!result) return res.status(404).json({
        success: false,
        message: 'Item Not Found'
    });
    return res.status(200).json({
        success: true,
        result: result
    });

})

//update a todo identified by the id in the request
exports.updateTodo = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { description, dateAccomplished, name } = req.body;

    //validate description
    if (!description) {
        return res.status(400).send({
            message: "Todo description cannot be empty"
        });
    }

    if (!dateAccomplished) {
        return res.status(400).send({
            message: "Todo date accomplished can not be empty"
        });
    }

    //find todo and update 
    Todo.findOneAndUpdate({ todoId: id },
        {
            $set: {
                title: name || "Untitled Todo",
                description: description,
                dateUpdated: dateAccomplished
            }
        },
        { new: true },
        (err, result) => {
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

            if (result == null) {
                return res.status(404).json({
                    success: false, message: 'No Item Found!'
                });

            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Item Updated Successfully!'
                });
            }

        })

})



//delete todo
exports.deleteTodo = asyncHandler(async (req, res) => {

  //load params
  const id = req.params.id
  // find data
  const data = await Todo.findOne({todoId: id});
  if (!data) return res.status(404).json({
    success: false,
    message: 'The item not found, may have been deleted'
  });
  // console.log(data);
  await Todo.findOneAndRemove({todoId: id});
  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully"
  });

    // Todo.findByIdAndRemove(req.params.id)
    //     .then(todo => {
    //         if (!todo) {
    //             return res.status(404).send({
    //                 message: "Todo not found with id " + req.params.id
    //             });
    //         }
    //         res.send({ message: "Todo deleted successfully!" });

    //     }).catch(err => {
    //         if (err.kind === 'ObjectId' || err.name === 'NotFound') {
    //             return res.status(404).send({
    //                 message: "Todo not found with id " + req.params.todo
    //             });
    //         }
    //         return res.status(500).send({
    //             message: "Could not delete todo with id " + req.params.id
    //         });

    //     })
})