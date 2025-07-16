const centerY = 200;
// Linear interpolation
function lerp(start, end, t) {
return start + (end - start) * t;
}

// Animate the dash offset
function animateFlow(path) {
  path.transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attrTween("stroke-dashoffset", () => d3.interpolate(10, 0))
    .on("end", () => animateFlow(path));
}

// define color scale for the flow path dots
const colorScale = d3.scaleLinear()
  .domain([480, 1600, 3500]) 
  .range(["deepskyblue", "orange", "red"]);

// define color scale for the flow path dots
const sizeScale = d3.scaleSqrt()
  .domain([14.6, 550])  
  .range([10, 5]);       

function createFlowDot(path, group, segments, xScale, yScale,type) {
  const flowDotElements = [];

  const totalLength = path.node().getTotalLength();
  const pathId = path.attr("id") || "Unnamed path";

  const dot = group.append("circle")
    .attr("r", sizeScale(segments[0].pressure))
    .attr("fill", colorScale(segments[0].temp))
    .attr("opacity", 0);

  flowDotElements.push(dot);

  animateDot(dot, segments, xScale, yScale, 4000, type, path, totalLength);

  return flowDotElements;
}

function animateDot(dot, segments, xScale, yScale, duration, type, path, totalLength) {
  dot.transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attrTween("transform", () => {
      return t => {
        // interpolate which segment we're on based on t
        const state = interpolateSegment(segments, t);

        // x is linear from pct domain
        const x = xScale(t);

        console.log(`Type "${type}"`);

        //need to set y value based off of which chart the dot is going to be populated on
        let y = 0;
        let point = 0;
        if (type === "pressure"){
          y = yScale ? yScale(state.pressure) : 0; 
        }
        else if (type === "temp"){
          y = yScale ? yScale(state.temp) : 0; 
        }
        else if (type === "core"){
          point = path.node().getPointAtLength(t * totalLength);
          y = point.y;
        }
        else{
          y = 0; // reset y to 0
        }

        dot
          .attr("fill", colorScale(state.temp))
          .attr("r", sizeScale(state.pressure));

        return `translate(${x},${y})`;
      };
    })
    .on("end", () => animateDot(dot, segments, xScale, yScale, duration, type, path, totalLength));
}

function interpolateSegment(segments, t) {
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const next = segments[i];
    if (t <= next.pct) {
      const localT = (t - prev.pct) / (next.pct - prev.pct);
      const temp = prev.temp + localT * (next.temp - prev.temp);
      const pressure = prev.pressure + localT * (next.pressure - prev.pressure);
      return { temp, pressure };
    }
  }
  return segments[segments.length - 1];
}

// Animate dash offset for sliding effect
function animateDash(path) {
    path
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attrTween("stroke-dashoffset", () => d3.interpolate(0, 15))
        .on("end", () => animateDash(path));
}

function animateBladeDashes(group) {
  // Clear any existing overlay dashed lines to avoid duplicates
  group.selectAll(".dash-overlay").remove();

  const dashOverlayElements = []; // local array to collect new elements

  // Append new dashed overlay lines on top of each existing line
  group.selectAll("line").each(function () {
    const orig = d3.select(this);
    const x1 = orig.attr("x1");
    const y1 = orig.attr("y1");
    const x2 = orig.attr("x2");
    const y2 = orig.attr("y2");
    const strokeWidth = orig.attr("stroke-width") || 2;

    const dashLine = group.append("line")
      .attr("class", "dash-overlay")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "black")
      .attr("stroke-width", strokeWidth * 0.7)
      .attr("fill", "none")
      .attr("stroke-dasharray", "8 8")
      .attr("stroke-dashoffset", 0)
      .attr("opacity", 0); // start hidden

    dashOverlayElements.push(dashLine);

    animateLine(dashLine);
  });

  return dashOverlayElements;
}

// Animate stroke-dashoffset for sliding dash effect
function animateLine(dashLine) {
    dashLine.transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 16)
    .on("end", () => {
        dashLine.attr("stroke-dashoffset", 0);
        animateLine(dashLine);
    });
}

export {
  lerp,
  interpolateSegment,
  createFlowDot,
  animateDot,
  animateFlow,
  animateDash,
  animateBladeDashes,
  animateLine
};
