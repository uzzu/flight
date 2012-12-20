/**
 * @fileOverview    [entry-point]
 *                  Output string to outputPanel on Flash IDE with "./app/greetapp" module.
 */

fl.outputPanel.clear();
var projectRoot = fl.scriptURI.replace(fl.scriptURI.split("/").pop(), "");
var flightRoot = projectRoot + "../lib/flight/";
var flightUri = flightRoot + "flight.jsfl";
fl.runScript(flightUri, "flight$bootstrap", this, flightRoot, projectRoot);

var greetapp = require("./app/greetapp");
greetapp.start("Greet!");

