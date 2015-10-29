$(document).ready(function () {

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

