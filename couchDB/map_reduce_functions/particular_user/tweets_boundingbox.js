//Filters the tweets with coordinates from a bounding box

function(doc){
	
  //Copy the bounding box GEOJSON format from http://boundingbox.klokantech.com and delete the outer brackets
  bounding_box = [[-2.0336485,52.381053],[-2.0336485,52.6087058],[-1.7288577,52.6087058],[-1.7288577,52.381053],[-2.0336485,52.381053]]
	point = doc.tweet_data.coordinates.coordinates;
	place_id = doc.tweet_data.place.id
	place_name = doc.tweet_data.place.name
	tweet = doc.tweet_data.text
	if (inside_box(point,bounding_box)) {
		emit([place_name,point],tweet)
	};
	
}

function inside_box (point, bbox) {
    
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    
    for (var i = 0, j = bbox.length - 1; i < bbox.length; j = i++) {
        var xi = bbox[i][0], yi = bbox[i][1];
        var xj = bbox[j][0], yj = bbox[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
