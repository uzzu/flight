/**
 * @fileOverview  This file has text modules.
 */

/**
 * @module  text
 */

(function(undefined) {
  /**
   * @private
   * @inner
   */
  var formatRegExp = /%[sdj%]/g;

  /**
   * Format String
   * @memberOf  module:text
   * @name      format
   * @function
   * @param     {... Object}  var_args - substitution patterns like 'printf' or object.
   */
  var format = function(obj) {
    if (typeof obj !== "string") {
      var args = [];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      return args.join(" ");
    }

    var i = 1;
    var args = arguments;
    var length = args.length;
    var formatted = String(obj).replace(formatRegExp, function(a) {
      if (a === "%%") { return "%"; }
      if (i >= length) { return a; }
      switch (a) {
        case "%d":
        case "%i": {
          var num = Number(args[i++]);
          if (isNaN(num)) {
            return num;
          }
          return String(num).split(".")[0];
        }
        case "%f": { return Number(args[i++]); }
        case "%s": { return String(args[i++]); }
        case "%j": { return JSON.stringify(a); }
        default: { return a; }
      }
    });
    for (var obj = args[i]; i < length; obj = args[++i]) {
      formatted += " " + obj;
    }
    return formatted;
  };

  /**
   * Create a new XML object from character string.
   * @memberOf  module:text
   * @name      toXML
   * @function
   * @param     {string}  source - character string which formatted xml.
   * @throws    {Error}   when source was invalid xml character string.
   */
  var toXML = function(source) {
    var source = source.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, "");
    return new XML(source);
  };

  /**
   * @memberOf  module:text
   * @name      escapeXML
   * @function
   * @param     {string}  source
   * @returns   {string}  escaped character string that could be interpreted as XML markup.
   */
  var escapeXML = function(source) {
    return source.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/'/g, "&apos;")
                .replace(/"/g, "&quot;");
  };

  /**
   * @memberOf  module:text
   * @name      unescapeXML
   * @function
   * @param     {string}  source
   * @returns   {string}  escaped character string that could be interpreted as XML markup.
   */
  var unescapeXML = function(source) {
    return source.replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, ">")
                .replace(/&lt;/g, "<")
                .replace(/&amp;/g, "&");
  };

  exports.format = format;
  exports.toXML = toXML;
  exports.escapeXML = escapeXML;
  exports.unescapeXML = unescapeXML;
})();

