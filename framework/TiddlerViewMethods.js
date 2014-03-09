
// for displaying tiddlers in lists

// idea: use <<tiddler with:?>>

if (!config.mGTD) config.mGTD = {};

config.mGTD.data = {
  starOn:    'data:image/gif;base64,R0lGODlhDwAPAMQfAF9h4RYVnZeQJC0u0lRQU42R6P/7Fv74L05NrRkZxi4tW52XXv71D8nAIWxnjnRxr3NuMJKOluXbBe7kCa2x7UFD1vPoB77D8Jqe6n6B5tvTUr62BMrP8lJPh1xbuv///yH5BAEAAB8ALAAAAAAPAA8AAAWD4CeOWQKMaDpESepi3tFlLgpExlK9RT9ohkYi08N8KhWP8nEwMBwIDyJRSTgO2CaDYcBOCAlMgtDYmhmTDSFQ+HAqgbLZIlAMLqiKw7m1EAYuFQsGEhITEwItKBc/EgIEAhINAUYkCBIQAQMBEGonIwAKa21iCgo7IxQDFRQjF1VtHyEAOw==',
  starOff:   'data:image/gif;base64,R0lGODlhDwAPALMPAP///8zj++r7/7vb/rHW/tPt/9Lk+qzT/rbY/sHh/8Te/N7q+Nzy/7nY/djn+f///yH5BAEAAA8ALAAAAAAPAA8AAARg8MkZjpo4k0KyNwlQBB42MICAfEF7APDRBsYzIEkewGKeDI1DgUckMg6GTdFIqC0QgyUgQVhgGkOi4OBBCJYdzILAywIGNcoOgCAQvowBRpE4kgzCQgPjQCAcEwsNTRIRADs=',

  unicodeStar: "\u2605" // "black star"
};


merge(Tiddler.prototype,{

    //Comment by Dossc - why do I get the feeling I am going to regret this.
    render_Generic: function() {
        return this.renderGenericControls(this.getGenericControls());
    },

    render_GenericGroup: function() {
        var controls = this.getGenericControls();

        controls['css'] = '';
        controls['done'] = '';
        controls['state'] = '';
        controls['star'] = '';

        return this.renderGenericControls(controls);
    },

    getGenericControls: function() {
        if (this.hasTag("Action")){
            return this.getActionControls();
        } else if(this.hasTag("Focus")){
            return this.getFocusControls();
        } else if(this.hasTag("Tickler")){
            return this.getTicklerControls();
        }// else
        return this.getDefaultControls();
    },

    getDefaultControls: function() {
        var pLink = "";
        var link = "";
        var note = "";

        if (config.mGTD.getOptChk('FullFocusInActionLists')) { pLink += "{{projLinkFull{<<linkToParent Focus [[title]] [[%0]]>>}}}".format([this.title]); }
        else { pLink += "{{projLink{<<linkToParent Focus '[F]' [[%0]]>>}}}".format([this.title]); }

        if (config.mGTD.getOptChk('FullContactInActionLists')) { pLink += "{{projLinkFull{<<linkToParent Contact [[title]] [[%0]]>>}}}".format([this.title]);    }
        else { pLink += "{{projLink{<<linkToParent Contact '[C]' [[%0]]>>}}}".format([this.title]); }

        linkS = store.getTiddlerSlice(this.title, "link");
        if(linkS){ link = ' [[link|'+linkS+']]'; }

        var noteS = store.getTiddlerSlice(this.title, "note");
        if(noteS){ note += ' ' + noteS; }

        return {    
                    'css':'plain',
                    'done':'',
                    'state':'',
                    'star':'<<singleToggleTag tag:Starred title:[[%0]]>>',
                    'delete':'<<deleteTiddler [[%0]]>>',
                    'pLink':pLink,
                    'link':link,
                    'note':note
    };},
    
    renderGenericControls: function(controls) {
        var cssOpen = "";
        var cssClose = "";
        
        if(controls['css']){
            cssOpen = '{{'+controls['css']+'{';
            cssClose = '}}} ';
        }
    
        return this.renderUtil(
        cssOpen+
        controls['done']+
        controls['state']+
        controls['star']+
        ' [[%0]]'+
        controls['delete']+
        cssClose+controls['pLink']+controls['link']+'{{tiny{'+controls['note']+'}}}',
        [
            this.title
        ]
    );},
    
    render_Default: function() {
        return this.renderGenericControls(this.getDefaultControls());
    },
    
    render_Action: function() {
        return this.renderGenericControls(this.getActionControls());
    },
    
    getActionControls: function() {
        controls = this.getDefaultControls();
    
        controls['css'] = 'action';
        controls['done'] = '<<toggleTag Done [[%0]] ->>';
        controls['state'] = '<<multiToggleTag tag:ActionStatus title:[[%0]]>>';
        controls['delete'] += '<<newSavedTiddler prompt:"Enter name for new Action:" tooltip:"Create a new Action" label:"+" tag:"%0">>'.format([
          String.encodeTiddlyLinkList(this.tags)]);
        return controls;
    },
    
    render_Tickler: function() {
        return this.renderGenericControls(this.getTicklerControls());
    },
    
    getTicklerControls: function() {
        controls = this.getDefaultControls();
        
        controls['css'] = "tickler";
        var repeatType = this.getByIndex('TicklerRepeatType');
        if (repeatType.length == 0 || repeatType.contains('Once')) {
            // show normal done checkbox
            controls['done'] = '<<toggleTag Actioned [[%0]] ->>';
        }
        else if (repeatType.contains('Daily'))       { controls['done'] = '<<addDay [[%0]]>>'; }
        else if (repeatType.contains('WorkWeekly'))  { controls['done'] = '<<addDayWW [[%0]]>>'; }
        else if (repeatType.contains('Weekly'))      { controls['done'] = '<<addWeek [[%0]]>>'; }
        else if (repeatType.contains('Fortnightly')) { controls['done'] = '<<addFortnight [[%0]]>>'; }
        else if (repeatType.contains('Monthly'))     { controls['done'] = '<<addMonth [[%0]]>>'; }
        else if (repeatType.contains('Bimonthly'))   { controls['done'] = '<<addBimonth [[%0]]>>'; }
        else if (repeatType.contains('Halfyearly'))  { controls['done'] = '<<addHalfyear [[%0]]>>'; }
        else if (repeatType.contains('Yearly'))      { controls['done'] = '<<addYear [[%0]]>>'; }
        
        controls['state'] = '<<dateChooser [[%0]]>>';
        
        return controls;
    },
    
    render_Focus: function() {
        return this.renderGenericControls(this.getFocusControls());
    },
    
    getFocusControls: function() {
        controls = this.getDefaultControls();
        
        controls['css'] = "project";
        controls['done'] = '<<toggleTag Complete [[%0]] ->>';
        controls['state'] = '<<multiToggleTag tag:FocusStatus title:[[%0]]>>';            
        controls['note'] += ' '+this.modified.prettyDate();
        
        return controls;
    },

    render_link: function() {

        var pLink = '';
        var link = store.getTiddlerSlice(this.title, "link");
        if (link){
            pLink += '[[link|'+link+']]';
        }

        return this.renderUtil(
        '{{plain{[[%0]]}}} %1',
        [
            this.title,
            pLink
        ]
    );},

    render_plain: function() {
        return this.renderUtil(
        '{{plain{[[%0]]}}}',
        [
            this.title
        ]
    );},

    render_note: function() { return this.renderUtil(
        "[[%0]]"+' ~~<<tiddler [[%0::note]]>>~~',
        [
            this.title
        ]
    );},//Start Added by Dossc - Tickler Group view for LandscapeTab

    render_Tick: function() {
        var repeatType = this.getByIndex('TicklerRepeatType');
        var doneControl = "";
        if (repeatType.length == 0 || repeatType.contains('Once')) {
            // show normal done checkbox
            doneControl = '<<toggleTag Actioned [[%0]] ->>';
        }
        else if (repeatType.contains('Daily'))       { doneControl = '<<addDay [[%0]]>>'; }
        else if (repeatType.contains('WorkWeekly'))  { doneControl = '<<addDayWW [[%0]]>>'; }//Added by Dossc - button for WorkWeekly TicklerRepeatType
        else if (repeatType.contains('Weekly'))      { doneControl = '<<addWeek [[%0]]>>'; }
        else if (repeatType.contains('Fortnightly')) { doneControl = '<<addFortnight [[%0]]>>'; }
        else if (repeatType.contains('Monthly'))     { doneControl = '<<addMonth [[%0]]>>'; }
        else if (repeatType.contains('Bimonthly'))   { doneControl = '<<addBimonth [[%0]]>>'; }//Added by Dossc - bimonthly for WorkWeekly TicklerRepeatType
        else if (repeatType.contains('Halfyearly'))  { doneControl = '<<addHalfyear [[%0]]>>'; }//Added by Dossc - halfyearly for WorkWeekly TicklerRepeatType
        else if (repeatType.contains('Yearly'))      { doneControl = '<<addYear [[%0]]>>'; }

        return this.renderUtil(
        '{{tickler{'+'%1'+  
        '&nbsp;[[%0]]'+
        '}}}',
        [
            this.title,
            doneControl.format([this.title])
        ]
    );},//End Added by Dossc

    render_star: function() { 
        var pLink = '';
        var link = store.getTiddlerSlice(this.title, "link");
        if (link){
            pLink += '[[link|'+link+']]';
        }

        return this.renderUtil(
        '{{plain{'+
        '<<singleToggleTag tag:Starred title:[[%0]]>>'+
        '[[%0]]}}} %1',
        //'{{notesLink{<<showNotesIcon [[%0]]>>}}}',//Removed by Dossc - takes a long time to render references; remember to move the coma
        [
            this.title,
            pLink //Added by Dossc - add link to refrences for More Wiki Functions
        ]
    );},

  // TODO. this seems stupid
  render_bold: function() { return this.renderUtil(
    "[[%0]]",
    [
      this.title
    ]
  );}


});
