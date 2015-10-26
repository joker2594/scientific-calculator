$(document).ready(function () {
    var data = [];
    var clicks_coordinates = [];
    var dataset = [[100,200], [150,250]];
    var clicks_times = [];
    var w = 700;
    var h = 350;
    var startTime = null;
    var timerStart = true;

    var undoPos = $('.undo').offset();
    var undoCorner1 = [undoPos.top, undoPos.left];
    var undoCorner2 = [undoPos.top + 34, undoPos.left + 84.1563];

    $('#start').click(function () {
        startTime = Date.now();
    });

    $('#stop').click(function () {
        startTime = null;
        timerStart = true;
    });

    $('.scientific-calculator').click(function (event) {
        var x = event.clientX;
        var y = event.clientY;

        // calculate the time difference since last click
        if (startTime) {
            var endTime = Date.now();
            var difference = endTime - startTime;
            clicks_times.push(difference);
            startTime = Date.now();
        }

        if(timerStart) {
            startTime = Date.now();
            timerStart = false;
        }

        // verify if undo button was pushed (denotes a mistake from the user)
        if (y >= undoCorner1[0] && y <= undoCorner2[0] && x <= undoCorner2[1] && x >= undoCorner1[1])
            alert("pushed undo button");

        clicks_coordinates.push([x-210, y-100]);
        var coords = 'Coords: ' + x + ', ' + y;
        $('.display-coords').text(coords);
        $('.display-coords-array').text('All coords: ' + clicks_coordinates);
    });

    $('#log-array').click(function () {
        data.push({'clicks': clicks_coordinates, 'times': clicks_times});

        var datajson = JSON.stringify(data[0]);
        console.log(datajson);
    });

    $('#show-plot').click(function () {
        //Create SVG element
        var svg = d3.select(".display-plot")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.selectAll("circle")
            .data(clicks_coordinates)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return d[0];
            })
            .attr("cy", function(d) {
                return d[1];
            })
            .attr("r", 5);

        svg.selectAll("text")
            .data(clicks_coordinates)
            .enter()
            .append("text")
            .text(function(d) {
                return d[0] + ", " + d[1];
            })
            .attr("x", function(d) {
                return d[0];
            })
            .attr("y", function(d) {
                return d[1];
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "red");
    });



});

