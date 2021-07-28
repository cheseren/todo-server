const Category = require("../models/category.model");
const asyncHandler = require('express-async-handler');


exports.createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  // check if title is empty
  if (!title) {
    return res.status(400).send({
      success: false,
      message: "Make sure you provide the Category name"
    });
  }

  // load new category
  const category = Category({
    title: title,
    // userId: req.user._id

  });
  // make sure there is no duplication
  const itemResult = await Category.findOne({ "title": title, });
  if (itemResult) {
    return res.status(400).send({
      success: false,
      message: "Already exist"
    });
  }

  //save new 
  await category.save(function (error, data) {
    // console.log(error);
    if (error) return res.status(403).json({ error: error.message });
    return res.send({
      success: true,
      message: "Category Added Successfully!",
      data: data
    });
  });

})

exports.getCategories = asyncHandler(async (req, res) => {

  const { queryString, limit, offset } = req.query
  // console.log(queryString);
  let queryList = [];
  if (queryString) {
    queryList.push({ title: { $regex: new RegExp(queryString), $options: "i" } },)
  }

  let query = {
    $or: queryList
  }
  if (queryList.length == 0) {
    query = {}
  }

  await Category.paginate(query,
    {
      offset: offset || 0,
      limit: limit || 5,
    }).then((data) => {

      return res.status(200).json({
        success: true,
        data: data
      });

    }).catch((error) => {
      // console.log(error)
      return res.status(400).json({
        success: false,
        message: error.message
      });
    })

})



exports.getCategoryById = asyncHandler( async (req, res) => {
    // load params
    const id = req.params.id;
    // console.log(id)
    var result = await Category.findById(id);
    if (!result) return res.status(404).send({
      success: false,
      message: 'Item Not Found'
    });
    return res.status(200).send({
      success: true,
      result: result
    });
  
})

exports.updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;

  if (!title) {
    return res.status(400).send({
      message: "Title cannot be empty"
    });
  }

  let category = {};
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Update unsuccessfull!"
    })
  }
  var itemResult = await Category.findById(id);
  if (!itemResult) return res.status(404).send({
    success: false,
    message: "No Item Found"
  });
  category = itemResult;

  await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title ? title : category.title,
      },
    },
    { new: true },
    (err, result) => {

      if (err) {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Category not found with id " + id
          });
        }
        // console.log(err)
        return res.status(500).send({
          message: "Error updating category with id " + id
        });
      }

      // console.log(result);
      if (result == null) {
        return res.status(404).send({
          success: false, message: 'No Item Found!'
        });
      }
      else {
        return res.status(200).send({
          success: true,
          message: 'Item Updated Successfully!'
        });
      }
    }
  );


})

exports.deleteCategory = asyncHandler( async (req, res,) => {
    //load params
    const id = req.params.id
    // find data
    const itemResult = await Category.findById(id);
    if (!itemResult) return res.status(404).send({
      success: false,
      message: 'No Item Found'
    });
    // console.log(data);
    await Category.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Category deleted Successfully"
    });

})