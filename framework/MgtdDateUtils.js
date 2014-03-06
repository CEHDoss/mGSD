merge(Date.prototype,{
  addDay:       function(n) { this.setDate(  this.getDate()      + n    ); },
  addWeek:      function(n) { this.setDate(  this.getDate()      + n*7  ); },
  addFortnight: function(n) { this.setDate(  this.getDate()      + n*14 ); },
  addMonth:     function(n) { this.setMonth( this.getMonth()     + n    ); },
  addYear:      function(n) { this.setYear(  this.getFullYear()  + n    ); },
  addDayWW:     function(n) { this.setDate(  this.getDate()      + (this.getDay() == 5?n+2:n)); },
  addMonth:     function(n) { this.setDate(  this.getDate()      + n*28 ); },
  addBimonth:   function(n) { this.setMonth( this.getMonth()     + n*2  ); },
  addHalfyear:  function(n) { this.setDate(  this.getDate()      + n*182); }
});
