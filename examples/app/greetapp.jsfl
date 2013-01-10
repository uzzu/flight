/**
 * @fileOverview  This file has app/greetapp module.
 */

/**
 * @module    app/greetapp
 * @requires  app
 * @requires  logging
 * @requires  console
 */

var app = require("app")
  , logging = require("logging")
  , console = require("console");

var GreetApp = (function(_super) {
  __inherit(GreetApp, _super);

  /**
   * Create a new GreetApp object.
   * @memberOf  module:app/greetapp
   * @class     GreetApp  is application which greeting to output panel.
   * @extends   module:app.Base
   * @param     {Object}  options - <ul><li>message: string - character string to greet.</li></ul>
   */
  function GreetApp(options) {
    _super.call(this, options);
  }

  /**
   * In a #_process() method, this application object outputs a message to output panel.
   * @memberOf  module:app/greetapp.GreetApp.prototype
   * @name      _process
   * @function
   * @protected
   */
  GreetApp.prototype._process = function() {
    console.log("[GreetApp] " + this._options.message);
  };
  return GreetApp;
})(app.Base);
exports.GreetApp = GreetApp;

/**
 * Start GreetApp application.
 * @memberOf  module:app/greetapp
 * @name      start
 * @function
 * @param     {string}  message - Greet for.
 */
exports.start = function(message) {
  var greetApp = new GreetApp({ message: message, logging: { level: logging.Level.ALL } });
  greetApp.run();
};

