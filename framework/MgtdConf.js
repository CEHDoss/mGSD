
config.options.txtTheme = 'WorkTimeTheme';

if (!config.mGTD) config.mGTD = {};

config.mGTD.specialTags = [
  "Action",
  "Project",
  "Area",
  "Goal",
  "Vision",
  "Value",
  //"Realm",
  "Context",
  "View",
  "Tickler",
  "Reference",
  "Contact",
  "Scratch",
  "Priority"
];

config.mGTD.tagsToIndex = [
  "Action",   // needed for action dependencies
  "Project",
  "Focus",
  "Horizon",
  "Realm",
  "Context",
  "ActionStatus",
  "TicklerStatus",
  "FocusStatus",
  "GTDComponent",
  "Sidebar",
  "Contact",
  "TicklerRepeatType",
  "Priority"
];

config.mgtdVersion = "__REV__";

config.macros.mgtdVersion={handler:function(place){wikify(config.mgtdVersion,place);}};

config.toggleTagAlwaysTouchModDate = true; // see ToggleTagPlugin



config.shadowTiddlers.SiteTitle = 'mGSD';
config.shadowTiddlers.SiteSubtitle = 'the tiddlywiki powered gtd system formerly known as MonkeyGTD';

config.mGTD.getOptChk = function(option) { return store.fetchTiddler('MgtdSettings').tags.contains(option); }
config.mGTD.getOptTxt = function(fieldName) { return store.fetchTiddler('MgtdSettings').fields[fieldName.toLowerCase()]; }
config.mGTD.setOptTxt = function(fieldName,fieldValue) { store.fetchTiddler('MgtdSettings').fields[fieldName.toLowerCase()] = fieldValue; }

// from tiddlytools.com/#CoreTweaks, thanks Eric
window.coreWikify = wikify;
window.wikify = function(source,output,highlightRegExp,tiddler)
{
  if (source) arguments[0]=source.replace(/\\\\\n/mg,"<br>");
  coreWikify.apply(this,arguments);
}

readOnly = false;
showBackstage = true;

