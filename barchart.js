(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed
    //to other javascript in other files. It is not required.

    var width=600, height=400
    d3.csv("./cars.csv").then((data) => {
            var data = d3.rollup(data, v =>
                Math.round(d3.mean(v, d => d.cty)), d => d.manufacturer);
            var data = Array.from(data, ([name, value]) => ({name, value}));

            const distinctValues = [...new Set(data.map((d) => d.name))]


            var x = d3.scaleBand()
                .domain(distinctValues) //use manufacturer as input
                .range([0, width])
                .padding(0.1);

            var y = d3.scaleLinear()
                .domain([0, d3.max(data, (d) => {
                    return (+d.value)
                })])
                .range([height, 0]);

//Creating an color scale for nominal (categorical data)
            var ordinal = d3.scaleOrdinal().domain(distinctValues) //use unique values as input domain
                .range(d3.schemeSet3); //use d3 Color Scheme #3 as possible output colors
            var svg = d3.select("#barchart")
//create an svg g element and add 50px of padding
            const chart = svg.append("g")
                .attr("transform", `translate(50, 50)`)



            chart.append("g")
                .attr("transform", "translate(0," + (height) + ")")
                .call(d3.axisBottom(x).ticks(10).tickSize(-height - 10))
                //Optional: remove the axis endpoints
                .call((g) => g.select(".domain").remove());

            chart.append("g")
                .call(d3.axisLeft(y).ticks(10).tickSize(-width - 10))
                //Optional: remove the axis endpoints
                .call((g) => g.select(".domain").remove());


            bars = chart.append('g')
                .selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", function (d) {
                    return x(d.name);
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("fill", function (d) {
                    return ordinal(d.name)
                })
                .attr("width", x.bandwidth()) //use the bandwidth returned from our X scale
                .attr("height", function (d) {
                    return height - y(+d.value);
                }) //full height - scaled y length
                .style("opacity", 0.75)

            chart.append('text') //x-axis
                .attr('class', 'axis-title') //Optional: change font size and font weight
                .attr('y', height + 25) //add to the bottom of graph (-25 to add it above axis)
                .attr('x', width - 100) //add to the end of X-axis (-60 offsets the width                     of text)
                .text('Manufacturer'); //actual text to display

            chart.append('text') //y-axis
                .attr('class', 'axis-title') //Optional: change font size and font weight
                .attr('x', 10) //add some x padding to clear the y axis
                .attr('y', 25) //add some y padding to align the end of the axis with the text
                .text('CTY');
        }

    );
})();

