/**
 * @fileOverview This file has console module.
 */

/**
 * The console module used to log to output panel.
 * @module    console
 * @requires  text
 */

var text = require("text");

var Console = (function() {
  /**
   * Create a new Console object.
   * @memberOf  module:console
   * @class   Console class
   * @param   {outputPanel} stdout  - which displays the contents.
   * @param   {outputPanel} stderr  - which displays the error contents.
   */
  function Console(stdout, stderr) {
    this._stdout = stdout;
    this._stderr = stderr;
  };

  /**
   * Log a message to stdout.
   * You may pass as many arguments as you would like,
   * and the will be joined together in a space-delimited line.
   * @memberOf  module:console.Console.prototype
   * @name      log
   * @function
   * @param     {... Object}  var_args  -
   */
  Console.prototype.log = function() {
    this._stdout.trace(text.format.apply(this, arguments));
  };

  /**
   * @deprecated
   */
  Console.prototype.debug = Console.prototype.log;

  /**
   * @deprecated
   */
  Console.prototype.info = Console.prototype.log;

  /**
   * Log a message to stderr.
   * You may pass as many arguments as you would like,
   * and the will be joined together in a space-delimited line.
   * @memberOf  module:console.Console.prototype
   * @name      warn
   * @function
   * @alias     module:console
   * @param     {... Object}  var_args  -
   */
  Console.prototype.warn = function() {
    this._stderr.trace(text.format.apply(this, arguments));
  };

  /**
   * @deprecated
   * @alias     module:console
   */
  Console.prototype.error = Console.prototype.warn;

  /**
   * Clear stdout.
   * @memberOf  module:console.Console.prototype
   * @name      clear
   * @function
   */
  Console.prototype.clear = function() {
    this._stdout.clear();
    this._stderr.clear();
  };

  /**
   * Save to file current log on stdout.
   * @memberOf  module:console.Console.prototype
   * @name      save
   * @function
   * @alias     module:console.save
   * @param     {!string} filename  - Save as.
   */
  Console.prototype.save = function(filename) {
    // stub
    this._stdout.save(filename);
  };

  /**
   * Not implemented(reserved).
   * @memberOf  module:console.Console.prototype
   * @name      trace
   * @function
   * @alias     module:console
   */
  Console.prototype.trace = function() {
    this.warn(getStackTrace());
  };
  return Console;
})();

module.exports = new Console(fl.outputPanel, fl.outputPanel);
module.exports.Console = Console;

