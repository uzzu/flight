/**
 * @fileOverview  This file has BuildTask class contained in a app/tasks. module.
 */

/**
 * Submodule of module:app/tasks.
 * @ignore
 * @module    app/tasks
 * @requires  task
 * @requires  logging
 * @requires  text
 * @requires  flash
 */

var task = require("task")
  , logging = require("logging")
  , text = require("text")
  , flash = require("flash");

var BuildTask = (function(super) {
  __inherit(BuildTask, super);

  /**
   * Create a new BuildTask object.
   * @memberOf  module:app/tasks
   * @class     BuildTask
   * @extends   module:task.Base
   * @param     {module:app.Context}  context - Application context.
   * @param     {Object}              options - Task options.
   */
  function BuildTask(context, options) {
    super.call(this, context, options);
  }

  /**
   * @memberOf  module:app/tasks.BuildTask.prototype
   * @name      getFilename
   * @function
   * @returns   {string}  URI of the target file for build.
   */
  BuildTask.prototype.getFilename = function() {
    return this._options.filename;
  };

  /**
   * @memberOf  module:app/tasks.BuildTask.prototype
   * @name      _process
   * @function
   * @protected
   * @throws    {Error} When target file does not exist or target file is invalid format.
   */
  BuildTask.prototype._process = function() {
    var logger = this._getLogger();
    logger.debug(text.format("Fast-publish Project: %s", this._options.filename));
    flash.createProject(this._options.filename).fastPublish();
  };
  return BuildTask;
})(task.Base);
module.exports = BuildTask;

