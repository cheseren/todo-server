const express = require('express');
const routerv100 = express.Router();
const todoCtl = require('../controllersv100/todo.controller')
const categoryCtl = require('../controllersv100/category.controller')

//todo todos
 routerv100.post('/todos', todoCtl.createNewTodo);

 routerv100.get('/todos/:id', todoCtl.getOneTodo);

 routerv100.delete('/todos/:id', todoCtl.deleteTodo);

 routerv100.put('/todos/:id', todoCtl.updateTodo);

 routerv100.get('/todos', todoCtl.getAllTodos);

 //todos  categories
 routerv100.post('/categories', categoryCtl.createCategory);

 routerv100.get('/categories/:id', categoryCtl.getCategoryById);

 routerv100.delete('/categories/:id', categoryCtl.deleteCategory);

 routerv100.put('/categories/:id', categoryCtl.updateCategory);

 routerv100.get('/categories', categoryCtl.getCategories);

 module.exports = routerv100