const margin = 75;
const width = 1100 - margin * 2;
const height = 400 - margin * 2;

const svgEC = d3.select("#cChart")
  .attr("width", 1100)
  .attr("height", 400);

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("pointer-events", "none")
  .style("background", "rgba(0, 0, 0, 0.9)")
  .style("color", "white")
  .style("border", "1px solid #ccc")
  .style("padding", "8px 12px")
  .style("border-radius", "4px")
  .style("font-size", "12px")
  .style("display", "none")
  .style("z-index", 9999);

d3.csv("efficiencies.csv").then(function(data) {
  const groupedData = d3.group(data, d => d.unit_id);

  // Apply Kalman Filter to each series
  for (const [unitID, points] of groupedData) {
    // Sort by time first (e.g., cycles)
    points.sort((a, b) => a.cycles - b.cycles);

    const filteredPoints = kalmanFilter(points, "etaC");

    // Replace original with filtered
    groupedData.set(unitID, filteredPoints);
  }

  const xScale = d3.scaleLinear().domain([0, 300]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0.848, 0.866]).range([height, 0]);

  const line = d3.line()
    .x(d => xScale(+d.cycles))
    .y(d => yScale(+d.etaC));

  const chartGroup = svgEC.append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  console.log(Array.from(groupedData));

  chartGroup.selectAll(".unit-path")
    .data(groupedData)
    .join("path")
    .attr("class", "unit-path")
    .attr("fill", "none")
    .attr("stroke", (d, i) => d3.schemeCategory10[i % 10])
    .attr("stroke-width", 1)
    .attr("d", ([unit_id, points]) =>
      line(points.sort((a, b) => +a.cycles - +b.cycles))
    ).on("mouseover", function(event, [unit_id, points]) {
    // Bring to front
    d3.select(this).raise().attr("stroke-width", 3);

    const sorted = points.sort((a, b) => +a.cycles - +b.cycles);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalChange = (+last.etaC - +first.etaC)*100;
    const finalEfficiency = +last.etaC*100;

    tooltip.style("display", "block")
      .html(
        `<strong>Unit ID:</strong> ${unit_id}<br/>
         <strong>Cycles at Failure:</strong> ${last.cycles}<br/>
         <strong>Compressor Efficiency at Failure:</strong> ${finalEfficiency.toFixed(1)}%<br/>
         <strong>ΔEfficiency:</strong> ${totalChange.toFixed(2)}%`
      );
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", (event.pageX + 12) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", function() {
    d3.select(this).attr("stroke-width", 1);
    tooltip.style("display", "none");
  });

  const yAxis = d3.axisLeft(yScale)
    .tickValues([0.850, 0.855, 0.860, 0.865])
    .tickFormat(d3.format(".3f"));

  chartGroup.append("g").call(yAxis);

  const xAxis = d3.axisBottom(xScale)
    .tickValues([0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300])
    .tickFormat(d3.format("~s"));

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Title
  chartGroup.append("text")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Engine Compressor Efficiency vs. Flight Cycles")
    .style("font-size","20px");

  // X Axis Label
  chartGroup.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Flight Cycles")
    .style("font-size","14px");

  // Y Axis Label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Compressor Efficiency")
    .style("font-size","14px"); 
});

function kalmanFilter(data, key, R = 0.5, Q = 0.001) {
  const result = [];

  let x = +data[0][key];  // Convert to number
  let P = 1;

  for (let i = 0; i < data.length; i++) {
    const z = +data[i][key]; // Ensure z is a number

    if (isNaN(z)) {
      result.push({ ...data[i], [key]: x }); // keep last value if current is invalid
      continue;
    }

    // Prediction update
    P = P + Q;

    // Measurement update
    const K = P / (P + R);
    x = x + K * (z - x);
    P = (1 - K) * P;

    // Save new smoothed value (as number)
    result.push({ ...data[i], [key]: x });
  }

  return result;
}