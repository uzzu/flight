/**
 * @fileOverview  This file define global objects which created by Flight framework.
 */

/**
 * Holds global scope objects which created by Flight framework.
 * @module  flight/global
 */

/**
 * @ignore
 */
var flight = flight || {};

/**
 * @undocumented
 */
var __flightRoot
  , __projectRoot
  , __filename
  , __dirname
  , __nop
  , __inherit
  , JSON
  , exit
  , getStackTrace
  , require
  , module
  , exports;

(function(ns) {
  /**
   * @private
   * @memberOf  flight
   * @namespace global
   */
  var global = global || {};

  (function(ns) {
    /**
     * The character string which shows the root directory of Flight framework.
     * @global
     * @var       __flightRoot
     * @type      {string}
     */
    ns.__flightRoot = null;

    /**
     * The character string which shows the root directory of script.
     * @global
     * @var       __projectRoot
     * @type      {string}
     */
    ns.__projectRoot = null;

    /**
     * The character string which shows the file of the script under present execution.
     * @global
     * @var       __filename
     * @type      {string}
     */
    ns.__filename = null;

    /**
     * The character string which shows the directory of the script under present execution.
     * @global
     * @var       __dirname
     * @type      {string}
     */
    ns.__dirname = null;

    /**
     * No operand.
     * @global
     * @name      __nop
     * @function
     */
    ns.__nop = function() {};

    /**
     * Inherit class.
     * @global
     * @name      __inherit
     * @function
     * @param     {function}  child   - The class made into a child
     * @param     {function}  parent  - The class made into parent
     */
    ns.__inherit = function(child, parent) {
      function Extended() {
        this.constructor = child;
      }
      Extended.prototype = parent.prototype;
      child.prototype = new Extended();
    };

    ns.JSON = (function(undefined) {
      /**
       * @inner
       */
      var getClass = Object.prototype.toString
        , hasOwnProperty = Object.prototype.hasOwnProperty
        , escapeable = /["\\\x00-\x1f\x7f-\x9f]/g
        , metaKeyStr = '\b\t\n\f\r"\\'
        , meta = {
          "\b": "\\b"
          , "\t": "\\t"
          , "\n": "\\n"
          , "\f": "\\f"
          , "\r": "\\r"
          , '"' : '\\"'
          , "\\": "\\\\"
        };

      /**
       * @private
       * @name      formatDigits
       * @function
       * @inner
       * @param     {number}  digits  - The maximum display digit.
       * @param     {number}  num     - Format for.
       * @returns   {string}  character string with format digit.
       */
      var formatDigits = function(digits, num) {
        return ("000000000000" + (num || 0)).slice(-digits);
      };

      /**
       * @private
       * @name      quote
       * @function
       * @inner
       * @param     {string}  str - Quote for.
       * @returns   {string}  character string with quoted.
       */
      var quote = function(str) {
        var prefix = '"'
          , suffix = '"'
          , body = ""
          , i = 0
          , char = "";
        for (; char = str.charAt(i); i++) {
          if (metaKeyStr.indexOf(char) != -1) {
            body += meta[char];
          } else if (char < " ") {
            body += "\\u00" + formatDigits(2, char.charCodeAt(0).toString(16));
          } else {
            body += char;
          }
        }
        return prefix + body + suffix;
      };

      /**
       * Create a new JSON object
       * (, but The interfaces of JSON is static only).
       * @global
       * @class     JSON  object is used to encode to JSON string and parse JSON.
       */
      function JSON() {};

      /**
       * @memberOf  JSON
       * @name      stringify
       * @function
       * @static
       * @param     {Object}                    object  - The object to create a JSON string for.
       * @param     {Array.<*>|Object|Function} filter  - unused(reserved).
       * @param     {number}                    width   - unused(reserved).
       * @returns   {string}  The JSON string presenting object.
       */
      JSON.stringify = function(object, filter, width) {
        var type = typeof object;
        if (object === null) { return "null"; }
        if (type === "undefined") { return "null"; }
        if (type === "string") { return quote(object); }
        if (type === "number") { return (object > -1 / 0) && (object < 1 / 0) ? "" + object : "null"; }
        if (type === "boolean") { return "" + object; }
        if (type === "object") {
          // type of Date
          if (object.constructor === Date) {
            var fullYear = object.getUTCFullYear()
              , month = object.getUTCMonth() + 1
              , day = object.getUTCDate()
              , hours = object.getUTCHours()
              , minutes = object.getUTCMinutes()
              , seconds = object.getUTCSeconds()
              , milliseconds = object.getUTCMilliseconds();
            month = formatDigits(2, month);
            day = formatDigits(2, day);
            hours = formatDigits(2, hours);
            minutes = formatDigits(2, minutes);
            seconds = formatDigits(2, seconds);
            milliseconds = formatDigits(3, milliseconds);
            var dateFormatted = '"' + fullYear + "-" + month + "-" + day +
                                "T" + hours + ":" + minutes + ":" + seconds +
                                "." + milliseconds + 'Z"';
            return dateFormatted;
          }

          // typeof Array
          if (object.constructor === Array) {
            var array = [];
            for (var i = 0; i < object.length; i++) {
              var item = JSON.stringify(object[i]);
              if (!item) { item = "null" };
              array.push(item);
            }
            var arrayFormatted = "[" + array.join(",") + "]";
            return arrayFormatted;
          }

          // typeof Object
          var name,
            value,
            pairs = [];
          for (var key in object) {
            if (!hasOwnProperty.call(object, key)) { continue; }
            type = typeof key;
            if (type === "number") {
              name = '"' + key + '"';
            } else if (type === "string") {
              name = quote(key);
            } else {
              continue;
            }
            type = typeof object[key];
            if (type === "function" || type === "undefined") {
              continue;
            }
            value = JSON.stringify(object[key]);
            pairs.push(name + ":" + value);
          }
          var objectFormatted = "{" + pairs.join(",") + "}";
          return objectFormatted;
        };
      };

      /**
       * @memberOf  JSON
       * @name      parse
       * @function
       * @param     {string}    source    - The JSON string presenting the object.
       * @param     {Function}  callback  - unused(reserved).
       * @returns   {Object}  The object as specified by source.
       */
      JSON.parse = function(source, callback) {
        if(source != null && source != "" && source != undefined) {
          return eval("(" + source + ")");
        }
        return null;
      };
      return JSON;
    })();

    /**
     * Exit Flash IDE.
     * @memberOf  module:flight/global
     * @name      exit
     * @function
     * @global
     * @param     {boolean=true}  promptNeeded  - When displaying the prompt for saving the changed document,
     */
    ns.exit = function(promptNeeded) {
      if (promptNeeded !== false) { promptNeeded = true; }
      fl.quit(promptNeeded);
    };

    /**
     * Returns the stack trace.
     * @global
     * @name      getStackTrace
     * @function
     * @returns   {string}  The stack trace.
     */
    ns.getStackTrace = function() {
      var error = new Error();
      var stacks = error.stack.split("\n");
      stacks.shift();
      stacks.shift();
      return stacks.join("\n");
    };

    /**
     * @var       require
     * @type      {function(id:string):*}
     * @global
     */
    ns.require = null;

    /**
     * The module object of the script file under present execution.
     * @global
     * @var       module
     * @type      {module:flight/module.Module}
     */
    ns.module = null;

    /**
     * A value is assigned to the member of this property
     * to exhibit an object as a module.
     * @global
     * @var       exports
     * @type      {Object}
     */
    ns.exports = null;

    /**
     * Set require property on global scope.
     * @undocumented
     * @memberOf      module:flight/global
     * @name          setRequire
     * @function
     * @param         {module:flight/module.Module} value - require object.
     */
    ns.setRequire = function(value) {
      require = ns.require = value;
    };

    /**
     * Set module property on global scope.
     * @undocumented
     * @memberOf      module:flight/global
     * @name          setModule
     * @function
     * @param         {module:flight/module.Module} value - module object.
     */
    ns.setModule = function(value) {
      module = ns.module = value;
    };

    /**
     * Set exports property on global scope.
     * @undocumented
     * @memberOf      module:flight/global
     * @name          setExports
     * @function
     * @param         {Object}  value - exports object.
     */
    ns.setExports = function(value) {
      exports = ns.exports = value;
    };

    /**
     * Set __filename property on global scope.
     * @undocumented
     * @memberOf      module:flight/global
     * @name          setFilename
     * @function
     * @param         {string}  value - filename.
     */
    ns.setFilename = function(value) {
      __filename = ns.__filename = value;
    };

    /**
     * Set __dirname property on global scope.
     * @undocumented
     * @memberOf      module:flight/global
     * @name          setDirname
     * @function
     * @param         {string}  value - directory uri.
     */
    ns.setDirname = function(value) {
      __dirname = ns.__dirname = value;
    };

    /**
     * Initialize flight/global module.
     * @undocumented
     * @memberOf  module:flight/global
     * @name      init
     * @function
     * @param     {!Window}  global       - Global scope.
     * @param     {!string}  flightRoot   - The root directory of the Flight framework.
     * @param     {!string}  projectRoot  - The root directory of the project using Flight framework.
     */
    ns.init = function(global, flightRoot, projectRoot) {
      __flightRoot = ns.__flightRoot = flightRoot;
      __projectRoot = ns.__projectRoot = projectRoot;
      __nop = ns.__nop;
      __inherit = ns.__inherit;
      __filename = ns.__filename;
      __dirname = ns.__dirname;
      JSON = ns.JSON;
      exit = ns.exit;
      getStackTrace = ns.getStackTrace;
      require = ns.__nop;
      module = ns.module;
      exports = ns.exports;
    };
  })(global);
  ns.global = global;
})(flight);

/**
 * Alias of module:flight/global#init
 * @name      global$init
 * @function
 * @param     {!Window}  global       - Global scope.
 * @param     {!string}  flightRoot   - The root directory of the Flight framework.
 * @param     {!string}  projectRoot  - The root directory of the project using Flight framework.
 */
var global$init = function(scope, flightRoot, projectRoot) {
  flight.global.init(scope, flightRoot, projectRoot);
};

