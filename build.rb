#!/usr/bin/env ruby

require 'pathname'
Dir.chdir Pathname.new(File.dirname(__FILE__)).realpath

#$LOAD_PATH.unshift("../r4tw") 
require './r4tw'
require 'fileutils'

$version_number = '3.1.9';

required = [

  ['Action', 'GTDComponent'],
  ['Focus', 'GTDComponent'],
  ['Horizon', 'GTDComponent'],
  ['Context', 'GTDComponent'],
  ['Tickler', 'GTDComponent'],
  ['Reference', 'GTDComponent'],
  ['Contact', 'GTDComponent'],
  ['Realm', 'GTDComponent'],
  ['Priority', 'GTDComponent'],

  ['Starred',       'GTDComponent'],

  ['Next',          'ActionStatus',  "order:1\nbutton:n\nbuttonLong:next\n"],
  ['Waiting For',   'ActionStatus',  "order:2\nbutton:w\nbuttonLong:waiting for\n"],
  ['Future',        'ActionStatus',  "order:3\nbutton:f\nbuttonLong:future\n"],

  ['Active',        'FocusStatus', "order:1\nbutton:a\nbuttonLong:active\n"],
  ['Someday/Maybe', 'FocusStatus', "order:2\nbutton:s/m\nbuttonLong:someday/maybe\n"],

  ['Once',        'TicklerRepeatType', "order:1\nbutton:none\nbuttonLong:one time\n"],
  ['Daily',       'TicklerRepeatType', "order:2\nbutton:none\nbuttonLong:daily\n"],
  ['Weekly',      'TicklerRepeatType', "order:3\nbutton:week\nbuttonLong:weekly\n"],
  ['Fortnightly', 'TicklerRepeatType', "order:4\nbutton:fortnight\nbuttonLong:fortnightly\n"],
  ['Monthly',     'TicklerRepeatType', "order:5\nbutton:month\nbuttonLong:monthly\n"],
  ['Yearly',      'TicklerRepeatType', "order:6\nbutton:year\nbuttonLong:yearly\n"],

]

initial = [
	['All',           'Realm',         "order:0\npriority:0\naddTag:Professional,Personal,Fun,GTD"],
	['Professional',  'Realm',         "order:1\npriority:1\nbutton:Pro\naddTag:GTD"],
	['Personal',      'Realm',         "order:2\npriority:2\nbutton:Per\naddTag:GTD"],
	['Fun',           'Realm',         "order:3\npriority:3"],
	['GTD',           'Realm',         ""],

	['Collect',            'Area Focus GTD',  "priority:1"],
	['Process',            'Area Focus GTD',  "priority:2"],
	['Organize',           'Area Focus GTD',  "priority:3"],
	['Review',             'Area Focus GTD',  "priority:4"],
	['Do',                 'Area Focus GTD',  "priority:5"],

	['Home Maintenance',   'Area Focus Personal'],
	['Recreation',         'Area Focus Personal'],
	['Family',             'Area Focus Personal'],
	['Friends',            'Area Focus Personal'],
	['Budget',             'Area Focus Professional'],
	['Research',           'Area Focus Professional'],
	['Training',           'Area Focus Professional'],
	['Customer Relations', 'Area Focus Professional'],

 	['Weekend',       'Context'],
	['Call',          'Context'],
	['Home',          'Context'],
	['Office',        'Context'],
	['Errand',        'Context'],
	['Email',         'Context'],
	['Offline',       'Context'],
	['Low Energy',    'Context'],
	['Reading',       'Context'],

	['Value',   'Horizon', "order:1"],
	['Vision',  'Horizon', "order:2"],
	['Goal',    'Horizon', "order:3"],
	['Area',    'Horizon', "order:4"],
	['Project', 'Horizon', "order:5"],

]

demo = [

  ['Bert',           "Contact"],
  ['Ernie',          "Contact"],
  ['Big Bird',       "Contact"],
  ['Fozzie',         "Contact"],
  ['Miss Piggy',     "Contact"],
  ['Kermit',         "Contact"],

  ['Mow Lawn',              "Project Focus [[Home Maintenance]] Personal Active"],
  ['Get some mower fuel',   "Action Next Personal [[Mow Lawn]] Errand"],
  ['Pick up palm branches', "Action [[Waiting For]] Personal [[Mow Lawn]] Weekend"],
  ['Mow the lawn already',  "Action Future Personal [[Mow Lawn]] Weekend"],
  
  ['Buy snowboard',                          "Project Focus Recreation Personal Someday/Maybe"],
  ['Look in phone book for local ski shops', "Action Next Personal [[Buy snowboard]] Home"],
  ['Ask Ben for recommendations',            "Action Next Personal [[Buy snowboard]] Call"],

  ['Hang up bedroom curtains', "Project Focus [[Home Maintenance]] Personal Active"],
  ['Buy curtain rail and screws', "Action Next Personal [[Hang up bedroom curtains]] Errand"],
  ['Drill holes and hung up curtain rail', "Action Future Personal [[Hang up bedroom curtains]] Home"],
  ['Place curtain pins and hung up curtains', "Action Future Personal [[Hang up bedroom curtains]] Home"],
  
  ['Go to theatre with Sue', "Project Focus Recreation Personal Active"],
  ['Ring Sue: decide play and dates', "Action Next Personal [[Go to theatre with Sue]] Call"],
  ['Ring ticket office and book places', "Action Future Personal [[Go to theatre with Sue]] Call"],
  
  ['A project-less task',   "Action Next Personal"],
  ['A project-less task with an Area',   "Action Next Personal Research"],

  # see if dependencies are working
  ['Test deps', "Project Focus Personal Active"],
  ['Action A', "Action [[Test deps]] Next"],
  ['Action B depends on A', "Action [[Test deps]] Future [[Action A]]"], # depends on Action A
  ['Action C', "Action [[Test deps]] Next"],
  ['Action D depends on C and A', "Action [[Test deps]] Future [[Action C]] [[Action A]]"], # depends on two actions...

]


# TODO put into r4tw
class Tiddler
  def get_sections
    @fields['text'].scan(/^!([^\n]+)$/m).map { |m| m[0].chomp } # chomp is a kludge because i don't know what is going on with line breaks atm..
  end
end 

make_tw {

  # actually this is an mptw empty file not a bare one
  source_file            'empties/empty.html'

  remove_tiddler         "MptwUpgradeTsURL"  
  remove_tiddler         "MptwUpgradeURL"
  remove_tiddler         "MonkeyPirateTiddlyWiki"

  add_tiddlers_from_dir  "framework"
  add_tiddlers_from_dir  "layout"
  add_tiddlers_from_dir  "supporting"
  add_tiddlers_from_dir  "menus"
  add_tiddlers_from_dir  "views"

  add_tiddlers_from_dir  "tiddlers"
  
  # was going to package these as shadows but then 
  # won't be able to add the View tag
  # can we work around that?
  add_tiddlers_from_dir("globalviews").each do |t|
    # should return a list of tiddlers but looks like it returns filenames...
    # lets work around that because we're lazy
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View')
  end

  add_tiddlers_from_dir("globalviews_process").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Process')
  end

  add_tiddlers_from_dir("globalviews_process_starred").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Process').add_tag('Starred')
  end

  add_tiddlers_from_dir("globalviews_organize").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Organize')
  end

  add_tiddlers_from_dir("globalviews_organize_starred").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Organize').add_tag('Starred')
  end

  add_tiddlers_from_dir("globalviews_review").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Review')
  end

  add_tiddlers_from_dir("globalviews_review_starred").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Review').add_tag('Starred')
  end

  add_tiddlers_from_dir("globalviews_do").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Do')
  end

  add_tiddlers_from_dir("globalviews_do_starred").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('View').add_tag('Do').add_tag('Starred')
  end

  add_tiddlers_from_dir("systemConfig").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('systemConfig').add_tag('excludeSearch')
  end

  add_tiddlers_from_dir("priority").each do |t|
    get_tiddler(File.basename(t,'.tiddler')).add_tag('Priority')
  end

  # generate some content
  content = ""

  ## not doing this anymore. instead see globalviews dir. each thing is in a separate tiddler
  ## but I need to tag them with "View"

  #get_tiddler('NameDashboards').get_sections.each do |s|
  #  content += "<div macro=\"showWhenTitleIs '#{s}'\">[[NameDashboards###{s}]]</div>\n"
	#  add_tiddler_from_scratch('tiddler' => s, 'tags' => 'View', 'text' => '')
  #end

  get_tiddler('TagDashboards').get_sections.each do |s|
    # dammit there is some broken shit in r4tw to do with line breaks
    content += "<div macro=\"showWhenTagged '#{s}'\">[[TagDashboards###{s}]]</div>\n"
  end

  add_tiddler_from_scratch ({'tiddler' => 'DashboardSelector', 'text' => content });

  content = ""
  get_tiddler('TitleButtons').get_sections.each do |s|
    content += "<div macro=\"showWhenTagged '#{s}'\">[[TitleButtons###{s}]]</div>\n"
  end
  add_tiddler_from_scratch ({'tiddler' => 'TitleButtonsSelector', 'text' => content });

  # old: use top secret timestamp format for version number. note, can't do two releases in same ten minute period
  # get_tiddler('MgtdConf').fields['text'].sub!(/__REV__/,Time.now.strftime('%y%m%d.%H%M')[0..-2])

  # new: use svn version
  get_tiddler('MgtdConf').fields['text'].sub!(/__REV__/,$version_number)

  %w[systemConfig systemTheme].each do |tag|
    #tiddlers_with_tag(tag).each{ |t| t.add_tags(['excludeSearch','excludeLists']) } # makes it too hard to find plugins etc
    tiddlers_with_tag(tag).each{ |t| t.add_tags(['excludeSearch']) }
  end

  # actually everything in upgrade should be exclude search...
  # what about excludeLists? perhaps not since you might want to find things
  tiddlers.each{ |t| t.add_tag('excludeSearch') }

  # add required tiddlers and write upgrade file.
  required.each { |t| add_tiddler_from_scratch('tiddler' => t[0], 'tags' => t[1], 'text' => t[2]||'') }

  # some we don't want in upgrade file...
  temp1 = get_tiddler('MptwUserConfigPlugin')

  remove_tiddler('MptwUserConfigPlugin')

  FileUtils.mkdir('upload') unless File.exist?('upload')

  store_to_file          "./upload/upgrade.html" unless ARGV[0] == 'fast'

  # put it back again
  add_tiddler(temp1)

  # add a MgtdUserConf tiddler
  add_tiddler_from_scratch('tiddler'=>'MgtdUserConf','tags'=>'systemConfig','text'=>"// won't be overwritten by updates\n\n // eg:\n\n//// config.options.txtTheme = 'MonkeyGTDPrint3x5';")

  # todo, also don't overwrite user settings...

  # add some intial useful contexts realms and areas and write an empty file.
  add_tiddler(get_tiddler('MptwBlue').copy_to('ColorPalette'))
  initial.each { |t| add_tiddler_from_scratch('tiddler' => t[0], 'tags' => t[1], 'text' => t[2]||'') }
  get_tiddler('MgtdSettings').add_tags(['All', 'Professional', 'Personal', 'Fun', 'GTD', 'MultipleContexts']) # default both realms on..
  get_tiddler('MgtdSettings').fields['ticklerdateformat'] = 'ddd, DD-mmm-YY'; # set default tickler date format. gotcha: use lowercase only for fields please.
  get_tiddler('MgtdSettings').fields['newjournaldateformat'] = 'ddd DD-mmm-YY, 0hh:0mm'; # set default tickler date format. gotcha: use lowercase only for fields please.
  get_tiddler('MgtdSettings').fields['tickleractivatehour'] = '5'; # set default tickler date format. gotcha: use lowercase only for fields please.
  to_file          "upload/empty.html" unless ARGV[0] == 'fast'

  # load the demo and write a demo file
  demo.each { |t| add_tiddler_from_scratch('tiddler' => t[0], 'tags' => t[1], 'text' => t[2]||'') }

  # throw in a tickler and some reference
  add_tiddler_from_scratch('tiddler' => 'Theatre Program', 'tags' => "[[Go to theatre with Sue]] Reference Personal", 'text' => '''
Riverway Arts Centre
http://riverway.townsville.qld.gov.au/arts/program
Townsville Civic Theatre
http://previous.townsville.qld.gov.au/theatre/TheatreSeason.asp
  ''')

  add_tiddler_from_scratch('tiddler' => 'Okay to donate blood again', 'tags' => "Tickler Personal Enabled", 'text' => '', 'mgtd_date' => '201101140200' )


  #############
  # load additional demo from the demo_tw. thanks Michael Slay for donating this project for the demo
  demo_tw = make_tw { source_file 'demo/nicedemo.html' }
  add_tiddler demo_tw.get_tiddler("CustCheck Server Install")
  demo_tw.tiddlers_with_tag("CustCheck Server Install").each {|t| add_tiddler t}
  #
  #######################

  to_file                "upload/demo.html"
}


