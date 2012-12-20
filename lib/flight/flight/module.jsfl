/**
 * @fileOverview  This file has flight/module module.
 */

/**
 * This module offers a modularization function.
 * @module        flight/module
 * @requires      flight/global
 */

/**
 * @ignore
 */
var flight = flight || {};

(function(ns) {
  /**
   * @private
   * @memberOf  flight
   * @namespace module
   */
  var module = module || {};

  (function(ns) {
    /**
     * @inner
     */
    var winAbsolutePathRegExp = /^([a-zA-Z]+:|\\)\\/
      , fileUriRegExp = /^file:\/\//
      , moduleDirs
      , cache
      , uriCache
      , globalStack;

    /**
     * Normalize uri
     * @private
     * @memberOf  module:flight/module
     * @name      normalizeUri
     * @function
     * @inner
     * @param     {!string} uri
     */
    var normalizeUri = function(uri) {
      var prefix = "file://";
      var suffix = "";
      if (uri.charAt(uri.length - 1) !== "/") {
        var dirend = uri.lastIndexOf("/");
        suffix = uri.substring(dirend);
        uri = uri.substring(0, dirend);
      }
      uri = uri.replace(fileUriRegExp, "");
      var uriSplitted = uri.split("/");
      for (var i = 0; i < uriSplitted.length; i++) {
        if (i < 0) { i = 0; }
        var name = "" + uriSplitted[i];
        if (name === ".") {
          uriSplitted.splice(i, 1);
          --i;
          continue;
        }
        if (name === "..") {
          uriSplitted.splice(i - 1, 2);
          i -= 2;
          continue;
        }
      }
      uri = prefix + uriSplitted.join("/") + suffix;
      return uri;
    };

    /**
     * Resolve filename.
     * @private
     * @memberOf  module:flight/module
     * @name      resolveFilename
     * @function
     * @inner
     * @param     {!string}             path
     * @param     {!app:module.Module}  currentModule
     * @param     {!Array.<string>}     moduleDirs
     * @returns   {string}  URI in which module file exists.
     * @throws    {Error}   if solution of a file name goes wrong.
     */
    var resolveFilename = function(path, currentModule, moduleDirs) {
      // using cache
      if (uriCache[path]) {
        return "" + uriCache[path];
      }

      // resolve filename
      var lookupUris = resolveLookupUris(path, currentModule.dirname, moduleDirs);
      var lookupUrisLength = lookupUris.length;
      var fileUri = null;
      for (var i = 0; i < lookupUrisLength; i++) {
        var uri = "" + lookupUris[i];
        fileUri = findFile(uri);
        if (fileUri) { break; }
      }

      // throw error when filename was not resolved.
      if (!fileUri) {
        throw new Error("" +
          "Module: cannot find module => " +
          "\"" + path + "\"\n" +
          "lookupped directory: \n\t" +
          lookupUris.join("\n\t")
        );
      }

      // cache and return
      uriCache[path] = fileUri;
      return fileUri;
    };

    /**
     * URI to inspect is solved in module reading.
     * @private
     * @memberOf  module:flight/module
     * @name      resolveLookupUris
     * @function
     * @inner
     * @param     {!string}         path
     * @param     {!string}         currentDir
     * @param     {!Array.<string>} moduleDirs
     * @returns   {Array.<string>}  List of URI in module reading.
     */
    var resolveLookupUris = function(path, currentDir, moduleDirs) {
      var results = [];
      var pathStart = path.substring(0, 2);

      // current directory or previous directory
      if (pathStart === "./" || pathStart === "..") {
        var uri = currentDir + path;
        uri = normalizeUri(uri);
        results.push(uri);
        return results;
      }

      // absolute path, and non uri
      if (pathStart.charAt(0) === "/"
          || winAbsolutePathRegExp.test(path)) {
        var uri = FLfile.platformPathToURI(path);
        uri = normalizeUri(uri);
        results.push(uri);
        return results;
      }

      // absolute path
      if (fileUriRegExp.test(path)) {
        var uri = normalizeUri(path);
        results.push(uri);
        return results;
      }

      // module dirs
      var moduleDirsLength = moduleDirs.length;
      for (var i = 0; i < moduleDirsLength; i++) {
        var moduleDir = "" + moduleDirs[i];
        var uri = moduleDir + path;
        uri = normalizeUri(uri);
        results.push(uri);
      }
      return results;
    };

    /**
     * @private
     * @memberOf  module:flight/module
     * @name      findFile
     * @function
     * @inner
     * @param     {!string} uri
     * @returns   {string|boolean}  URI in which file exists, or false.
     */
    var findFile = function(uri) {
      if (uri.charAt(uri.length - 1) !== "/") {
        if (fileExists(uri)) {
          return uri;
        }
        var uriExtAdded = uri + ".jsfl";
        if (fileExists(uriExtAdded)) {
          return uriExtAdded;
        }
        uri += "/";
      }
      var uriIndexFile = uri + "index.jsfl";
      if (fileExists(uriIndexFile)) {
        return uriIndexFile;
      }
      return false;
    };

    /**
     * @private
     * @name      fileExists
     * @function
     * @inner
     * @param     {!string} uri
     * @returns   {boolean} true when the file(not a directory) which URI points out exists.
     */
    var fileExists = function(uri) {
      if (!FLfile.exists(uri)) { return false; }
      var attr = FLfile.getAttributes(uri);
      if (!attr) { return false; }
      if (attr.indexOf("D") != -1) { return false; }
      return true;
    };

    /**
     * Load module.
     * @private
     * @memberOf  module:flight/module
     * @name      loadModule
     * @function
     * @inner
     * @param     {!string} uri - module file's uri.
     * @returns   {app.module:Module} The read module.
     */
    var loadModule = function(uri) {
      var m = cache[uri];
      if (!m) {
        m = new Module(uri);
        m.filename = uri;
        var name = uri.split("/").pop();
        m.dirname = uri.replace(name, "");
        cache[uri] = m;
        globalStack.push(m);
        try {
          fl.runScript(uri, "__nop");
        } catch (error) {
          delete cache[uri];
          globalStack.pop();
          throw new Error(error.stack);
        }
        m.loaded = true;
        globalStack.pop();
      }
      return m;
    };

    /**
     * @memberOf  module:flight/module
     * @name      getModuleDirs
     * @function
     * @returns   {Array.<string>}  The copy of the list of a directory
     *                              which looks for a module at require() instruction execution time.
     */
    var getModuleDirs = function() {
      return moduleDirs.concat();
    };
    ns.getModuleDirs = getModuleDirs;

    /**
     * Add the directory which looks for a module at require() instruction execution time.
     * @memberOf  module:flight/module
     * @name      addModuleDir
     * @function
     * @param     {!string} moduleDir - the directory uri which looks for a module
     *                                  at require() instruction execution time.
     */
    var addModuleDir = function(moduleDir) {
      if (moduleDirs.indexOf(moduleDir) != -1) {
        return;
      }
      moduleDirs.push(moduleDir);
    };
    ns.addModuleDir = addModuleDir;

    /**
     * @memberOf  module:flight/module
     * @name      require
     * @function
     * @param     {!string} path  - module path
     * @returns   {Object}  The object which exported from module.
     */
    var require = function(path) {
      var current = globalStack.current();
      var filename = resolveFilename(path, current, moduleDirs);
      var module = loadModule(filename);
      return module.exports;
    };
    ns.require = require;

    var GlobalStack = (function() {
      /**
       * Create a new GlobalStack object.
       * @private
       * @memberOf  module:flight/module
       * @class     GlobalStack object is used to stack module on global scope.
       * @inner
       */
      function GlobalStack() {
        this._stack = [];
      }

      /**
       * Set module on global scope and push stack.
       * @memberOf  module:flight/module.GlobalStack.prototype
       * @name      push
       * @function
       * @param     {module:flight/module}  module - object which push on stack.
       */
      GlobalStack.prototype.push = function(module) {
        this._stack.push(module);
        var current = this.current();
        if (current) {
          var g = flight.global;
          g.setModule(current);
          g.setExports(current.exports);
          g.setFilename(current.filename);
          g.setDirname(current.dirname);
        }
      };

      /**
       * Release current module on global object, with set previous module on global object, and pop stack.
       * @memberOf  module:flight/module.GlobalStack.prototype
       * @name      pop
       * @function
       * @returns   {module:flight/module.Module} object which poped on stack.
       */
      GlobalStack.prototype.pop = function() {
        this._stack.pop();
        var current = this.current();
        if (current) {
          var g = flight.global;
          g.setModule(current);
          g.setExports(current.exports);
          g.setFilename(current.filename);
          g.setDirname(current.dirname);
        }
        return current;
      };

      /**
       * @memberOf  module:flight/module.GlobalStack.prototype
       * @name      current
       * @function
       * @returns   {module:flight/module.Module} The Module object which setting global scope.
       */
      GlobalStack.prototype.current = function() {
        var lastIndex = this._stack.length - 1;
        if (lastIndex < 0) {
          return null;
        }
        var c = this._stack[lastIndex];
        return c;
      };

      /**
       * @memberOf  module:flight/module.GlobalStack.prototype
       * @name      prev
       * @function
       * @returns   {module:flight/module.Module} The Module object which setting global scope.
       */
      GlobalStack.prototype.prev = function() {
        var prevIndex = this._stack.length - 2;
        if (prevIndex < 0) {
          return null;
        }
        var p = this._stack[previousIndex];
        return p;
      };
      return GlobalStack;
    })();
    ns.GlobalStack = GlobalStack;

    var Module = (function() {
      /**
       * Create a new Module Object.
       * @memberOf  module:flight/module
       * @class     Module  class offer the function which carries out module management of the script file.
       * @param     {string}  id        - unique identifier of module object.
       * @property  {string}  id        - unique identifier of module object.
       * @property  {string}  dirname   - absolute path of directory of script file.
       * @property  {string}  filename  - absolute path of script file.
       * @property  {string}  loaded    - determinates whether the script file was read.
       * @property  {Object}  exports   - export for.
       */
      function Module(id) {
        this.id = id;
        this.filename = null;
        this.dirname = null;
        this.loaded = false;
        this.exports = {};
      }
      return Module;
    })();
    ns.Module = Module;

    /**
     * Initialize Module module.
     * @undocumented
     * @memberOf  module:flight/module
     * @name      init
     * @function
     * @param     {!Window} global      - Global scope.
     * @param     {!string} flightRoot  - The root directory of the Flight framework.
     * @param     {!string} projectRoot - The root directory of the project using Flight framework.
     */
    ns.init = function(scope, flightRoot, projectRoot) {
      if (!flightRoot) {
        throw new Error("Invalid arguments flightRoot -> " + flightRoot);
      }
      if (!projectRoot) {
        throw new Error("Invalid arguments projectRoot -> " + projectRoot);
      }
      flightRoot = normalizeUri(flightRoot);
      projectRoot = normalizeUri(projectRoot);

      // initialize static member
      moduleDirs = [];
      cache = {};
      uriCache = {};
      globalStack = new GlobalStack();

      // set default directory for include module.
      addModuleDir(flightRoot);
      addModuleDir(flightRoot + "flight/"); // $FlightRoot/flight/
      addModuleDir(flightRoot + "stdlib/"); // $FlightRoot/stdlib/
      addModuleDir(projectRoot + "lib/");   // $ProjectRoot/lib/
      addModuleDir(projectRoot);            // $ProjectRoot/
      addModuleDir(projectRoot + "src/");   // $ProjectRoot/src/
      addModuleDir(projectRoot + "test/");  // $ProjectRoot/test/

      // set default require method on global scope.
      flight.global.setRequire(ns.require);

      // set default modules.
      (function() {
        var createModule = function(uri) {
          var name = uri.split("/").pop();
          var dir = uri.replace(name, "");
          var id = uri;
          var module = new Module(id);
          module.filename = uri;
          module.dirname = dir;
          module.loaded = true;
          return module;
        };

        // loaded modules
        var mainUri = scope.fl.scriptURI;
        var flightUri = flightRoot + "flight.jsfl";
        var coreGlobalUri = flightRoot + "flight/global.jsfl";
        var coreModuleUri = flightRoot + "flight/module.jsfl";

        // set default exports
        var main = createModule(mainUri);
        main.exports = {};
        main.exports.uri = mainUri;
        main.exports.name = mainUri.split("/").pop();
        main.exports.dir = mainUri.replace(main.exports.name, "");
        main.exports.projectRoot = projectRoot;
        main.exports.flightRoot = flightRoot;
        var flight = createModule(flightUri);
        flight.exports = flight;
        var coreGlobal = createModule(coreGlobalUri);
        coreGlobal.exports = flight.Global;
        var coreModule = createModule(coreModuleUri);
        coreModule.exports = flight.Module;

        // set default module cache
        cache[mainUri] = main;
        cache[flightUri] = flight;
        cache[coreGlobalUri] = coreGlobal;
        cache[coreModuleUri] = coreModule;

        // set default uri cache
        var mainName = mainUri.split("/").pop();
        var mainNameNoExt = mainName.replace(/\.jsfl/, "");
        uriCache.mainName = mainUri;
        uriCache.mainNameNoExt = mainUri;
        uriCache["main"] = mainUri;
        uriCache["flight"] = flightUri;
        uriCache["flight.jsfl"] = flightUri;
        uriCache["flight/global"] = coreGlobalUri;
        uriCache["flight/global.jsfl"] = coreGlobalUri;
        uriCache["flight/module"] = coreModuleUri;
        uriCache["flight/module.jsfl"] = coreModuleUri;

        // set default globalStack
        globalStack.push(main);
      })();
    };
  })(module);
  ns.module = module;
})(flight);

/**
 * Alias of module:flight/module.init
 * @name      module$init
 * @function
 * @param     {!Window} global      - Global scope.
 * @param     {!string} flightRoot  - The root directory of the Flight framework.
 * @param     {!string} projectRoot - The root directory of the project using Flight framework.
 */
var module$init = function(scope, flightRoot, projectRoot) {
  flight.module.init(scope, flightRoot, projectRoot);
};

