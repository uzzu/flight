/**
 * @fileOverview  This file has app/taskapp module.
 */

/**
 * @module    app/taskapp
 * @requires  app
 * @requires  task
 * @requires  collection
 * @requires  app/task
 */

var app = require("app")
  , task = require("task")
  , collection = require("collection")
  , tasks = require("./tasks");

var TaskApp = (function(super) {
  __inherit(TaskApp, super);

  /**
   * Create a new TaskApp object.
   * @memberOf  app/taskapp
   * @class     TaskApp class is used to execute task.
   * @extends   module:app.Base
   * @param     {Object}  options -
   */
  function TaskApp(options) {
    super.call(this, options);
  }

  /**
   * @memberOf  module:app/taskapp.TaskApp.prototype
   * @name      _process
   * @function
   * @throws    {Error} When execution of a task goes wrong.
   */
  TaskApp.prototype._process = function() {
    var logger = this._getLogger();
    if (!this._options.tasks) { this._options.tasks = []; }
    var deque = collection.Deque.createFromArray(this._options.tasks);
    for (var itr = deque.iterator(); itr.hasNext();) {
      var t = itr.next();
      var taskClass = tasks[t.name];
      var taskObject = new taskClass(this._context, t.options);
      var result = taskObject.run();
      if (result == task.Status.FAIL) {
        throw new Error("Failed to execute task. => " + taskObject.constructor.name);
      }
    }
  }
  return TaskApp;
})(app.Base);
exports.TaskApp = TaskApp;

/**
 * Start to execute TaskApp application.
 * @memberOf  app/taskapp
 * @name      start
 * @function
 * @param     {Object}  options -
 */
exports.start = function(options) {
  var taskApp = new TaskApp(options);
  taskApp.run();
}
