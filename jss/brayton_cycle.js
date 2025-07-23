const width = 500, height = 400, margin = 75, ambientP = 14.7;

console.log("Script loaded!");

import {
  estimateTout,
  estimateEtaComp,
  estimateEtaTurb,
  calcVolume
} from './brayton_calcs.js';

//function to create exponential paths for P-v and T-s diagrams
function expPath(p0, p1, num = 30) {
  let points = [];
  let b = Math.pow(p1.P / p0.P, 1 / (num - 1));
  for (let i = 0; i < num; i++) {
    let t = i / (num - 1);
    points.push({
      V: p0.V + t * (p1.V - p0.V),
      P: p0.P * Math.pow(b, i),
      T: p0.T + t * (p1.T - p0.T),
      s: p0.s
    });
  }
  return points;
}

//possibly redundant function? need to look.
function expPathTS(p0, p1, num = 30) {
  let points = [];
  let b = Math.pow(p1.T / p0.T, 1 / (num - 1));
  for (let i = 0; i < num; i++) {
    let t = i / (num - 1);
    points.push({
      V: p0.V + t * (p1.V - p0.V),
      P: p0.P + t * (p1.P - p0.P),
      T: p0.T * Math.pow(b, i),
      s: p0.s + t * (p1.s - p0.s)
    });
  }
  return points;
}

//function to connect all the pathes together in the P-v and T-s diagrams
function buildPath(d) {
  const t2 = +d.t2, p2 = +d.p2, t30 = +d.t30, p30 = +d.p30;
  const t50 = +d.t50, epr = +d.epr, ps30 = +d.ps30, phi = +d.phi, farB = +d.farB;
  const combustorTout = estimateTout(ps30 * phi, farB, t30);

  const pt1 = { V: calcVolume(t2, p2), P: p2, T: t2, s: 1 };
  const pt2 = { V: calcVolume(t30, p30), P: p30, T: t30, s: 1 };
  const pt3 = { V: calcVolume(combustorTout, p30), P: p30, T: combustorTout, s: 2 };
  const pt4 = { V: calcVolume(t50, p2 * epr), P: p2 * epr, T: t50, s: 2 };
  const pt5 = { V: calcVolume(t50, ambientP), P: ambientP, T: t50, s: 2 };

  return [].concat(
    expPath(pt1, pt2),
    [pt2],
    expPathTS(pt2, pt3),
    [pt3],
    expPath(pt3, pt4),
    [pt4],
    expPath(pt4, pt5),
    [pt5],
    expPathTS(pt5, pt1)
  );
}

//load the brayton_cycle.csv and begin calculations. Do we need to incorporate async / await protocol?
d3.csv("brayton_cycle.csv").then(function(data) {
  console.log("Data loaded!");
    let cycles_all = [], V_all = [], P_all = [], T_all = [], etaComp_all = [], etaTurb_all = [];//initialize arrays for cycles, V, P, T, and eta

  data.forEach(d => { //perform calculations for each row
    const cycles = +d.cycles;
    const t2 = +d.t2, p2 = +d.p2, t30 = +d.t30, p30 = +d.p30;
    const t50 = +d.t50, epr = +d.epr, ps30 = +d.ps30, phi = +d.phi, farB = +d.farB;
    const fuelFlow = ps30 * phi;
    const combustorTout = estimateTout(fuelFlow, farB, t30);
    const etaComp = estimateEtaComp(p2, t2, p30, t30);
    const etaTurb = estimateEtaTurb(p30,combustorTout,p2*epr,t50);

    cycles_all.push(cycles);
    V_all.push(calcVolume(t2, p2), calcVolume(t30, p30), calcVolume(combustorTout, p30), calcVolume(t50, ambientP));
    P_all.push(p2, p30, ambientP, p2 * epr);
    T_all.push(t2, t30, combustorTout, t50);
    etaComp_all.push(etaComp);
    etaTurb_all.push(etaTurb);
  });

  //set x and y scales for P-v diagram
  const xPV = d3.scaleLinear().domain(d3.extent(V_all)).range([margin, width - margin]);
  const yPV = d3.scaleLinear().domain([10,560]).range([height - margin, margin]);

  //set x and y scales for T-s diagram
  const xTS = d3.scaleLinear().domain([0.9, 2.1]).range([margin, width - margin]);
  const yTS = d3.scaleLinear().domain([450,3200]).range([height - margin, margin]);

  //set x and y scales for etaComp diagram
  const xEC = d3.scaleLinear().domain(d3.extent(cycles_all)).range([margin, width - margin]);
  const yEC = d3.scaleLinear().domain(d3.extent(etaComp_all)).range([height - margin, margin]); 
  
  //set x and y scales for etaTurb diagram
  const xET = d3.scaleLinear().domain(d3.extent(cycles_all)).range([margin, width - margin]);
  const yET = d3.scaleLinear().domain(d3.extent(etaTurb_all)).range([height - margin, margin]);

  //save the selection function for the charts in a variable for brevity in following code
  const svgPV = d3.select("#pvChart");
  const svgTS = d3.select("#tsChart");
  const svgEC = d3.select("#ecChart");
  const svgET = d3.select("#etChart");

  console.log("yPV domain:", yPV.domain());
  console.log("yTS domain:", yTS.domain());

  //append axes to P-v plot
  svgPV.append("g").attr("transform", `translate(0,${height - margin})`).call(d3.axisBottom(xPV).ticks(0,"~s"));
  svgPV.append("g").attr("transform", `translate(${margin},0)`).call(d3.axisLeft(yPV).ticks(4, "~s"));

  // P-v Title
  svgPV.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Pressure vs. Volume")
    .style("font-size","20px");

  // P-v X Axis Label
  svgPV.append("text")
    .attr("x", width / 2)
    .attr("y", height - 50)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Volume")
    .style("font-size","14px");

  // P-v Y Axis Label
  svgPV.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Pressure (psi)")
    .style("font-size","14px"); 

  //append axes to T-s plot
  svgTS.append("g").attr("transform", `translate(0,${height - margin})`).call(d3.axisBottom(xTS).ticks(0, "~s"));
  svgTS.append("g").attr("transform", `translate(${margin},0)`).call(d3.axisLeft(yTS).ticks(5, "~s"));

  // T-s Title
  svgTS.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Temperature vs. Entropy")
    .style("font-size","20px");

  // T-s X Axis Label
  svgTS.append("text")
    .attr("x", width / 2)
    .attr("y", height - 50)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Entropy")
    .style("font-size","14px");

  // T-s Y Axis Label
  svgTS.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Temperature (Rankine)")
    .style("font-size","14px"); 

  //append axes to etaComp plot
  svgEC.append("g").attr("transform", `translate(0,${height - margin})`).call(d3.axisBottom(xEC));
  svgEC.append("g").attr("transform", `translate(${margin},0)`).call(d3.axisLeft(yEC));

  // EC Title
  svgEC.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Compressor Efficiency vs. Flight Cycles")
    .style("font-size","20px");

  // EC X Axis Label
  svgEC.append("text")
    .attr("x", width / 2)
    .attr("y", height - 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Flight Cycles")
    .style("font-size","14px");

  // EC Y Axis Label
  svgEC.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Efficiency")
    .style("font-size","14px"); 

  // EC "Click Simulation" prompt
  const promptEC = svgEC.append("g").append("text")
    .attr("x", width / 2)
    .attr("y", height /2)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Click 'Run Simulation' to run engine to failure")
    .style("font-size","14px");

  //append axes to etaComp plot
  svgET.append("g").attr("transform", `translate(0,${height - margin})`).call(d3.axisBottom(xET));
  svgET.append("g").attr("transform", `translate(${margin},0)`).call(d3.axisLeft(yET));

  // ET Title
  svgET.append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Turbine Efficiency vs. Flight Cycles")
    .style("font-size","20px");

  // ET X Axis Label
  svgET.append("text")
    .attr("x", width / 2)
    .attr("y", height - 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Flight Cycles")
    .style("font-size","14px");

  // ET Y Axis Label
  svgET.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Efficiency")
    .style("font-size","14px");

  // ET "Click Simulation" prompt
  const promptET = svgET.append("g").append("text")
    .attr("x", width / 2)
    .attr("y", height /2)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Click 'Run Simulation' to run engine to failure")
    .style("font-size","14px");

  //initialize annimated points and cycle counter text
  const animPtPV = svgPV.append("circle").attr("r", 5).attr("class", "animated");
  const animPtTS = svgTS.append("circle").attr("r", 5).attr("class", "animated");
  const animPtEC = svgEC.append("circle").attr("r", 5).attr("class", "animated").attr("opacity", 0);
  const animPtET = svgET.append("circle").attr("r", 5).attr("class", "animated").attr("opacity", 0);
  const counterText = d3.select("#controls").append("text").attr("class", "counter").attr("x", width - margin - 50).attr("y", margin).text("Cycle: 1");

  //initialize variables for lines
  const linePV = d3.line().x(d => xPV(d.V)).y(d => yPV(d.P));
  const lineTS = d3.line().x(d => xTS(d.s)).y(d => yTS(d.T));
  const lineEC = d3.line().x(d => xEC(d.cycles)).y(d => yEC(d.etaComp));
  const lineET = d3.line().x(d => xET(d.cycles)).y(d => yET(d.etaTurb));

  let rowIndex = 0, pathPoints = [], etaCompTracePoints = [], etaTurbTracePoints = [], pointIndex = 0, isPaused = false, speedupFactor = 1;

  document.getElementById("pauseBtn").onclick = function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Play" : "Pause";
  };

  document.getElementById("speedSlider").oninput = function() {
    speedupFactor = +this.value;
  };

  function buildPath(d) {
    const t2 = +d.t2, p2 = +d.p2, t30 = +d.t30, p30 = +d.p30;
    const t50 = +d.t50, epr = +d.epr, ps30 = +d.ps30, phi = +d.phi, farB = +d.farB;
    const combustorTout = estimateTout(ps30 * phi, farB, t30);

    const pt1 = { V: calcVolume(t2, p2), P: p2, T: t2, s: 1 };
    const pt2 = { V: calcVolume(t30, p30), P: p30, T: t30, s: 1 };
    const pt3 = { V: calcVolume(combustorTout, ps30), P: p30, T: combustorTout, s: 2 };
    const pt4 = { V: calcVolume(t50, p2 * epr), P: p2 * epr, T: t50, s: 2 };
    const pt5 = { V: calcVolume(t50, p2), P: p2, T: t50, s: 2 };

    return [].concat(
      expPath(pt1, pt2), // Inlet-HPC exp Pv
      [pt2],
      expPathTS(pt2, pt3), // HPC-Comb exp Ts
      [pt3],
      expPath(pt3, pt5), // Comb-LPT exp Pv
      [pt5],
      //expPath(pt4, pt5), // LPT-Noz exp Pv
      //[pt5],
      expPathTS(pt5, pt1) // Noz-In exp Ts
    );
  }

  pathPoints = buildPath(data[rowIndex]);

  // Add silhouette paths from first row
  svgPV.append("path")
  .datum(pathPoints)
  .attr("class", "line")
  .attr("d", linePV)
  .attr("stroke", "gray")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .attr("opacity", 0.3);

  svgTS.append("path")
  .datum(pathPoints)
  .attr("class", "line")
  .attr("d", lineTS)
  .attr("stroke", "gray")
  .attr("stroke-width", 2)
  .attr("fill", "none")
  .attr("opacity", 0.3);

  let isRunning = false; // Controlled by the "Run" button

  document.getElementById("runBtn").onclick = function () {
    isRunning = true;
    rowIndex = 1; // Start simulation at second row
    pointIndex = 0;
    speedupFactor = 10;
    counterText.text(`Cycle: ${rowIndex + 1}`);
    animPtEC.attr("opacity", 1);
    animPtET.attr("opacity", 1);
    promptEC.attr("opacity", 0);
    promptET.attr("opacity", 0);
    pathPoints = buildPath(data[rowIndex]);
};

  function animate() {
    if (!isPaused) {
      for (let s = 0; s < speedupFactor; s++) {
        if (pointIndex >= pathPoints.length) {
          if (!isRunning) {
            
            pointIndex = 0;
          } else {
            rowIndex++;
            if (rowIndex >= data.length) return;

            pathPoints = buildPath(data[rowIndex]);
            pointIndex = 0;
            counterText.text(`Cycle: ${rowIndex + 1}`);

            etaCompTracePoints.push({
              cycles: +data[rowIndex - 1].cycles,
              etaComp: estimateEtaComp(+data[rowIndex - 1].p2, +data[rowIndex - 1].t2, +data[rowIndex - 1].p30, +data[rowIndex - 1].t30)
            });

            etaTurbTracePoints.push({
              cycles: +data[rowIndex - 1].cycles,
              etaTurb: estimateEtaTurb(
                +data[rowIndex - 1].p30,
                +T_all[(rowIndex - 1) * 4 + 2],
                +data[rowIndex - 1].p2 * +data[rowIndex - 1].epr,
                +data[rowIndex - 1].t50
              )
            });
          }
        }

        const subPoints = pathPoints.slice(0, pointIndex + 1);
        svgPV.selectAll(".trace").remove();
        svgPV.append("path").datum(subPoints).attr("class", "trace").attr("d", linePV)
          .attr("stroke", "red").attr("fill", "none").attr("stroke-width", 1).attr("opacity", 0.7);

        svgTS.selectAll(".trace").remove();
        svgTS.append("path").datum(subPoints).attr("class", "trace").attr("d", lineTS)
          .attr("stroke", "red").attr("fill", "none").attr("stroke-width", 1).attr("opacity", 0.7);

        if (isRunning) {
          svgEC.selectAll(".trace").remove();
          svgEC.append("path")
            .datum(etaCompTracePoints)
            .attr("class", "trace")
            .attr("d", lineEC)
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("opacity", 0.7);

          svgET.selectAll(".trace").remove();
          svgET.append("path")
            .datum(etaTurbTracePoints)
            .attr("class", "trace")
            .attr("d", lineET)
            .attr("stroke", "blue")
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("opacity", 0.7);
        }

        // Update animated points
        const pt = pathPoints[pointIndex];
        animPtPV.attr("cx", xPV(pt.V)).attr("cy", yPV(pt.P));
        animPtTS.attr("cx", xTS(pt.s)).attr("cy", yTS(pt.T));

        if (isRunning && etaCompTracePoints.length > 0) {
          const etaCompLastPt = etaCompTracePoints[etaCompTracePoints.length - 1];
          animPtEC.attr("cx", xEC(etaCompLastPt.cycles)).attr("cy", yEC(etaCompLastPt.etaComp));
          const etaTurbLastPt = etaTurbTracePoints[etaTurbTracePoints.length - 1];
          animPtET.attr("cx", xET(etaTurbLastPt.cycles)).attr("cy", yET(etaTurbLastPt.etaTurb));
        }

        pointIndex++;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});