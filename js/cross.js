//Create function to remove all circles
function Clear_All() {
    var dataCircles = d3.select("#cross").select("svg").selectAll("circle")
    dataCircles.remove();
    var row_data = []}


var crossLeft = "AskMen";
var crossRight = "AskWomen";
var crossTop = "cats";
var crossBottom = "dogs";

var updateSide = function(left, right) {
    crossLeft = left;
    crossRight = right;
    create_viz(crossLeft, crossRight, crossTop, crossBottom);
};

var updateTop = function(top, bottom) {
    crossTop = top;
    crossBottom = bottom;
    create_viz(crossLeft, crossRight, crossTop, crossBottom);
};

var create_viz = function(leftCategory, rightCategory, topCategory, bottomCategory) {
    d3.select("#cross").selectAll("*").remove();

    //Set delay to allow json to load

    //Add clear All button
    //d3.select("body").append("input")
    //.attr("type", "button")
    //.attr("value", "Clear All")
    //.attr("onclick", "Clear_All()");


    //Call back for when user selects an option
    function onSelect(d) {
        var putting = get_word(d["State"],leftCategory,rightCategory,topCategory,bottomCategory);
        row_data.push(putting);
        add_circles(row_data, radiusScale, circleScale, colorScale);
        update_side_text(d["State"], leftCategory, side_padding);
        update_side_text(d["State"], rightCategory, side_padding + side_width + side_height);
        update_mid_text(d["State"], topCategory, top_padding);
        update_mid_text(d["State"], bottomCategory, top_padding + side_width + side_height);
    }

    //Change these variables to adjust size of viz
    var top_padding = 0;
    var side_padding = 0;
    var side_height = 500;
    var side_width = 200;

    var HEIGHT = 700;
    var WIDTH = 900;
    var vertAdj = -100;

    //This data is used to create the rects in the cross
    //No need to change anything, it feeds off of the above variables
    var rectangleData = [
        { "rx": side_padding + side_width, "ry": top_padding
            + side_width, "height": side_height, "width": side_height}]



    //Create the axis of the center square using above variables
    var lineData = [
        { "startx": side_padding + side_width + (side_height/2), "starty": top_padding +
            side_width, "endx": side_padding + side_width + (side_height/2), "endy": top_padding + side_width + side_height},
        { "startx": side_padding + side_width, "starty": top_padding +
            side_width + (side_height/2), "endx": side_padding + side_width + side_height, "endy": top_padding +
            side_width + (side_height/2)}];


    var all_data = get_row_data([],json_data["allWords"],leftCategory,rightCategory,topCategory,bottomCategory);

    //Scale to set the size of the circles
    var radiusScale = d3.scale.linear()
        .domain([d3.min(all_data, function(d) {return d[9]}), d3.max(all_data, function(d) {return d[9]})])
        .range([5, 30]);

    //Scale to put circles in the center rect
    var circleScale = d3.scale.linear()
        .domain([-.5, .5])
        .range([side_padding + side_width, side_padding + side_width + side_height]);

    //Scale to set the color of the circles
    var colorScale = d3.scale.linear()
        .domain([d3.min(all_data, function(d) {return d[10]}),
            d3.mean(all_data, function(d) {return d[10]}), d3.max(all_data, function(d) {return (d[10])})])
        .range(["#9494ff", "#ffffff", "#ff8b60"]);

    //Create svg holder for viz
    var svgContainer = d3.select("#cross").append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    //Create tooltip variables
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Create rects
    var rectangles = svgContainer.selectAll("rect")
        .data(rectangleData)
        .enter()
        .append("rect");

    //Add attributes using above rectangleData
    var rectangleAttributes = rectangles
        .attr("x", function (d) { return d.rx; })
        .attr("y", function (d) { return d.ry; })
        .attr("height", function (d) { return d.height; })
        .attr("width", function (d) { return d.width; })
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("fill", "white")
        .style("stroke", "black");

    //Create lines
    var lines = svgContainer.selectAll("line")
        .data(lineData)
        .attr("transform", 'translate(0 '+vertAdj+')')
        .enter()
        .append("line");

    //Add attributes using above lineData
    var lineAttributes = lines
        .attr("x1", function (d) { return d.startx; })
        .attr("y1", function (d) { return d.starty; })
        .attr("x2", function (d) { return d.endx; })
        .attr("y2", function (d) { return d.endy; })
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("stroke", "black")
        .style("stroke-dasharray", "4,4");

    //Add left text
    svgContainer.append("text")
        .attr("x", side_padding + 100)
        .attr("y", top_padding + side_width + (side_height/2))
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(leftCategory);

    //Add right text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height + 100)
        .attr("y", top_padding + side_width + (side_height/2))
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(rightCategory);


    //Add top text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + (side_height/2))
        .attr("y", top_padding + 180)
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(topCategory);

    //Add bottom text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + (side_height/2))
        .attr("y", top_padding + side_width + side_height + 40)
        .attr("transform", 'translate(0 '+vertAdj+')')
        .attr("text-anchor", "middle")
        .style("font-family", "bariol_regularregular")
        .style("font-size", "20px")
        .text(bottomCategory);

    //Create function to cover old left text
    function cover_left() {
        svgContainer.append("rect")
            .attr("x", side_padding + 30)
            .attr("y", top_padding + side_width + 30)
            .attr("width", 150)
            .attr("height", 30)
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("fill", "white");}

    //Add left subreddit text
    function left_text() {
        svgContainer.append("text")
            .attr("x", side_padding + 100)
        	.attr("y", top_padding + side_width + (side_height/2))
    		.attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.style("font-size", "20px")
        	.style("font-family", "bariol_regularregular")
        	.text(leftCategory);}

    //Create function to cover old right text
    function cover_right() {
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + side_height + 30)
            .attr("y", top_padding + side_width + 30)
            .attr("width", 150)
            .attr("height", 30)
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("fill", "white");}

    //Add right subreddit text
    function right_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + side_height + 100)
        	.attr("y", top_padding + side_width + (side_height/2))
        	.attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.style("font-size", "20px")
        	.style("font-family", "bariol_regularregular")
        	.text(rightCategory);}

    //Create function to cover old top text
    function cover_top() {
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + (side_height/2))
        	.attr("y", top_padding + 180)
        	.attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.style("font-size", "20px")
        	.style("font-family", "bariol_regularregular")
        	.text(topCategory);}

    //Add top subreddit text
    function top_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + (side_height/2))
        	.attr("y", top_padding + 180)
        	.attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.style("font-size", "20px")
        	.style("font-family", "bariol_regularregular")
        	.text(topCategory);}

    //Create function to cover old bottom text
    function cover_bottom() {
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + (side_height/2))
        	.attr("y", top_padding + side_width + side_height + 40)
        	.attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.style("font-family", "bariol_regularregular")
        	.style("font-size", "20px")
        	.text(bottomCategory);}

    //Add bottom subreddit text
    function bottom_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + (side_height/2))
        	.attr("y", top_padding + side_width + side_height + 40)
            .attr("transform", 'translate(0 '+vertAdj+')')
        	.attr("text-anchor", "middle")
        	.style("font-family", "bariol_regularregular")
        	.style("font-size", "20px")
        	.text(bottomCategory);}


    //Function that updates side panels when word is selected
    function update_side_text(word, direction, side_padding1) {
        //Hide old data
        svgContainer.append("rect")
            .attr("x", side_padding1 + 14)
            .attr("y", top_padding + side_width + 50)
            .attr("width", side_width - 20)
            .attr("height", side_height - 198)
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("fill", "white");
        //Add word
        left_text();
        right_text();
        var side_score = json_data["dataTable"][word][direction]["ns"] * 100
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", side_padding + side_width + (side_height/2) + 30)
            .attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text(word + ", " + side_score.toPrecision(2));
    }

    //Function that changes top/bottom panels when word is selected
    function update_mid_text(word, direction, top_padding1) {
        //Hide old data
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + 120)
            .attr("y", top_padding + top_padding1 + 160)
            .attr("width", side_height - 155)
            .attr("height", side_width - 168)
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("fill", "white");
        top_text();
        bottom_text();
        var top_score = json_data["dataTable"][word][direction]["ns"] * 100
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 375)
            .attr("y", top_padding + top_padding1 + 180)
            .attr("text-anchor", "middle")
            .attr("transform", 'translate(0 '+vertAdj+')')
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text(word + ", " + top_score.toPrecision(2));
        //Show word
    }


    //Create circles for data
    function add_circles(circle_data, radiusScaler, circleScaler, colorScaler) {
        console.log(circle_data);
        var dataCircles = svgContainer.selectAll("circle")
            .data(circle_data)
            .enter()
            .append("circle");
        //Add attributes based on testData
        var dataCircleAttribute = dataCircles
            .attr("cx", function(d) {
                if ((d[1] - d[3]) > .5) {
                    return circleScaler(.499);}
                if ((d[1] - d[3]) < -.5) {
                    return circleScaler(-.499);}
                return circleScaler(d[1] - d[3]);
            })
            .attr("cy", function(d) {
                if ((d[5] - d[7]) > .5) {
                    return circleScaler(.499);}
                if ((d[5] - d[7]) < -.5) {
                    return circleScaler(-.499);}
                return circleScaler(d[5] - d[7]);
            })
            .attr("r", function(d) {
                return 10;
                //console.log(radiusScaler(d[9]));
                //return radiusScaler(d[9]);
            })
            .attr("stroke", "gray")
            .attr("fill", ("r", function(d) {
                return colorScaler(d[10]);
            }))
            .attr("transform", 'translate(0 '+vertAdj+')')
            //Add in tooltips
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("color", "black")
                tooltip.html(d[0])
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            //Change panels on click
            .on("click", function(d) {
                update_side_text(d[0], leftCategory, side_padding);
                update_side_text(d[0], rightCategory, side_padding + side_width + side_height);
                update_mid_text(d[0], topCategory, top_padding);
                update_mid_text(d[0], bottomCategory, side_width + side_height + 40 - 180);});
    }
    
    function add_legend_circle(color_number, y_pos) {
    	svgContainer.append("circle")
    		.attr("cx", 750)
    		.attr("cy", y_pos)
    		.attr("r", 10)
    		.attr("stroke", "gray")
    		.attr("fill", color_number)
            .attr("transform", 'translate(0 '+vertAdj+')');
    }
        
     console.log(d3.mean(all_data, function(d) {return d[10]}));
                
    add_legend_circle("#ff8b60", 600);
    add_legend_circle("#ffc5af", 620);
    add_legend_circle("#ffe2d7", 640);
    add_legend_circle("#ffffff", 660);
    add_legend_circle("#e4e4ff", 680);
    add_legend_circle("#c9c9ff", 700);
    add_legend_circle("#9494ff", 720);
    
    svgContainer.append("text")
    	.attr("x", 825)
    	.attr("y", 605)
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "16px")
        .style("font-family", "bariol_regularregular")
        .text("Positive Sentiment");
        
    svgContainer.append("text")
    	.attr("x", 825)
    	.attr("y", 665)
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "16px")
        .style("font-family", "bariol_regularregular")
        .text("Neutral Sentiment");
        
    svgContainer.append("text")
    	.attr("x", 825)
    	.attr("y", 725)
        .attr("text-anchor", "middle")
        .attr("transform", 'translate(0 '+vertAdj+')')
        .style("font-size", "16px")
        .style("font-family", "bariol_regularregular")
        .text("Negative Sentiment");
    	


    //Get top ten words for primary subreddit comparison
    function get_top_ten(the_data, holder, sub_one, sub_two) {
        var one_top = the_data["subredditTopWords"][sub_one].slice(0,101);
        var two_top = the_data["subredditTopWords"][sub_two].slice(0,101);
        //var one_top = the_data["subredditTopWords"][sub_one].slice(0,11);
        //var two_top = the_data["subredditTopWords"][sub_two].slice(0,11);
        var combined = _.union(one_top, two_top);
        console.log(combined);
        return combined;
    }

    //Go from json to array-based data format
    function get_row_data(starting_list, new_list, right, left, bottom, top) {
        for (i = 0, len = new_list.length; i < len; i++) {
            temp = [];
            temp.push(new_list[i]);
            temp.push(json_data["dataTable"][new_list[i]][right]["nc"]);
            temp.push(json_data["dataTable"][new_list[i]][right]["ns"]);
            temp.push(json_data["dataTable"][new_list[i]][left]["nc"]);
            temp.push(json_data["dataTable"][new_list[i]][left]["ns"]);
            temp.push(json_data["dataTable"][new_list[i]][top]["nc"]);
            temp.push(json_data["dataTable"][new_list[i]][top]["ns"]);
            temp.push(json_data["dataTable"][new_list[i]][bottom]["nc"]);
            temp.push(json_data["dataTable"][new_list[i]][bottom]["ns"]);
            temp.push(temp[1]+temp[3]+temp[5]+temp[7]);
            temp.push(temp[2]+temp[4]+temp[6]+temp[8]);
            starting_list.push(temp);
        }
        return starting_list;
    }

    //Given a word, return all associate values
    function get_word(word, right, left, bottom, top) {
        temp = [];
        temp.push(word);
        temp.push(json_data["dataTable"][word][right]["nc"]);
        temp.push(json_data["dataTable"][word][right]["ns"]);
        temp.push(json_data["dataTable"][word][left]["nc"]);
        temp.push(json_data["dataTable"][word][left]["ns"]);
        temp.push(json_data["dataTable"][word][top]["nc"]);
        temp.push(json_data["dataTable"][word][top]["ns"]);
        temp.push(json_data["dataTable"][word][bottom]["nc"]);
        temp.push(json_data["dataTable"][word][bottom]["ns"]);
        temp.push(temp[1]+temp[3]+temp[5]+temp[7]);
        temp.push(temp[2]+temp[4]+temp[6]+temp[8]);
        return temp;
    }

    function change_viz(leftCategory, rightCategory, topCategory, bottomCategory) {
        Clear_All();
        console.log(json_data);
        var the_top_ten = get_top_ten(json_data, "subredditTopWords", leftCategory, rightCategory);
        var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
        var all_data = get_row_data([],json_data["allWords"],rightCategory,leftCategory,topCategory,bottomCategory)
        add_circles(row_data, radiusScale, circleScale, colorScale);
    }

    //Find top ten words across subreddits
    var the_top_ten = get_top_ten(json_data, "subredditTopWords", leftCategory, rightCategory);
    //Put in array format
    var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
    //Put all data in array, for scales
    var all_data = get_row_data([],json_data["allWords"],rightCategory,leftCategory,topCategory,bottomCategory)
    //Add in data circles
    add_circles(row_data, radiusScale, circleScale, colorScale);
};