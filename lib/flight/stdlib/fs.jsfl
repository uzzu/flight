/**
 * @fileOverview  This file has fs module.
 */

/**
 * @module  fs
 */

var winAbsolutePathRegExp = /^([a-zA-Z]+:|\\)\\/
  , notWinAbsolutePathRegExp = /^\//
  , fileUriRegExp = /^file:\/\//
  , rootDir = __projectRoot;

var File = (function() {
  /**
   * Create a new File object.
   * @memberOf  module:fs
   * @class     File
   * @param     {string}  filePath
   */
  function File(filePath) {
    if (!filePath) { filePath = ""; }
    this.path = filePath;
    this.uri = this._createUri(filePath);
    this.name = this._createName(this.uri);
  }

  /**
   * Append character string to file.
   * @memberOf  module:fs.File.prototype
   * @name      append
   * @function
   * @param     {string}  content - Append for.
   */
  File.prototype.append = function(content) {
    return FLfile.write(this.uri, content, "append");
  };

  /**
   * Write character string to file.
   * @memberOf  module:fs.File.prototype
   * @name      write
   * @function
   * @param     {string}  content - Write for.
   */
  File.prototype.write = function(content) {
    return FLfile.write(this.uri, content);
  };

  /**
   * @memberOf  module:fs.File.prototype
   * @name      read
   * @function
   * @returns   {string}  file content.
   */
  File.prototype.read = function() {
    return FLfile.read(this.uri);
  };

  /**
   * Copy file.
   * @memberOf  module:fs.File.prototype
   * @name      copy
   * @function
   * @param     {string}  newPath - copy for.
   */
  File.prototype.copy = function(newPath) {
    var newUri = this._createUri(newPath);
    return FLfile.copy(this.uri, newUri);
  }

  /**
   * @memberOf  module:fs.File.prototype
   * @name      exists
   * @function
   * @returns   {boolean} - true if file was found.
   */
  File.prototype.exists = function() {
    if (!FLfile.exists(this.uri)) { return false; }
    var attr = FLfile.getAttributes(this.uri);
    if (!attr) { return false; }
    if (attr.indexOf("D") != -1) { return false; }
    return true;
  };

  /**
   * Remove file.
   * @memberOf  module:fs.File.prototype
   * @name      remove
   * @function
   */
  File.prototype.remove = function() {
    return FLfile.remove(this.uri);
  };

  /**
   * Move file.
   * @memberOf  module:fs.File.prototype
   * @name      move
   * @function
   * @param     {string}  newPath - Move for.
   */
  File.prototype.move = function(newPath) {
    if (!this.exists()) { return false; }
    var newUri = this._createUri(newPath);
    if (!this.copy(newUri)) { return false; }
    if (!this.remove()) { return false; }
    return true;
  };

  /**
   * @memberOf  module:fs.File.prototype
   * @name      getSize
   * @function
   * @returns   {number}  file size.
   */
  File.prototype.getSize = function() {
    return FLfile.getSize(this.uri);
  };

  /**
   * Convert platform path to URI.
   * @memberOf  module:fs.File.prototype
   * @name      _createUri
   * @function
   * @private
   * @param     {string}  path  - character string of platform path.
   * @return    {string}  uri
   */
  File.prototype._createUri = function(path) {
    if (!path) { return ""; }
    if (fileUriRegExp.test(path)) {
      var generatedUri = FLfile.platformPathToURI(path);
      return generatedUri !== "" ? generatedUri : path;
    }
    if (winAbsolutePathRegExp.test(path)
        || notWinAbsolutePathRegExp.test(path)) {
      var generatedUri = FLfile.platformPathToURI(path);
      return generatedUri;
    }
    // relative path
    var relativeUri = FLfile.platformPathToURI(path).replace(/^file:\/\/\//, "");
    var uri = rootDir + relativeUri;
    return uri;
  }

  /**
   * @memberOf  module:fs.File.prototype
   * @name      _createName
   * @function
   * @private
   * @param     {string}  uri - Character string of uri
   * @returns   {string}  file name.
   */
  File.prototype._createName = function(uri) {
    if (!uri) { return ""; }
    var splitted = uri.split("/");
    var name = splitted[splitted.length - 1];
    return name;
  };
  return File;
})();

exports.File = File;

