const express = require('express');
const routerv100 = express.Router();
 const todoCtl = require('../controllersv100/todo.controller')

//todos
 routerv100.post('/todos', todoCtl.createNewTodo);

 routerv100.get('/todos/:id', todoCtl.getOneTodo);

 routerv100.delete('/todos', todoCtl.deleteTodo);

 routerv100.patch('/todos/:id', todoCtl.updateTodo);

 routerv100.get('/todos', todoCtl.getAllTodos);

 module.exports = routerv100