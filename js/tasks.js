$(document).ready(function () {
    var taskCompute = $('#compute');
    var taskText = $('#compute2');
    var taskTitle = $('.task h3');
    var taskButton = $('.task button');
    var undoCount = 0;
    var clearCount = 0;
    var missClickCount = 0;
    var buttonsPressed = [];
    var i = 1;
    var tasks = [];
    var buttonPressed = false;

    var data = [];
    var clicks_coordinates = [];
    var clicks_times = [];
    var startTime = null;
    var timerStart = true;
    var WIDTH = parseInt($('#version').val());

    function createTasks() {
        tasks[0] = '';
        tasks[1] = '10 + 25 * 4 + log(100)';
        tasks[2] = 'sin(5) - cos(180 deg)';
        tasks[3] = '(cos(180))^2 + (sin(90))^2 + 4!';
    }

    function recordTaskData() {
        data.push({'buttons': buttonsPressed, 'clicks': clicks_coordinates, 'times': clicks_times, 'errors': undoCount + clearCount + missClickCount});
    }

    function showDataJson() {
        var datajson = JSON.stringify(data);
        console.log(datajson);
    }

    createTasks();

    $('.scientific-calculator').click(function (event) {
        var x = event.clientX;
        var y = event.clientY;

        if (!buttonPressed) {
            missClickCount++;

        }


        // calculate the time difference since last click
        if (startTime) {
            var endTime = Date.now();
            var difference = endTime - startTime;
            if (buttonPressed) clicks_times.push(difference);
            startTime = Date.now();
        }



        buttonPressed = false;

    });

    $('.scientific-calculator button').click(function () {
        buttonPressed = true;
        var value = $(this).val();
        var buttonOffset = $(this).offset();
        if (i > 0) if (value != 'undo' && value != 'c') {
            clicks_coordinates.push([buttonOffset.left, buttonOffset.top]);
            buttonsPressed.push(value);
        }
    });

    $('.undo').click(function () {
        undoCount++;
    });

    $('.clear').click(function () {
        clearCount++;
    });

    taskButton.click(function () {

        if (i==1) {
            startTime = Date.now();
            timerStart = false;
        }

        if (i > 1) {
            recordTaskData();
        }

        clicks_coordinates = [];
        clicks_times = [];
        undoCount = 0;
        clearCount = 0;
        missClickCount = 0;
        buttonsPressed = [];

        // add the coordinates of the task button to the list
        clicks_coordinates.push([$(this).offset().left, $(this).offset().top]);

        taskText.text("");
        taskTitle.text('Task ' + i);
        taskCompute.text('Compute: ');
        if (i < 4) {
            var latex = math.parse(tasks[i]).toTex();
            var elem = MathJax.Hub.getAllJax('task-text')[0];
            MathJax.Hub.Queue(['Text', elem, latex]);
        }

        if (i < 2) taskButton.text('Next task');
        else if (i==3) {
            taskButton.text("Show results");
        }
        else if (i==4) {
            //showDataJson();
            $('.row').hide();
            $('.task').hide();
            var task_ids = computeIDs(data);
            var final_data = createDataStructure(data, task_ids);
            for (var k = 0; k < 3; k++) createScatterPlot(final_data[k], k+1);
        }
        i++;
    });


    /* ANALYSE */

    // compute distance between 2 buttons
    function distance(a, b) {
        var x1 = a[0],
            x2 = b[0],
            y1 = a[1],
            y2 = b[1];
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }

    // compute index of difficulty
    function computeID(distance, width) {
        return Math.log2(distance/width + 1);
    }

    // compute a list which contains 3 lists (one for each task) of indexes of difficulty
    function computeIDs(data) {
        var ids = [];
        for (var j = 0; j < 3; j++) {
            ids.push([]);
            for (var k = 0; k < data[j]['clicks'].length - 1; k++) {
                var dist = distance(data[j]["clicks"][k], data[j]["clicks"][k+1]);
                if (dist == 0) ids[j].push(0);
                else ids[j].push(computeID(dist, WIDTH));
            }
        }
        return ids;
    }

    // create the data structure which will be used to make the scatter plot
    function createDataStructure(raw_data, raw_ids) {
        var data = [],
            times = [],
            ids = [],
            buttons = [];

        for (var j = 0; j < 3; j++) {
            times.push(raw_data[j]['times']);
            ids.push(raw_ids[j]);
            buttons.push(raw_data[j]['buttons']);
        }

        for (j = 0; j < 3; j++) {
            data.push([]);
            for (var m = 0; m < ids[j].length; m++) {
                data[j].push({'time': times[j][m], 'id':ids[j][m], 'button': buttons[j][m]});
            }
        }
        return data;
    }

    /* creates a scatter plot from the collected data
     * on Ox axis is displayed the Index of difficulty for each button pressed by the user
     * on Oy axis is displayed the Time difference between each button click
     *
     * the code for constructing the plot is taken from http://bl.ocks.org/weiglemc/6185069
     * and modified to fit my data structure
     */
    function createScatterPlot(data, task) {

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */

        // setup x
        var xValue = function(d) {return d['id'];}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) {return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) {return d['time'];}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) {return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

        // setup fill color
        var cValue = function(d) {return d['button'];},
            color = d3.scale.category20();

        var taskTitle = d3.select("body").append("h2")
            .attr("class", "plot-title");

        var taskExpr = d3.select("body").append("h4")
            .attr("id", "plot-expr");

        // add the graph canvas to the body of the webpage
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // change string (from CSV) into number format
        data.forEach(function(d) {
            d['time'] = +d['time'];
            d["id"] = +d["id"];
        });

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
        yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

        // x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Index of difficulty");

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Time");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) {
                return color(cValue(d));
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["button"] + "<br/> (" + xValue(d).toFixed(3) + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            });

        taskTitle.text("Task " + task);
        taskExpr.text("Expression to compute: " + tasks[task]);
    }

























});
