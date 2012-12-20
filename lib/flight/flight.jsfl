/**
 * @fileOverview  This file has flight module.
 */

/**
 * Alias of flight
 * @module    flight
 * @requires  flight/global
 * @requires  flight/module
 * @see       flight
 */

/**
 * Holds the modules of Flight framework.
 * This namespace is the workspace of Flight framework
 * and must not destroy the object of this namespace.
 * @namespace flight
 */
var flight = flight || {};

(function(ns) {
  /**
   * Bootstrap for Flight framework.
   * This method will be deleted once it performs.
   * @memberOf  flight
   * @name      bootstrap
   * @function
   * @static
   * @param     {Window}  global      - Global scope.
   * @param     {string}  flightRoot  - The root directory of the Flight framework.
   * @param     {string}  projectRoot - The root directory of the project using Flight framework.
   */
  ns.bootstrap = function(global, flightRoot, projectRoot) {
    var ext = ".jsfl"
    var coreModuleDir = flightRoot + "flight/";
    var coreModules = [
      "global"
      , "module"
    ];
    var length = coreModules.length;
    for (var i = 0; i < length; i++) {
      var coreModule = "" + coreModules[i];
      var coreModuleUri = coreModuleDir + coreModule + ext;
      var initFunc = coreModule + "$init";
      fl.runScript(coreModuleUri, initFunc, global, flightRoot, projectRoot);
    }
    delete ns.bootstrap;
  };
})(flight);

/**
 * Alias for flight.bootstrap
 * This method will be deleted once it performs.
 * @name      flight$bootstrap
 * @function
 * @global
 * @param     {Window}  global      - Global scope.
 * @param     {string}  flightRoot  - The root directory of the Flight framework.
 * @param     {string}  projectRoot - The root directory of the project using Flight framework.
 */
var flight$bootstrap = function(global, flightRoot, projectRoot) {
  flight.bootstrap(global, flightRoot, projectRoot);
  delete flight$bootstrap;
};

