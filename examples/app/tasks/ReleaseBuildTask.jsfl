/**
 * @fileOverview  This file has ReleaseBuildTask class contained in a app/tasks module.
 */

/**
 * Submodule of module:app/tasks.
 * @ignore
 * @module    app/tasks/ReleaseBuildTask
 * @requires  logging
 * @requires  text
 * @requires  flash
 */

var logging = require("logging")
  , text = require("text")
  , flash = require("flash")
  , BuildTask = require("./BuildTask");

var as3ConfigConst = 'CONFIG::DEBUG="false";CONFIG::DEBUG4FLASH="false";';

var ReleaseBuildTask = (function(super) {
  __inherit(ReleaseBuildTask, super);

  /**
   * Create a new ReleaseBuildTask object.
   * @memberOf  module:app/tasks
   * @class     ReleaseBuildTask
   * @extends   module:app/tasks.BuildTask
   * @param     {module:app.Context}  context - Application context.
   * @param     {Object}              options - Task options.
   */
  function ReleaseBuildTask(context, options) {
    super.call(this, context, options);
  }

  /**
   * @memberOf  module:app/tasks.ReleaseBuildTask.prototype
   * @name      _process
   * @function
   * @protected
   * @throws    {Error} When target file does not exist or target file is invalid format.
   */
  ReleaseBuildTask.prototype._process = function() {
    var logger = this._getLogger();
    logger.debug(text.format("Open Project: %s", this._options.filename));
    var project = flash.createProject(this._options.filename);
    project.open();
    logger.debug(text.format("Get Publish profile: %s", this._options.filename));
    var profile = project.getPublishProfile();
    logger.debug(text.format("Set AS3ConfigConst: %s", as3ConfigConst));
    profile.PublishFlashProperties.AS3ConfigConst = as3ConfigConst;
    logger.debug(text.format("Apply Publish profile: %s", this._options.filename));
    project.applyPublishProfile(profile);
    logger.debug(text.format("Publish: %s", this._options.filename));
    project.publish();
    logger.debug(text.format("Close project: %s", this._options.filename));
    project.close();
  };
  return ReleaseBuildTask;
})(BuildTask);

module.exports = ReleaseBuildTask;

