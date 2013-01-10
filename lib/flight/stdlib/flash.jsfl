/**
 * @fileOverview  This file has flash module
 */

/**
 * @module    flash
 * @requires  fs
 * @requires  text
 */

var fs = require("fs")
  , text = require("text");

var Project = (function() {
  /**
   * Create a new Project object.
   * @memberOf  module:flash
   * @class     Project
   * @param     {module:fs.File}  file  - A File object with the information on the project to edit.
   */
  function Project(file) {
    this._file = file;
    this._doc = null;
    if (!this._file) { this._file = new fs.File(); }
  }

  /**
   * Open project.
   * @memberOf  module:flash.Project.prototype
   * @name      open
   * @function
   * @throws    {Error} - When file not found or invalid file(ex. An extention is not (.fla|.xfl)).
   */
  Project.prototype.open = function() {
    if (!this.isValid()) {
      throw new Error("Invalid Project File. => " + this._file.uri);
    }
    if (!this._file.exists()) {
      throw new Error("File not found. => " + this._file.uri);
    }
    var doc = fl.openDocument(this._file.uri);
    if (!doc) {
      throw new Error("Failed to open file => " + this._file.uri);
    }
    this._doc = doc;
  };

  /**
   * Publish project.
   * @memberOf  module:flash.Project.prototype
   * @name      publish
   * @function
   * @throws    {Error} When the project is not opened.
   */
  Project.prototype.publish = function() {
    if (!this._doc) {
      throw new Error("Project is not open.");
    }
    this._doc.publish();
  };

  /**
   * Fast-publish project.
   * Publish can be carried out also in the state where the project file is not opened.
   * This method is used to carry out publish, without editing a project.
   * @memberOf  module:flash.Project.prototype
   * @name      fastPublish
   * @function
   */
  Project.prototype.fastPublish = function() {
    fl.publishDocument(this._file.uri);
  };

  /**
   * Close project.
   * @memberOf  module:flash.Project.prototype
   * @name      close
   * @function
   * @param     {boolean=false} promptNeeded  - When displaying the prompt
   *                                            for saving the changed project,
   *                                            it sets to true.
   */
  Project.prototype.close = function(promptNeeded) {
    if (!this._doc) { return; }
    promptNeeded = promptNeeded || false;
    fl.closeDocument(this._doc, promptNeeded);
  };

  /**
   * @memberOf  module:flash.Project.prototype
   * @name      isValid
   * @function
   * @returns   {boolean} true if the project file is valid.
   */
  Project.prototype.isValid = function() {
    if (!this._file.exists()) { return false; }
    return (this._file.name.match(/^.+\.(fla|xfl)$/));
  };

  /**
   * @memberOf  module:flash.Project.prototype
   * @name      getPublishProfile
   * @function
   * @returns   {XML} The XML object containing publish profile.
   * @throws    {Error} When the project is not opened.
   */
  Project.prototype.getPublishProfile = function() {
    if (!this._doc) {
      throw new Error("Project is not open.");
    }
    var profileStr = this._doc.exportPublishProfileString();
    var profile = text.toXML(profileStr);
    return profile;
  };

  /**
   * Apply publish profile
   * @memberOf  module:flash.Project.prototype
   * @name      applyPublishProfile
   * @function
   * @param     {XML} profile - the XML object containing publish profile.
   * @throws    {Error} When the project is not opened.
   */
  Project.prototype.applyPublishProfile = function(profile) {
    if (!this._doc) {
      throw new Error("Project is not open.");
    }
    if (!profile) { return; }
    this._doc.importPublishProfileString(profile.toXMLString());
  };

  return Project;
})();

/**
 * @memberOf  module:flash
 * @name      createProject
 * @function
 * @param     {string}  filename - file path.
 * @return    {module:flash.Project}  The Project object created by filename.
 * @throws    {Error}   File not found, or Invalid .(fla|xfl) file.
 */
var createProject = function(filename) {
  var file = new fs.File(filename);
  if (!file.exists()) {
    throw new Error("File not found. => " + file.uri);
  }
  var project = new Project(file);
  if (!project.isValid()) {
    throw new Error("Invalid fla file. => " + file.uri);
  }
  return project;
};

/**
 * Convert to Project object.
 * @memberOf  module:flash
 * @name      convertProject
 * @function
 * @param     {Document}  doc
 * @returns   {module:flash.Project}  The Project object which was converted from Document object.
 */
var toProject = function(doc) {
  if (!doc) { return null; }
  var file = new File(doc.pathURI);
  var project = new Project(file);
  project.doc = doc;
  return project;
};

exports.Project = Project;
exports.createProject = createProject;
exports.toProject = toProject;

