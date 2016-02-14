
   var parts = 2;
   var currentpart = 0;
   var mastery = 75;
   var xmargin = 150;

   var scrolly = 0; // how many px to scroll, if needed

	var pdense = new Path.Rectangle({
	   	from: [10, 0],
		to: [110, 50],
		radius: 10,
		fillColor: new Color(0,0,0,0.125)
	});
	var pdense2 = new Path.Rectangle({
		from: [5, 25],
		to: [60, 50],
		fillColor: new Color(0,0,0,0.125)
	});
	var pdense3 = new Path.Rectangle({
		from: [-10, -10],
		to: [10, 50],
		radius: 10,
		fillColor: 'white'
	});
	pdense.join(pdense2);
	pdense.scale(2);
	pdense3.scale(2);

/*
    var pdense = new Path.Rectangle({
            from: [0, 0],
            to: [100, 50],
            radius: 20,
            fillColor: new Color(0,0,0,0.25)
        });
*/

    var path = new Path.Ellipse({
            from: [0, 0],
            to: [40, 50],
            fillColor: 'black'
        });

    var dymbol = new Symbol(pdense);
    var wymbol = new Symbol(pdense3); // whitespace
    var symbol = new Symbol(path);
	var group = new Group();

	var gopacity = 0;

function texturalMsg() {

		group = new Group(); // will overwrite ?!?
		gopacity = 0;

		var yadvance = 125; // can edit to match new tmsg height

		if( mastery > (view.size.height - (yadvance * 0.5)) ) {
			scrolly = yadvance;
// 			view.scrollBy(new Point(0, yadvance)); // save, if anim is turned off
		}

		if(currentpart == 0) {
	        var denter = new Point(xmargin, mastery);
	        currentpart++;
	        currentpart %= parts;
	        mastery += yadvance;

   	        var dplaced = dymbol.place(denter);
// 	        var wplaced = wymbol.place(dymbol.position); // quick n dirty
	        var wplaced = wymbol.place(denter - [115,5]); // quick n dirty

        }
        else {
	        var denter = new Point(view.size.width - xmargin, mastery);
	        currentpart++;
	        currentpart %= parts;
	        mastery += yadvance;

	        var dplaced = dymbol.place(denter).scale([-1,1]);
	        var wplaced = wymbol.place(denter - [-115,5]).scale([-1,1]);; // quick n dirty
	    }
		group.addChild(dplaced);
		group.addChild(wplaced);

  		var chars = ['n','b'];
//  		var chars = ['K','j','r','n','b','w'];
// ' \u222b ',' \u015 ',' \u02D9 '];
	    var count = (Math.random() * 24) + 1;
	    for (var i = 0; i < count; i++) {

			if(currentpart == 1) {
				var vpoint = new Point();
				vpoint.length = ( Math.exp(Math.random()) - 1 ) * 25;
				vpoint.angle = Math.random() * 360;
		        var center = denter + vpoint;

		        var placed = symbol.place(center);
		        placed.rotate(60);
		        var scale = 0.25;
				group.addChild(placed);
		        placed.scale(scale);
			}
			else
			{
				var vpoint = new Point();
				vpoint.length = ( Math.exp(Math.random()) - 1 ) * 25 + 25;
				vpoint.angle = Math.random() * 360;
		        var center = denter + vpoint;

				var thischar = Math.floor(Math.random() * chars.length);
				// \u0152 quarter rest
				var text = new PointText({
				    point: center,
				    content: chars[thischar],
				    fillColor: 'black',
				    fontFamily: 'Opus',
				    fontSize: 36
				});
				group.addChild(text);

			} // endif currentpart

		}

}

		// works
        function onMouseDown(event) {
			texturalMsg();
        }

		// seems to make one, then none
//		document.setInterval(texturalMsg(), 3000);

   	texturalMsg();
		var cooldown = 0;

        function onFrame(event) {

	        // // quick n dirty way to add timing
	        // if(cooldown <= 0) {
		    //     var newtxtprob = Math.random();
			// }
	        // if(newtxtprob < 0.025) {
	        // 	texturalMsg();
	        // 	cooldown = 30; // counted in frames?
        	// }
        	// cooldown--;

	        group.opacity = (gopacity/100);
	        gopacity = gopacity + 15;

			if(scrolly > 0) {
// 				view.scrollBy(new Point(0, 1));
// 				scrolly--;
				view.scrollBy(new Point(0, 10));
				scrolly = scrolly - 10;
			}
        }
