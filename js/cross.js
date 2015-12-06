var create_viz = function(leftCategory, rightCategory, topCategory, bottomCategory) {
    //Set delay to allow json to load

    //Add clear All button
    //d3.select("body").append("input")
    //.attr("type", "button")
    //.attr("value", "Clear All")
    //.attr("onclick", "Clear_All()");

    //Variable to hold autocomplete options
    var keys;

    //Load words as options from CSV
    d3.csv("words.csv",function (csv) {
        keys=csv;
        start();
    });


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

    //Setup and render the autocomplete
    function start() {
        var mc = autocomplete(document.getElementById('test'))
            .keys(keys)
            .dataField("State")
            .placeHolder("Search Words - Start typing here")
            .width(750)
            .height(500)
            .onSelected(onSelect)
            .render();
    }

    //Change these variables to adjust size of viz
    var top_padding = 50;
    var side_padding = 50;
    var side_height = 400;
    var side_width = 200;


    //This data is used to create the rects in the cross
    //No need to change anything, it feeds off of the above variables
    var rectangleData = [
        { "rx": side_padding, "ry": top_padding
            + side_width, "height": side_height, "width": side_width},
        { "rx": side_padding + side_width, "ry": top_padding,
            "height": side_width, "width": side_height},
        { "rx": side_padding + side_width, "ry": top_padding
            + side_width, "height": side_height, "width": side_height},
        { "rx": side_padding + side_width + side_height, "ry": top_padding
            + side_width, "height": side_height, "width": side_width},
        { "rx": side_padding + side_width, "ry": top_padding
            + side_width + side_height, "height": side_width, "width": side_height}];


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
        .range(["red", "white", "blue"]);

    //Create svg holder for viz
    var svgContainer = d3.select("body").append("svg")
        .attr("width", 2000)
        .attr("height", 1000);

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
        .style("fill", "white")
        .style("stroke", "black");

    //Create lines
    var lines = svgContainer.selectAll("line")
        .data(lineData)
        .enter()
        .append("line");

    //Add attributes using above lineData
    var lineAttributes = lines
        .attr("x1", function (d) { return d.startx; })
        .attr("y1", function (d) { return d.starty; })
        .attr("x2", function (d) { return d.endx; })
        .attr("y2", function (d) { return d.endy; })
        .style("stroke", "black")
        .style("stroke-dasharray", "4,4");

    //Add left text
    svgContainer.append("text")
        .attr("x", side_padding + 100)
        .attr("y", top_padding + side_width + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(leftCategory);

    //Add right text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height + 100)
        .attr("y", top_padding + side_width + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(rightCategory);


    //Add top text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + 100)
        .attr("y", top_padding + 100)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text(topCategory);

    //Add bottom text
    svgContainer.append("text")
        .attr("x", side_padding + side_width + 100)
        .attr("y", top_padding + side_width + side_height + 100)
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
            .style("fill", "white");}

    //Add left subreddit text
    function left_text() {
        svgContainer.append("text")
            .attr("x", side_padding + 100)
            .attr("y", top_padding + side_width + 50)
            .attr("text-anchor", "middle")
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
            .style("fill", "white");}

    //Add right subreddit text
    function right_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + side_height + 100)
            .attr("y", top_padding + side_width + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-family", "bariol_regularregular")
            .text(rightCategory);}

    //Create function to cover old top text
    function cover_top() {
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + 30)
            .attr("y", top_padding + 80)
            .attr("width", 150)
            .attr("height", 30)
            .style("fill", "white");}

    //Add top subreddit text
    function top_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 100)
            .attr("y", top_padding + 100)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-family", "bariol_regularregular")
            .text(topCategory);}

    //Create function to cover old bottom text
    function cover_bottom() {
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + 25)
            .attr("y", top_padding + side_width + side_height + 80)
            .attr("width", 150)
            .attr("height", 30)
            .style("fill", "white");}

    //Add bottom subreddit text
    function bottom_text() {
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 100)
            .attr("y", top_padding + side_width + side_height + 100)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-family", "bariol_regularregular")
            .text(bottomCategory);}

    //Add title for Left/Right subreddit selection options
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 15)
        .attr("text-anchor", "left")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "bariol_regularregular")
        .text('Left/Right Subreddits');

    //Add in Left/Right selection options
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 50)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('Cats vs. Dogs')
        .on("click", function() {
            if (topCategory === 'cats') {
                alert('Already selected, please choose again!');
                return;
            }
            if (leftCategory === 'cats') {
                return;
            }
            Clear_All();
            console.log(json_data);
            leftCategory = 'cats';
            rightCategory = 'dogs';
            cover_left();
            left_text();
            cover_right();
            right_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', leftCategory, rightCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            //var all_data = get_row_data([],json_data["allWords"],rightCategory,leftCategory,topCategory,bottomCategory)
            add_circles(row_data, radiusScale, circleScale, colorScale);});

    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 80)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('AskMen vs. AskWomen')
        .on("click", function() {
            if (topCategory === 'AskMen') {
                alert('Already selected, please choose again!');
                return;
            }
            if (leftCategory === 'AskMen') {
                return;
            }
            Clear_All();
            console.log(json_data);
            leftCategory = 'AskMen';
            rightCategory = 'AskWomen';
            cover_left();
            left_text();
            cover_right();
            right_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', leftCategory, rightCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});


    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 110)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('nfl vs. soccer')
        .on("click", function() {
            if (topCategory === 'nfl') {
                alert('Already selected, please choose again!');
                return;
            }
            if (leftCategory === 'nfl') {
                return;
            }
            Clear_All();
            console.log(json_data);
            leftCategory = 'nfl';
            rightCategory = 'soccer';
            cover_left();
            left_text();
            cover_right();
            right_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', leftCategory, rightCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});

    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 140)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('DotA2 vs. leagueoflegends')
        .on("click", function() {
            if (topCategory === 'DotA2') {
                alert('Already selected, please choose again!');
                return;
            }
            if (leftCategory === 'DotA2') {
                return;
            }
            Clear_All();
            console.log(json_data);
            leftCategory = 'DotA2';
            rightCategory = 'leagueoflegends';
            cover_left();
            left_text();
            cover_right();
            right_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', leftCategory, rightCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});

    //Add title for Left/Right subreddit selection options
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 210)
        .attr("text-anchor", "left")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("font-family", "bariol_regularregular")
        .text('Top/Bottom Subreddits');

    //Add Top/Bottom selection options
    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 255)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('Cats vs. Dogs')
        .on("click", function() {
            if (leftCategory === 'cats') {
                alert('Already selected, please choose again!');
                return;
            }
            if (topCategory === 'cats') {
                return;
            }
            Clear_All();
            console.log(json_data);
            topCategory = 'cats';
            bottomCategory = 'dogs';
            cover_top();
            top_text();
            cover_bottom();
            bottom_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', topCategory, bottomCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});


    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 285)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('AskMen vs. AskWomen')
        .on("click", function() {
            if (leftCategory === 'AskMen') {
                alert('Already selected, please choose again!');
                return;
            }
            if (topCategory === 'AskMen') {
                return;
            }
            Clear_All();
            console.log(json_data);
            topCategory = 'AskMen';
            bottomCategory = 'AskWomen';
            cover_top();
            top_text();
            cover_bottom();
            bottom_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', topCategory, bottomCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});


    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 315)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('nfl vs. soccer')
        .on("click", function() {
            if (leftCategory === 'nfl') {
                alert('Already selected, please choose again!');
                return;
            }
            if (topCategory === 'nfl') {
                return;
            }
            Clear_All();
            console.log(json_data);
            topCategory = 'nfl';
            bottomCategory = 'soccer';
            cover_top();
            top_text();
            cover_bottom();
            bottom_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', topCategory, bottomCategory);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});

    svgContainer.append("text")
        .attr("x", side_padding + side_width + side_height+300)
        .attr("y", top_padding + side_width + 345)
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("font-family", "bariol_regularregular")
        .text('DotA2 vs. leagueoflegends')
        .on("click", function() {
            if (leftCategory === 'DotA2') {
                alert('Already selected, please choose again!');
                return;
            }
            if (topCategory === 'DotA2') {
                return;
            }
            Clear_All();
            console.log(json_data);
            topCategory = 'DotA2';
            bottomCategory = 'leagueoflegends';
            cover_top();
            top_text();
            cover_bottom();
            bottom_text();
            var the_top_ten = get_top_ten(json_data, 'subredditTopWords', topCategory, bottomCategory);
            console.log(the_top_ten);
            var row_data = get_row_data([],the_top_ten,rightCategory,leftCategory,topCategory,bottomCategory);
            add_circles(row_data, radiusScale, circleScale, colorScale);});

    //Function that updates side panels when word is selected
    function update_side_text(word, direction, side_padding1) {
        //Hide old data
        svgContainer.append("rect")
            .attr("x", side_padding1 + 4)
            .attr("y", top_padding + side_width + 58)
            .attr("width", side_width - 10)
            .attr("height", side_height - 98)
            .style("fill", "white");
        //Add word
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", top_padding + side_width + 80)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Word: " + word);
        //Add total count
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", top_padding + side_width + 100)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Total Count:  " + json_data["dataTable"][word][direction]["tc"]);
        //Add normalized count
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", top_padding + side_width + 120)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Normalized Count:  " + json_data["dataTable"][word][direction]["nc"]);
        //Add total score
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", top_padding + side_width + 140)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Total Score:  " + json_data["dataTable"][word][direction]["ts"]);
        //Add normalized score
        svgContainer.append("text")
            .attr("x", side_padding1 + 100)
            .attr("y", top_padding + side_width + 160)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Normalized Score:  " + json_data["dataTable"][word][direction]["ns"]);
    }

    //Function that changes top/bottom panels when word is selected
    function update_mid_text(word, direction, top_padding1) {
        //Hide old data
        svgContainer.append("rect")
            .attr("x", side_padding + side_width + 150)
            .attr("y", top_padding1 + 58)
            .attr("width", side_height - 175)
            .attr("height", side_width - 68)
            .style("fill", "white");
        //Show word
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 260)
            .attr("y", top_padding1 + 80)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Word: " + word);
        //Show total count
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 260)
            .attr("y", top_padding1 + 100)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Total Count:  " + json_data["dataTable"][word][direction]["tc"]);
        //Show normalized count
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 260)
            .attr("y", top_padding1 + 120)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Normalized Count:  " + json_data["dataTable"][word][direction]["nc"]);
        //Show total score
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 260)
            .attr("y", top_padding1 + 140)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Total Score:  " + json_data["dataTable"][word][direction]["ts"]);
        //Show normalized score
        svgContainer.append("text")
            .attr("x", side_padding + side_width + 260)
            .attr("y", top_padding1 + 160)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "bariol_regularregular")
            .text("Normalized Score:  " + json_data["dataTable"][word][direction]["ns"]);
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
                console.log(radiusScaler(d[9]));
                return radiusScaler(d[9]);
            })
            .attr("fill", ("r", function(d) {
                return colorScaler(d[10]);
            }))
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
                update_mid_text(d[0], bottomCategory, top_padding + side_width + side_height);});
    }


    //Get top ten words for primary subreddit comparison
    function get_top_ten(the_data, holder, sub_one, sub_two) {
        var one_top = the_data["subredditTopWords"][sub_one].slice(0,11);
        var two_top = the_data["subredditTopWords"][sub_two].slice(0,11);
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