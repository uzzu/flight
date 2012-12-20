/**
 * @fileOverview    [entry-point]
 *                  Output string to outputPanel on Flash IDE.
 */

fl.outputPanel.clear();
var projectRoot = fl.scriptURI.replace(fl.scriptURI.split("/").pop(), "");
var flightRoot = projectRoot + "../lib/flight/";
var flightUri = flightRoot + "flight.jsfl";
fl.runScript(flightUri, "flight$bootstrap", this, flightRoot, projectRoot);

var taskapp = require("./app/taskapp");
taskapp.start({
  ending: "confirm"
  , logging: {
    fileEnabled: true
  }
  , tasks: [
    {
      name: "BuildTask"
      , options: {
        filename: "resources/animation.fla"
      }
    }
  ]
});
