
// for sorting tiddlers

merge(Tiddler.prototype,{

  sort_tickleDate: function() {
    return this.fields['mgtd_date'] || 'ZZZZZZZZ'; // i think that's enought to make undated tiddlers sort to the end
  },

  sort_orderSlice: function() {
    var orderSlice = store.getTiddlerSlice(this.title,"order");
    //return orderSlice ? orderSlice : this.title; // so if there's no slice we get sorting by title
    return "" + orderSlice + this.title;//order by order and title
    //TODO: make this better with different variables
  },

  sort_prioritySlice: function() {
    var orderSlice = store.getTiddlerSlice(this.title,"priority");
    //return orderSlice ? orderSlice : this.title; // so if there's no slice we get sorting by title
    return "" + orderSlice + this.title;//order by order and title
    //TODO: make this better with different variables
  },
  
  sort_Priority: function() {
    var tiddlerPriority = 9;
    var tiddlerP = this.getParent("Priority");
    if(tiddlerP){
      var tiddlerPslice = store.getTiddlerSlice(tiddlerP,"priority");
      if(tiddlerPslice){
        tiddlerPriority = tiddlerPslice;
      }
    }
    
    var project = this;
    var projectT = this.getParent("Project");
    var projectPriority = tiddlerPriority;
    if(projectT && projectT.length != 0){
      project = store.getTiddler(projectT);
      var projectP = project.getParent("Priority");
      if(projectP){
        var projectPslice = store.getTiddlerSlice(projectP,"priority");
        if(projectPslice){
          projectPriority = projectPslice;
        }
      }
    }
    
    var focusT = project.getParent("Focus");
    var focusPriority = projectPriority;
    if(focusT && focusT.length != 0){
      var focus = store.getTiddler(focusT);
      var focusP = focus.getParent("Priority");
      if(focusP){
        var focusPslice = store.getTiddlerSlice(focusP,"priority");
        if(focusPslice){
          focusPriority = focusPslice;
        }
      }
    }
    
    return "" + focusPriority + projectPriority + tiddlerPriority + this.title;
  },

  sort_SixLevelModel: function() {
    var whydoS = "";
    var visionS = "";
    var visionT = "";

    visionS = this.getParent("Vision");

    visionT = store.getTiddler(visionS);
    if(visionT){
        whydoS = visionT.getParent("WhyDoes");
    }
    return "" + whydoS + '_' + visionS + '_' + this.title;
  }

});
