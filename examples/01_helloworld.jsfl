/**
 * @fileOverview    [entry-point]
 *                  Output string to outputPanel on Flash IDE.
 */

fl.outputPanel.clear();
var projectRoot = fl.scriptURI.replace(fl.scriptURI.split("/").pop(), "");
var flightRoot = projectRoot + "../lib/flight/";
var flightUri = flightRoot + "flight.jsfl";
fl.runScript(flightUri, "flight$bootstrap", this, flightRoot, projectRoot);

var console = require("console");
console.log("Hello, World!");

