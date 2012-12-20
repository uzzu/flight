var filename = fl.scriptURI.split("/").pop();
var dir = fl.scriptURI.replace(filename, "");
var logDir = dir + "logs/";
var animationSwf = dir + "bin/animation.swf";
FLfile.remove(logDir);
FLfile.remove(animationSwf);
fl.quit(true);

