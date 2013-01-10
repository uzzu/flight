/**
 * @fileOverview  This file has app module.
 */

/**
 * @module    app
 * @requires  logging
 * @requires  text
 */

var logging = require("logging")
  , text = require("text");

/**
 * Enum for the end method at the time of the end of application.
 * @memberOf  module:app
 * @enum      {string}
 */
var Ending = {
  NOP: "nop"
  , CONFIRM: "confirm"
  , EXIT: "exit"
};

var Context = (function() {
  /**
   * Create a new Context object.
   * @memberOf  module:app
   * @class     Context class holding the states.
   * @param     {Flight.Env}  env - framework environment.
   */
  function Context(env) {
    this._holder = {};
    this._env = env;
  }

  /**
   * @memberOf  module:app.Context.prototype
   * @name      get
   * @function
   * @param     {string}  key - The specified character string as a key.
   * @returns   {object}  The object which holds the specified character string as a key.
   *                      If the context does not have an object, return null.
   */
  Context.prototype.get = function(key) {
    if (!this.isSet(key)) { return null; }
    return this._holder[key];
  }

  /**
   * Hold an object by using the specified character string as a key.
   * @memberOf  module:app.Context.prototype
   * @name      put
   * @function
   * @param     {string}  key   - The specified character string as a key.
   * @param     {object}  value - the holding object.
   */
  Context.prototype.put = function(key, value) {
    this._holder[key] = value;
  }

  /**
   * Remove an object by using the specified character string as a key.
   * @memberOf  module:app.Context.prototype
   * @name      remove
   * @function
   * @param     {string}  key - The specified character string as a key.
   */
  Context.prototype.remove = function(key) {
    delete this._holder[key];
  }

  /**
   * @memberOf  module:app.Context.prototype
   * @name      isSet
   * @function
   * @param     {string}  key - The specified character string as a key.
   * @returns   {boolean} true if the context has an object by using the specified character string as a key.
   */
  Context.prototype.isSet = function(key) {
    if (this._holder.hasOwnProperty(key)) {
      if (this._holder[key] !== undefined) {
        return true;
      }
    }
    return false;
  }
  return Context;
})();

var Base = (function() {
  /**
   * Create a new Base object.
   * @memberOf  module:app
   * @class     Base  class of all the execution applications.
   *                  The class which makes Base a parent class
   *                  needs to carry out the override of #run() method
   *                  to describe real processing of application.
   * @param     {Object}              options   - Application options
   * @property  {module:app.Context}  _context  - Application context.
   * @property  {Object}              _options  - Application.options.
   */
  function Base(options) {
    /**
     * @protected
     */
    this._context = new Context();
    this._options = options;
    if (!this._options) { this._options = {}; }
  }

  /**
   * Execute application.
   * @memberOf  module:app.Base.prototype
   * @name      run
   * @function
   */
  Base.prototype.run = function() {
    logging.init(new logging.Config(this._options.logging));
    var logger = this._getLogger();
    logger.info("Start to execute application.");
    logger.info("options: " + JSON.stringify(this._options));
    try {
      this._process();
      logger.info("Succeed to execute application.");
    } catch (error) {
      logger.error(text.format("Failed to execute appliation.%s\n%s", error.message, error.stack));
    } finally {
      this._callEnding(this._options.ending);
    }
  }

  Base.prototype._callEnding = function(ending) {
    if (!ending || ending == Ending.NOP) {
      return __nop();
    }
    if (ending == Ending.CONFIRM) {
      return exit();
    }
    if (ending == Ending.EXIT) {
      return exit(false);
    }
  };

  /**
   * @memberOf    module:app.Base.prototype
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
   * @memberOf  module:app.Base.prototype
   * @name      _process
   * @function
   * @protected
   */
  Base.prototype._process = function() {
  }

  return Base;
})();

exports.Ending = Ending;
exports.Context = Context;
exports.Base = Base;

