
function visualizeit(cloud1, cloud2) {   

//var fill = d3.scale.category10();


var angle = 60;
var cloudwidth = 450;
var cloudheight = 500;
var textwidth = 190;
var cloudfont = "helvetica"; //"bariol_regularregular"; // e.g. 


var data1 = d3.entries(data.dataTable);
createClouds(cloud1, cloud2);


function createClouds(cloud1, cloud2) {
	d3.select("#wordCloud").selectAll("svg").remove();
	var list1 = data1
				.map(function(d) { return d["value"][cloud1]["nc"] < 0.1 ? null : {text: d["key"], count: d["value"][cloud1]["nc"] * 100}  }) 
				.filter(function (v) { return v != null})
				.sort(function(a,b) { return b.count - a.count});
	
	
	var list2 = data1
				.map(function(d) { return d["value"][cloud2]["nc"] < 0.1 ? null : {text: d["key"], count: d["value"][cloud2]["nc"] * 100}  }) 
				.filter(function (v) { return v != null})
				.sort(function(a,b) { return b.count - a.count});
	
	// Display only the top 50 words in each cloud
	var maxDisplay = 50;
	var shortest = d3.min([list1.length,list2.length, maxDisplay]);
	list1.splice(shortest, list1.length - shortest);
	list2.splice(shortest, list2.length - shortest);
			
	var max1 = d3.max(list1, function(d){ return +d.count})
	var max2 = d3.max(list2, function(d){ return +d.count})
	
	var maxCount = d3.max([max1, max2]);	
	var minCount = d3.min([d3.min(list1, function(d){ return +d.count}), d3.min(list2, function(d){ return +d.count})]);
	
	console.log(minCount, maxCount)
	var fill = d3.scale.linear()
		.domain([minCount,  maxCount]) //d3.mean([minCount, minCount, maxCount])
		.range(["#ff8b60",  "#FF4500"]);
		// cross: ["#9494ff", "#ffffff", "#ff8b60"]
		// orange #FF4500,  green #00B060, dark blue "#053D64",  bright blue #0A64A4, light orange "#FF9000"
	
	// Font scale			
	var fScale = d3.scale.linear()
			.domain([minCount, maxCount])
			.range([12, 120]);
	
	var yScale = d3.scale.linear()
			.domain([0, maxCount*1.05])
			.range([0, 100]);
	// Title bar
	d3.select("#wcLeftTitle").selectAll("*").remove();
	d3.select("#wcLeftTitle")	
		.append("h1")
		.style("font-weight", "bold")	
		.style("font-family", cloudfont)
		.text(cloud1)

	d3.select("#wcRightTitle").selectAll("*").remove();
	d3.select("#wcRightTitle")	
		.append("h1")
		.style("font-weight", "bold")
		.style("font-family", cloudfont)
		.text(cloud2)

	// First wordcloud
	var layout = d3.layout.cloud()
		.size([cloudwidth, cloudheight])
		.words(list1)
		.padding(5)
		.rotate(function() { return ~~(Math.random() * 2) ; }) // * angle
		.font(cloudfont)
		.fontSize(function(d) { return fScale(d.count); })
		.on("end", function(d) { draw(d, "#wcLeftCloud")});
	
	layout.start();
	
	// Details svg
	d3.select("#wcCenterText").selectAll("*").remove();
	var svg = d3.select("#wcCenterText")
					.append("svg")
					.attr("width", textwidth)
					.attr("height", cloudheight)
					.attr("float", "right")
					//.style("border", "1px solid black")
					.attr("id", "details");
		
		svg.append("text")
			.attr("x", textwidth/2)
			.attr("y", 35)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text("Hover over a word");
		svg.append("text")
			.attr("x", textwidth/2)
			.attr("y", 55)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text("for details");
		svg.append("line")
			.style("stroke-width", "1px")
			.style("stroke", "black")
			.style("shape-rendering", "crispEdges")
			.attr("x1", 5)
			.attr("y1", 70)
			.attr("x2", textwidth - 5)
			.attr("y2", 70);
	setupDetails();
	
	function setupDetails() {
        
		
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", cloudheight - 55)
			.attr("text-anchor", "middle")
			.style("font-size", "13px")
			.style("font-family", "bariol_regularregular")
			.text("* Only displaying the top " + maxDisplay);
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", cloudheight - 35)
			.attr("text-anchor", "middle")
			.style("font-size", "13px")
			.style("font-family", "bariol_regularregular")
			.text("words in each subreddit that");
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", cloudheight - 15)
			.attr("text-anchor", "middle")
			.style("font-size", "13px")
			.style("font-family", "bariol_regularregular")
			.text("have a normalized count > 10");
	}
	
	// Second wordcloud
	layout = d3.layout.cloud()
		.size([cloudwidth, cloudheight])
		.words(list2)
		.padding(1)
		.rotate(function() { return ~~(Math.random() * 2) ; }) // * angle
		.font(cloudfont)
		.fontSize(function(d) { return fScale(d.count); })
		.on("end", function(d) {draw(d, "#wcRightCloud")});
	
	layout.start();
	
	function clear_text() {
		svg.selectAll("text").remove();
		svg.selectAll("line").remove();
		}
	
	function draw(words, container) {
		d3.select(container).selectAll("*").remove();
		d3.select(container).append("svg")
			.attr("width", layout.size()[0])
			.attr("height", layout.size()[1])
			.attr("float", "right")
			.attr("id", "cloud")
		  .append("g")
		  
			.attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
		  .selectAll("text")
			.data(words)
		  .enter().append("text")
			.style("font-size", function(d) { return d.size + "px"; })
			.style("font-family", cloudfont)
			.style("fill", function(d) { return fill(d.size);})
			//.style("fill", function(d, i) { return fill(i); })
			.attr("text-anchor", "middle")
			
			.attr("transform", function(d) {
			  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
			.text(function(d) { return d.text; })
			.attr("class", function(d) {return d.text;}) // tag the word for linking
			
			.on("mouseover", function(d) {
				  clear_text();
				  write(d.text);
				  d3.selectAll("g").selectAll("text")
					  .transition()
					  .duration(500)
					  .style("opacity", function(o){
						  if (d.count > 0) {
							  return o.text === d.text ? 1 : .2;}
						  return 1;
					  })
			})
			.on("mouseout", function(d) {
				  d3.selectAll("text")
					  .transition()
					  .duration(500)
					  .style("opacity",  1);
				  })
			;
	  }
	function write(word) {
		setupDetails();
		/*
		svg.append("line")
			.style("stroke-width", "1px")
			.style("stroke", "black")
			.style("shape-rendering", "crispEdges")
			.attr("x1", 5)
			.attr("y1", 10)
			.attr("x2", textwidth - 5)
			.attr("y2", 10);
		*/
		svg.append("text")
			.style("font-size", "5px")
			.transition()
			.duration(500).ease("linear")
			.attr("x", textwidth/2)             
			.attr("y", 50)
			.attr("text-anchor", "middle")
			.style("font-weight", "bold")
			.style("font-size", "30px")
			.style("font-family", "bariol_regularregular")
			.text(word);
		svg.append("line")
			.style("stroke-width", "1px")
			.style("stroke", "black")
			.style("shape-rendering", "crispEdges")
			.attr("x1", 5)
			.attr("y1", 70)
			.attr("x2", textwidth - 5)
			.attr("y2", 70);
		/*
		svg.append("text")
			.attr("x", 5)             
			.attr("y", 180)
			.attr("text-anchor", "left")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text('Normalized count:');
		*/
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", 100)
			.style("font-size", "0px")
			.attr("text-anchor", "middle")
			//.transition().duration(200).ease("linear")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text(cloud1 +' - ' + Math.round(data["dataTable"][word][cloud1]["nc"] * 10000) / 100); // One decimal place
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", 130)
			.style("font-size", "0px")
			.attr("text-anchor", "middle")
			//.transition().duration(200).ease("linear")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text(cloud2 +' - ' + Math.round(data["dataTable"][word][cloud2]["nc"] * 10000) / 100); // One decimal place
		svg.append("line")
			.style("stroke-width", "1px")
			.style("stroke", "black")
			.style("shape-rendering", "crispEdges")
			.attr("x1", 5)
			.attr("y1", 320)
			.attr("x2", textwidth - 5)
			.attr("y2", 320);
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", 350)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text('Score in each subreddit:');
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", 380)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text(cloud1 +' - ' + data["dataTable"][word][cloud1]["ts"]);
		svg.append("text")
			.attr("x", textwidth/2)             
			.attr("y", 410)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text(cloud2 + ' - ' + data["dataTable"][word][cloud2]["ts"]);
		//Create bars
		svg.selectAll("rect").remove();
		var startBar = 260;
		var barWidth = 20;
		svg.append("rect")
			//.attr("fill", fill(0))
			.attr("y", cloudheight - startBar)
			.attr("height", 0)
			.transition()
			.duration(500).ease("linear")
			.attr("x", textwidth / 3)
			.attr("y", cloudheight - startBar - yScale(Math.round(data["dataTable"][word][cloud1]["nc"] * 10000) / 100))
			.attr("width", barWidth)
			.attr("height", yScale(Math.round(data["dataTable"][word][cloud1]["nc"] * 10000) / 100));
		svg.append("rect")
			//.attr("fill", fill(1))
			.attr("y", cloudheight - startBar)
			.attr("height", 0)
			.transition()
			.duration(500).ease("linear")
			.attr("x", textwidth * 2 / 3 - barWidth)
			.attr("y", cloudheight - startBar - yScale(Math.round(data["dataTable"][word][cloud2]["nc"] * 10000) / 100))
			.attr("width", barWidth)
			.attr("height", yScale(Math.round(data["dataTable"][word][cloud2]["nc"] * 10000) / 100));
		svg.append("text")
			.attr("x", textwidth / 2)             
			.attr("y", cloudheight - startBar + 15)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text("Normalized Count");
		svg.append("text")
			.attr("x", textwidth / 2)             
			.attr("y", cloudheight - startBar + 35)
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.style("font-family", "bariol_regularregular")
			.text("In Each Subreddit");
		svg.append("text")
			.attr("x", textwidth / 2)             
			.attr("y", cloudheight - startBar + 55)
			.attr("text-anchor", "middle")
			.style("font-size", "13px")
			.style("font-family", "bariol_regularregular")
			.text("0 - low, 100 - high");
	}


	// options bar
	/*
	var bar = d3.select("body")
			.append("svg")
			.attr("width", textwidth + cloudwidth + cloudwidth)
			.attr("height", 50)
			.attr("float", "right")
			.style("border", "1px solid black")
			.attr("id", "options");
		bar.append("text")
			.attr("x", 10) 
			.attr("y", 30)
			.attr("text-anchor", "left") 
			.style("font-size", "24px")
			.style("font-family", "bariol_regularregular")
			.text('AskMen vs. AskWomen')
			.on("click", function(d) {
				createClouds("AskMen", "AskWomen");
				});
		bar.append("text")
			.attr("x", 335) 
			.attr("y", 30)
			.attr("text-anchor", "left") 
			.style("font-size", "24px")
			.style("font-family", "bariol_regularregular") 
			.text('cats vs. dogs')
			.on("click", function(d) {
				createClouds("cats", "dogs");
				});
		bar.append("text")
			.attr("x", 570) 
			.attr("y", 30)
			.attr("text-anchor", "left") 
			.style("font-size", "24px")
			.style("font-family", "bariol_regularregular") 
			.text('NFL vs. Soccer')
			.on("click", function(d) {
				createClouds("nfl", "soccer");
				});
		bar.append("text")
			.attr("x", 810) 
			.attr("y", 30)
			.attr("text-anchor", "left") 
			.style("font-size", "24px")
			.style("font-family", "bariol_regularregular") 
			.text('DotA2 vs. leagueoflegends')
			.on("click", function(d) {
				createClouds("DotA2", "leagueoflegends");
				});
	*/
	
}


}


