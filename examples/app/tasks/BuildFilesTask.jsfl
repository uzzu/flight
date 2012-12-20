/**
 * @fileOverview  This file has BuildFilesTask class contained in a app/tasks module.
 */

/**
 * Submodule of module:app/tasks.
 * @ignore
 * @module    app/tasks
 * @requires  task
 * @requires  logging
 * @requires  fs
 * @requires  collection
 */

var task = require("task")
  , logging = require("logging")
  , fs = require("fs")
  , text = require("text")
  , collection = require("collection")
  , BuildTask = require("./BuildTask")
  , DebugBuildTask = require("./DebugBuildTask")
  , ReleaseBuildTask = require("./ReleaseBuildTask");

(function(undefined) {

  var BuildFilesTask = (function(super) {
    __inherit(BuildFilesTask, super);

    /**
     * Create a new BuildFilesTask object.
     * @memberOf  module:app/tasks
     * @class     BuildFilesTask
     * @extends   module:task.Base
     * @param     {module:app.Context}  context       - Application context.
     * @param     {Object}              options       - Task options.
     * @property  {Object}              _buildTaskMap - Map of Task for building fla.
     */
    function BuildFilesTask(context, options) {
      super.call(this, context, options);
      var buildTaskMap = {};
      buildTaskMap[BuildTask.name] = BuildTask;
      buildTaskMap[DebugBuildTask.name] = DebugBuildTask;
      buildTaskMap[ReleaseBuildTask.name] = ReleaseBuildTask;
      this._buildTaskMap = buildTaskMap;
    }

    /**
     * @memberOf  module:app/tasks.BuildFilesTask.prototype
     * @name      _process
     * @function
     * @protected
     * @throws    {Error} When filelist file does not exist.
     * @throws    {Error} When target file does not exist or target file is invalid format.
     */
    BuildFilesTask.prototype._process = function() {
      var logger = this._getLogger();
      var options = this._createBuildOptions(this._options.filelist);
      if (options.isEmpty()) {
        logger.warn("%s was empty.", uri);
        return;
      }

      var buildTaskClass = this._buildTaskMap[this._options.build_by];
      if (!buildTaskClass) {
        buildTaskClass = BuildTask;
      }
      var buildTasks = this._createBuildTasks(buildTaskClass, this._context, options);
      if (buildTasks.isEmpty()) {
        logger.warn("Build task was empty.");
        return;
      }

      var skipping = false;
      var failedFileUri = "";
      for (var itr = buildTasks.iterator(); itr.hasNext();) {
        var t = itr.next();
        if (skipping) {
          logger.info(text.format("(%d/%d)Skipped.", itr.pos(), itr.size()));
          continue;
        }
        logger.info(text.format("(%d/%d)Running.", itr.pos(), itr.size()));
        var result = t.run();
        if (result === task.Status.FAIL) {
          logger.info(text.format("(%d/%d)Failed.", itr.pos(), itr.size()));
          skipping = true;
          failedFileUri = t.getFilename();
        }
      }
      if (skipping) {
        throw new Error("Failed to build => ", failedFileUri);
      }
    };

    /**
     * @memberOf  module:app/tasks.BuildFilesTask.prototype
     * @name      _process
     * @function
     * @protected
     * @param     {function}            buildTaskClass  - constructor to use build project.
     * @param     {module:app.Context}  context         - application context.
     * @param     {Object}              options         - object has build project task options.
     * @throws    {Error} When filelist file does not exist.
     * @throws    {Error} When target file does not exist or target file is invalid format.
     * @returns   {module:collection.Deque.<BuildTask>}  task objects.
     */
    BuildFilesTask.prototype._createBuildTasks = function(buildTaskClass, context, options) {
      var logger = this._getLogger();
      var tasks = new collection.Deque();
      for (var itr = options.iterator(); itr.hasNext();) {
        var buildTask = new buildTaskClass(this._context, itr.next());
        tasks.push(buildTask);
      }
      return tasks;
    };

    /**
     * Create options from a text file.
     * @memberOf  module:app/tasks.BuildFilesTask.prototype
     * @name     BuildFilesTask.prototype._createBuildOptions
     * @function
     * @param     {string}  uri - filelist uri.
     * @returns   {module:collection.Deque.<Object>}  task objects.
     */
    BuildFilesTask.prototype._createBuildOptions = function(uri) {
      var logger = this._getLogger();

      logger.debug(text.format("Open filelist file: %s", uri));
      var file = new fs.File(uri);
      if (!file.exists()) {
        throw new Error(text.format("%s was not exist.", uri));
      }
      var options = new collection.Deque();
      var data = file.read();
      if (!data) {
        return options;
      }

      data = data.replace(/\r\n/g, "\n");
      var datas = data.split("\n");
      var length = datas.length;
      for (var i = 0; i < length; i++) {
        var fileuri = datas[i];
        if (!fileuri) { continue; }
        var option = { "filename": fileuri };
        options.push(option);
      }
      return options;
    };

    return BuildFilesTask;
  })(task.Base);

  module.exports = BuildFilesTask;
})();

