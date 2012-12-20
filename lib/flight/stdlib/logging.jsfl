/**
 * @fileOverview  This file has logging modules.
 */

/**
 * @module    logging
 * @requires  text
 * @requires  console
 */

var text = require("text")
  , console = require("console");

(function() {
  /**
   * @private
   */
  var isInit, config, holder;

  /**
   * Enum for the log output levels of module:logging.Logger
   * @memberOf  module:logging
   * @enum      {number}  Level Define the log level.
   */
  var Level = {
    ALL: 255
    , DEBUG: 128
    , INFO: 16
    , WARN: 8
    , ERROR: 4
    , FATAL: 2
    , OFF: 1
  };

  var Config = (function() {
    /**
     * Create a new Config object.
     * @memberOf  module:logging
     * @class     Config  class holds a settings for Logger.
     * @param     {Object}  obj             - An object with a property equivalent to Hoge
     * @property  {number}  level           - threshold for log level.
     * @property  {boolean} fileEnabled     - Shown whether the output to log files is performed.
     *                                        The default value is false.
     * @property  {string}  outDir          - Shown an output directory.
     *                                        The default value is $ProjectRoot/logs
     * @property  {boolean} consoleEnabled  - Shown whether the output to a console is performed.
     *                                        The default value is true.
     */
    function Config(obj) {
      if (!obj) { obj = {}; }
      this.level = obj.level;
      this.fileEnabled = obj.fileEnabled;
      this.outDir = obj.outDir;
      this.consoleEnabled = obj.consoleEnabled;
      if (!this.level) { this.level = Level.ALL; }
      if (!this.fileEnabled) { this.fileEnabled = false; }
      if (!this.outDir) { this.outDir = __projectRoot + "logs/"; }
      if (!this.consoleEnabled) { this.consoleEnabled = true; }
    }
    return Config;
  })();

  var Record = (function() {
    /**
     * Create a new Record object.
     * @memberOf  module:logging
     * @class     Record  reserved.
     * @param     {number}  level       -
     * @param     {string}  callerName  -
     * @param     {string}  message     -
     */
    function Record(level, callerName, message) {
      this.date = new Date();
      this.level = level;
      this.callerName = callerName;
      this.message = message;
    }
    return Record;
  })();

  var Formatter = (function() {
    /**
     * Create a new Formatter object.
     * @memberOf  module:logging
     * @class     Formatter reserved.
     */
    function Formatter() {
    }
    Formatter.prototype.format = function(record) {
      return "";
    }
    return Formatter;
  })();

  var DefaultFormatter = (function(super) {
    /**
     * Create a new DefaultFormatter object.
     * @memberOf  module:logging
     * @class     DefaultFormatter  reserved.
     * @extends   module:logging.Formatter
     */
    function DefaultFormatter() {}
  })(Formatter);

  var Handler = (function() {
    /**
     * Create a new Handler object.
     * @memberOf  module:logging
     * @class     Handler reserved.
     */
    function Handler() {
    }
    return Handler;
  })();

  var ConsoleHandler = (function(super) {
    __inherit(ConsoleHandler, super);
    /**
     * Create a new ConsoleHandler object.
     * @memberOf  module:logging
     * @class     ConsoleHandler  reserved.
     */
    function ConsoleHandler() {
      super.call(this);
    }
    return ConsoleHandler;
  })(Handler);

  var FileHandler = (function(super) {
    __inherit(FileHandler, super);
    /**
     * Create a new FileHandler object.
     * @memberOf  module:logging
     * @class     FileHandler reserved.
     */
    function FileHandler() {
      super.call(this);
    }
    return FileHandler;
  })(Handler);

  var MemoryHandler = (function(super) {
    __inherit(MemoryHandler, super);
    /**
     * Create a new MemoryHandler object.
     * @memberOf  module:logging
     * @class     FileHandler reserved.
     */
    function MemoryHandler() {
      super.call(this);
      this.records = [];
    }
    return MemoryHandler;
  })(Handler);

  var Logger = (function() {
    /**
     * Create a new Logger object
     * @memberOf  module:logging
     * @name      Logger
     * @class     Logger  object is used to log messages for a specific system or application component.
     * @param     {string}  callerName  - character string of name of caller
     */
    function Logger(callerName) {
      this._callerName = callerName;
    }

    /**
     * Log a fatal message.
     * @memberOf  module:logging.Logger.prototype
     * @name      fatal
     * @function
     * @param     {string}  message - logging message
     */
    Logger.prototype.fatal = function(message) {
      this.log(Level.FATAL, this._callerName, message);
    };

    /**
     * Log a error message.
     * @memberOf  module:logging.Logger.prototype
     * @name      error
     * @function
     * @param     {string}  message - logging message.
     */
    Logger.prototype.error = function(message) {
      this.log(Level.ERROR, this._callerName, message);
    };

    /**
     * Log a warning message.
     * @memberOf  module:logging.Logger.prototype
     * @name      warn
     * @function
     * @param     {string}  message - logging message.
     */
    Logger.prototype.warn = function(message) {
      this.log(Level.WARN, this._callerName, message);
    };

    /**
     * Log an infomation message.
     * @memberOf  module:logging.Logger.prototype
     * @name      info
     * @function
     * @param     {string}  message - logging message
     */
    Logger.prototype.info = function(message) {
      this.log(Level.INFO, this._callerName, message);
    };

    /**
     * Log a debug message.
     * @memberOf  module:logging.Logger.prototype
     * @name      debug
     * @function
     * @param     {string}  message - logging message.
     */
    Logger.prototype.debug = function(message) {
      this.log(Level.DEBUG, this._callerName, message);
    };

    /**
     * Log a message.
     * @memberOf  module:logging.Logger.prototype
     * @name      log
     * @function
     * @param     {string}  level       - module:logging.Level
     * @param     {string}  callerName  - name of caller
     * @param     {string}  message     - logging message
     */
    Logger.prototype.log = function(level, callerName, message) {
      if (!isInit) { init(); }
      var doLogging = (config.level & level);
      if (!doLogging) { return; }
      var levelStr = "default";
      switch (level) {
        case Level.DEBUG: {
          levelStr = "debug";
          break;
        }
        case Level.INFO: {
          levelStr = "info";
          break;
        }
        case Level.WARN: {
          levelStr = "warn";
          break;
        }
        case Level.ERROR: {
          levelStr = "error";
          break;
        }
        case Level.FATAL: {
          levelStr = "fatal";
          break;
        }
        default: {
          break;
        }
      }
      var formatted = format(new Date(), levelStr, callerName, message);
      if (config.fileEnabled) {
        formatted += "\n";
        var outDir = config.outDir;
        FLfile.createFolder(outDir);
        var fileUri = outDir + levelStr + ".log";
        FLfile.write(fileUri, formatted, "append");
      }
      if (config.consoleEnabled) {
        console.log(formatted);
      }
    };
    return Logger;
  })();

  /**
   * Initialize logging module.
   * @memberOf  module:logging
   * @name      init
   * @function
   * @static
   * @param     {module:logging.Config}  conf - Config object.
   * @see       module:logging.Config
   * @see       module:logging.Level
   */
  var init = function(conf) {
    if (!conf) { conf = new Config(); }
    config = conf
    holder = {};
    isInit = true;
  };

  /**
   * @memberOf  module:logging
   * @name      get
   * @function
   * @static
   * @param     {string}  callerName  - The specified character string as a key.
   * @returns   {module:logging.Logger} The Logger object generated based on the specified character string.
   */
  var get = function(callerName) {
    if (!isInit) { init(); }
    var logger = holder[callerName];
    if (!logger) {
      logger = new Logger(callerName);
      holder[callerName] = logger;
    }
    return logger;
  };

  /**
   * @memberOf  module:logging
   * @name      format
   * @function
   * @static
   * @param     {Date}    date        - output date.
   * @param     {string}  fileName    - output filename.
   * @param     {string}  callerName  - caller name.
   * @param     {string}  message     - output message.
   * @returns   {string}  The character string changed into log output form.
   */
  var format = function(date, fileName, callerName, message) {
    var msg = "";
    if (!date) { date = new Date(); }
    var dateStr = JSON.stringify(date).replace(/\"/, "");
    msg = text.format("[%s][%s][%s]%s", dateStr, fileName, callerName, message);
    return msg;
  };

  exports.Level = Level;
  exports.Config = Config;
  exports.Record = Record;
  exports.Formatter = Formatter;
  exports.DefaultFormatter = DefaultFormatter;
  exports.Handler = Handler;
  exports.ConsoleHandler = ConsoleHandler;
  exports.FileHandler = FileHandler;
  exports.MemoryHandler = MemoryHandler;
  exports.Logger = Logger;
  exports.init = init;
  exports.get = get;
  exports.format = format;
})();

