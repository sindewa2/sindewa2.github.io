const margin = 50;
const width = 400 - margin * 2;
const height = 400 - margin * 2;

const svgEC = d3.select("#cChart")
  .attr("width", 400)
  .attr("height", 400);

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
  const yScale = d3.scaleLinear().domain([0.83, 0.88]).range([height, 0]);

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
    );

  const yAxis = d3.axisLeft(yScale)
    .tickValues([0.83, 0.84, 0.85, 0.86, 0.87, 0.88])
    .tickFormat(d3.format(".2f"));

  chartGroup.append("g").call(yAxis);

  const xAxis = d3.axisBottom(xScale)
    .tickValues([50, 100, 150, 200, 250, 300])
    .tickFormat(d3.format("~s"));

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
});

function kalmanFilter(data, key, R = 1, Q = 0.001) {
  const result = [];
  let x = data[0][key]; // initial state estimate
  let P = 1;            // initial covariance estimate

  for (let i = 0; i < data.length; i++) {
    const z = data[i][key]; // current measurement

    // Prediction update
    P = P + Q;

    // Measurement update
    const K = P / (P + R);
    x = x + K * (z - x);
    P = (1 - K) * P;

    // Store smoothed value
    result.push({ ...data[i], [key]: x });
  }

  return result;
}