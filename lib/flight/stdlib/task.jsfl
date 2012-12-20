/**
 * @fileOverview  This file has task modules.
 */

/**
 * @module    task
 * @requires  app
 * @requires  logging
 */

var app = require("app")
  , logging = require("logging");

(function(undefined) {
  /**
   * Status define the execution result a Task.
   * @memberOf  module:task
   * @enum      {string}
   */
  var Status = {
    SUCCESS: "success"
    , SKIPPED: "skipped"
    , FAIL: "fail"
  };

  var Base = (function() {
    /**
     * Use to create unique idendifier of task object.
     * @private
     * @memberOf  module:task.Base
     * @type      {number}
     * @inner
     */
    var serial = 0;

    /**
     * Create a new Base object.
     * @memberOf  module:task
     * @class     Base class of all the execution tasks.
     *            The class which makes Base a parent class
     *            needs to carry out the override of #_process() method
     *            to describe real processing of task.
     *            A throw of the Error object within a #_process() method
     *            to notify what the task went wrong.
     * @param     {module:app.Context}  context - Application context.
     * @param     {Object}              options - Options of task.
     * @property  {number}              serial  - Unique identifer of task object.
     */
    function Base(context, options) {
      this.serial = ++serial;
      this._context = context;
      this._options = options;
      if (!this._options) { this._options = {}; }
    }

    /**
     * Execute task.
     * @memberOf  module:task.Base.prototype
     * @name      run
     * @function
     * @returns   {String}  The execution result a Task.
     * @see       module:task.Status
     * */
    Base.prototype.run = function() {
      var logger = this._getLogger();
      try {
        logger.info("Start to execute task.");
        this._process();
      } catch (error) {
        logger.error("Failed to execute task." + error.message + "\n" + error.stack);
        return Status.FAIL;
      }
      logger.info("Succeed task.");
      return Status.SUCCESS;
    };

    /**
     * @memberOf    module:task.Base.prototype
     * @name        _getLogger
     * @function
     * @protected
     * @returns     {module:logging.Logger} The Logger object unique to a constructor name.
     */
    Base.prototype._getLogger = function() {
      return logging.get(this.constructor.name);
    }

    /**
     * Execution of #_process will perform the #run() method of an object within the method.
     * @memberOf    module:task.Base.prototype
     * @name        _process
     * @function
     * @protected
     */
    Base.prototype._process = function() {
    };

    return Base;
  })();

  exports.Status = Status;
  exports.Base = Base;
})();

