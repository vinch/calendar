var v = {};

v.TPL = {
  
  // render a template (using mustache syntax) with values provided
  render: function (template, values) {
    return template.replace(/\{\{([a-z0-9_]+)\}\}/g, function(m, p) {
      return values[p];
    });
  }
  
};

v.Utils = {
  
  // comparaison function for events
  compare: compare = function(event1, event2) {
    if (event1.start !== event2.start) {
      // sort events by start date
      return event1.start - event2.start;
    }
    else {
      // if same start date, longer event comes first
      return event2.end - event1.end;
    }
  },
  
  // detects overlap between two events
  overlap: function(event1, event2) {
    return (event1.start < event2.end && event1.end > event2.start);
  }
  
};

v.Calendar = {
  
  // computes everything needed to draw the calendar
  compute: function(data) {
    var added, overlap, n, max_columns, max_width = 600, columns = [];
    
    // sorting data before computations
    data = data.sort(v.Utils.compare);
    
    // computes columns
    for (var i=0; i<data.length; i++) {
      added = false;
      for (var j=0; j<columns.length && !added; j++) {
        overlap = false;
        for (var k=0; k<columns[j].length && !overlap; k++) {
          if (v.Utils.overlap(data[i], columns[j][k])) {
            overlap = true;
          }
        }
        if (!overlap) {
          columns[j].push(data[i]);
          data[i].column = j;
          added = true;
        }
      }
      if (!added) {
        n = columns.length;
        columns[n] = [data[i]];
        data[i].column = n;
      }
    }
    
    max_columns = columns.length;
  
    // computes columns collisions
    for (var i=0; i<data.length; i++) {
      data[i].collisions = [];
      for (var j=0; j<data.length; j++) {
        if (i !== j && v.Utils.overlap(data[i], data[j]) && data[i].collisions.indexOf(data[j].column) === -1) {
          data[i].collisions.push(data[j].column);
        }
      }
    }
  
    // computes spaces taken by events (1 = full width, 2 = half width, 3 = third width, etc.)
    for (var i=0; i<data.length; i++) {
      data[i].space = 1;
      for (var j=0; j<data.length; j++) {
        if (i !== j && v.Utils.overlap(data[i], data[j])) {
          data[i].space = Math.max(data[i].collisions.length, data[j].collisions.length)+1;
        }
      }
    }
  
    // computes width, height, left and top (and removes data not needed anymore)
    for (var i=0; i<data.length; i++) {
      data[i].width = max_width / data[i].space;
      data[i].height = data[i].end - data[i].start;
      data[i].left = data[i].column * data[i].width;
      data[i].top = data[i].start;
      delete data[i].column;
      delete data[i].collisions;
      delete data[i].space;
    }
    
    return data;
  },
  
  // draws calendar using a minimalist templating engine
  draw: function(data) {
    var eventNode = document.getElementsByClassName('event')[0]
      , container = eventNode.parentNode;
  
    container.removeChild(eventNode);

    for (var i=0; i<data.length; i++) {
      startLTS = new Date(0, 0, 0, Math.floor(data[i].start/60)+9, data[i].start%60).toLocaleTimeString()
      endLTS = new Date(0, 0, 0, Math.floor(data[i].end/60)+9, data[i].end%60).toLocaleTimeString()

      html = v.TPL.render(eventNode.outerHTML, {
          width: data[i].width
        , height: data[i].height
        , left: data[i].left
        , top: data[i].top
        , id: data[i].id
        , start: startLTS.split(':')[0] + ':' + startLTS.split(':')[1] + ' ' + startLTS.split(':')[2].split(' ')[1]
        , end: endLTS.split(':')[0] + ':' + endLTS.split(':')[1] + ' ' + endLTS.split(':')[2].split(' ')[1]
      });
      
      container.innerHTML += html;
    }
  }
  
};

// everything starts here
var data = v.Calendar.compute([
    {id: 1, start: 30, end: 150}
  , {id: 2, start: 540, end: 600}
  , {id: 3, start: 560, end: 620}
  , {id: 4, start: 610, end: 670}
  //, {id: 5, start: 605, end: 690}
  //, {id: 6, start: 300, end: 430}
  //, {id: 7, start: 300, end: 420}
  //, {id: 8, start: 600, end: 660}
]);
v.Calendar.draw(data);