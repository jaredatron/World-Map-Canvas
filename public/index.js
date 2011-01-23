;(function(global, undefined) {

  var WorldMap = function(id){
    var
      map = this,
      dimentions = map.dimentions();
    map.id = id;
    map.element = $('#'+id);
    map.canvas = $('<canvas width="'+dimentions.x+'" height="'+dimentions.y+'"/>')[0];
    map.element.append(this.canvas);
    map.context = this.canvas.getContext('2d');

    $.each(WorldMap.coordinates, function(country){
      map.drawCountry(country);
    });

    map.animateTorData();

  }
  global.WorldMap = WorldMap;

  WorldMap.prototype.dimentions = function(){
    var lx = 0, ly = 0, sx = null, sy = null;

    $.each(WorldMap.coordinates, function(cc,shapes){
      shapes.forEach(function(points){
        points.forEach(function(point){
          lx = lx > point[0] ? lx : point[0];
          ly = ly > point[1] ? ly : point[1];
          sx = sx && sx < point[0] ? sx : point[0];
          sy = sy && sy < point[1] ? sy : point[1];
        });
      });
    });

    return {
      x: lx + sx,
      y: ly + sy
    };
  }

  WorldMap.prototype.drawShape = function(points, fillStyle){
    var c = this.context;
    c.fillStyle   = fillStyle || 'lightgrey';
    c.strokeStyle = 'black';
    c.beginPath();
    points.forEach(function(point, index){
      if (index === 1)
        c.moveTo(point[0], point[1]);
      else
        c.lineTo(point[0], point[1]);
    })
    c.lineTo(points[0][0], points[0][1]); // better closePath
    c.fill();
    c.stroke();
  };

  WorldMap.prototype.drawCountry = function(initials, fillStyle){
    var
      map = this,
      country = WorldMap.coordinates[initials];
    if (!country){
      // if (console) console.warn('country not found "'+initials+'"');
    }else{
      country.forEach(function(shape){ map.drawShape(shape, fillStyle); });
    }
    return this;
  };

  WorldMap.prototype.animateTorData = function(){
    var map = this;

    $.getJSON('/data.json', function(data){
      var countries = data.shift();
      countries.shift(); // removing time column
      countries.shift(); // removing unknown column
      countries.pop();   // removing all column
      function highlightCountries(){
        var
          row = data.shift(),
          time = row.shift();
        row.shift(); // removing unknown column
        row.pop();   // removing all column
        row.forEach(function(count, index){
          var country = countries[index];
          MAP.drawCountry(country, count === 'NA' ? undefined : 'red');
        });

        if (data.length > 0) setTimeout(highlightCountries, 1000);
      }

      highlightCountries();

    });
    return this;
  };

})(this);
