const svg = d3.select("#engine-diagram")
  .attr("width", 500)
  .attr("height", 400);

const centerY = 200;

const engineGroup = svg.append("g")
  .attr("transform", "translate(50, 0)");

const nacelleGroup = engineGroup.append("g").attr("id", "nacelle-group");

// Top nacelle contour (simplified for cross-section profile)
nacelleGroup.append("path")
  .attr("d", `
    M40,${centerY - 90}                    
    L175,${centerY - 90} 
    Q250,${centerY - 105}  300,${centerY - 95}                 
    Q250,${centerY - 110}  200,${centerY - 110}
    L40,${centerY - 110}
    Q25,${centerY - 98} 40,${centerY - 90}                  
    Z
  `)
  .attr("fill", "#888")
  .attr("stroke", "none");

// Bottom nacelle contour (mirror of top)
nacelleGroup.append("path")
  .attr("d", `
    M40,${centerY + 90}                    
    L175,${centerY + 90} 
    Q250,${centerY + 105}  300,${centerY + 95}                 
    Q250,${centerY + 110}  200,${centerY + 110} 
    L40,${centerY + 110}
    Q25,${centerY + 98} 40,${centerY + 90}                    
    Z
  `)
  .attr("fill", "#888")
  .attr("stroke", "none");

const coreGroup = engineGroup.append("g").attr("id", "core-group");

// Top engine core contour (simplified for cross-section profile)
coreGroup.append("path")
  .attr("d", `
    M100,${centerY - 46}                    
    L200,${centerY - 32} 
    L240,${centerY - 32}               
    Q260,${centerY - 45}  300,${centerY - 45}
    L420,${centerY - 40}
    L255,${centerY - 68}
    Q250,${centerY - 69} 245,${centerY - 68}              
    Z
  `)
  .attr("fill", "#888")
  .attr("stroke", "none");

  // Bottom engine core contour (simplified for cross-section profile)
coreGroup.append("path")
  .attr("d", `
    M100,${centerY + 46}                    
    L200,${centerY + 32} 
    L240,${centerY + 32}               
    Q260,${centerY + 45}  300,${centerY + 45}
    L420,${centerY + 40}
    L255,${centerY + 68}
    Q250,${centerY + 69} 245,${centerY + 68}              
    Z
  `)
  .attr("fill", "#888")
  .attr("stroke", "none");      

const n1Group = engineGroup.append("g").attr("id", "n1-group");

// Draw the LPC center (a horizontal line)
n1Group.append("line")
  .attr("x1", 75)   // Starting after inlet
  .attr("y1", centerY)
  .attr("x2", 180)  // Through fan, LPC
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 30);

// Draw nose cone
n1Group.append("path")
  .attr("d", `
    M60,${centerY} 
    Q80,${centerY - 30} 80,${centerY}
    Q80,${centerY + 30} 60,${centerY}
    Z
  `)
  .attr("fill", "#444")
  .attr("stroke", "none")
  .attr("stroke-width", 1);

// Draw the n1 shaft
n1Group.append("line")
  .attr("x1", 180)   
  .attr("y1", centerY)
  .attr("x2", 350)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

const fanGroup = n1Group.append("g").attr("id", "n1-group");
  
// Draw the fan 
fanGroup.append("line")
  .attr("x1", 87)   
  .attr("y1", centerY - 175/2)
  .attr("x2", 87)  
  .attr("y2", centerY + 175/2)
  .attr("stroke", "#444")
  .attr("stroke-width", 15);

const lptGroup = engineGroup.append("g").attr("id", "lpt-group");

  // Draw the LPT center
n1Group.append("line")
  .attr("x1", 350)   
  .attr("y1", centerY)
  .attr("x2", 380)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 30);

// Draw the LPT blade 1
lptGroup.append("line")
  .attr("x1", 354)   
  .attr("y1", centerY - 40)
  .attr("x2", 354)  
  .attr("y2", centerY + 40)
  .attr("stroke", "#444")
  .attr("stroke-width", 8);

// Draw the LPT blade 2
lptGroup.append("line")
  .attr("x1", 365)   
  .attr("y1", centerY - 40)
  .attr("x2", 365)  
  .attr("y2", centerY + 40)
  .attr("stroke", "#444")
  .attr("stroke-width", 8);

// Draw the LPT blade 3
lptGroup.append("line")
  .attr("x1", 376)   
  .attr("y1", centerY - 40)
  .attr("x2", 376)  
  .attr("y2", centerY + 40)
  .attr("stroke", "#444")
  .attr("stroke-width", 8);

//draw the exhaust nozzle
n1Group.append("path")
  .attr("d", "M 378,185 L 450,200 L 380,215 Z")
  .attr("fill", "#444")        // fill the enclosed area
  .attr("stroke", "none")      // optional stroke for visibility
  .attr("stroke-width", 2);

// Create a group for LPC blades for rotation animation
const lpcBladesGroup = n1Group.append("g").attr("id", "lpc-blades-group");

// Original blade start parameters
const startX = 105;
const endX = 180;
const bladeCount = 7; // original + 6 more

// Starting LPC sizes
const startRectWidth = 12;
const startRectHeight = 30;
const startTrapTopWidth = 8;
const startTrapHeight = 28;

// Ending LPC sizes (skinnier, shorter)
const endRectWidth = 8;
const endRectHeight = 30;
const endTrapTopWidth = 6;
const endTrapHeight = 14;

// Adjust createBlade to append blades to lpcBladesGroup instead of n1Group
function createBlade(centerX, rectWidth, rectHeight, trapTopWidth, trapHeight) {
  const trapBottomWidth = rectWidth;

  const topTrap = `
    M ${centerX - trapTopWidth / 2},${centerY - rectHeight / 2 - trapHeight}
    L ${centerX + trapTopWidth / 2},${centerY - rectHeight / 2 - trapHeight}
    L ${centerX + trapBottomWidth / 2},${centerY - rectHeight / 2}
    L ${centerX - trapBottomWidth / 2},${centerY - rectHeight / 2}
    Z
  `;

  const rect = `
    M ${centerX - rectWidth / 2},${centerY - rectHeight / 2}
    L ${centerX + rectWidth / 2},${centerY - rectHeight / 2}
    L ${centerX + rectWidth / 2},${centerY + rectHeight / 2}
    L ${centerX - rectWidth / 2},${centerY + rectHeight / 2}
    Z
  `;

  const bottomTrap = `
    M ${centerX - trapBottomWidth / 2},${centerY + rectHeight / 2}
    L ${centerX + trapBottomWidth / 2},${centerY + rectHeight / 2}
    L ${centerX + trapTopWidth / 2},${centerY + rectHeight / 2 + trapHeight}
    L ${centerX - trapTopWidth / 2},${centerY + rectHeight / 2 + trapHeight}
    Z
  `;

  // Draw blade parts
  lpcBladesGroup.append("path")
    .attr("d", topTrap)
    .attr("fill", "#444")
    .attr("stroke", "none");

  lpcBladesGroup.append("path")
    .attr("d", rect)
    .attr("fill", "#444")
    .attr("stroke", "none");

  lpcBladesGroup.append("path")
    .attr("d", bottomTrap)
    .attr("fill", "#444")
    .attr("stroke", "none");

  // Create a centerline path along blade length for sliding lines animation
  // Here, a simple vertical line centered at centerX, from top to bottom of blade
  const centerlinePath = `M${centerX},${centerY - rectHeight / 2 - trapHeight} L${centerX},${centerY + rectHeight / 2 + trapHeight}`;
  
  return centerlinePath;
}

// For each LPC blade, interpolate position and sizes
for(let i = 0; i < bladeCount; i++) {
  // Linear interpolation helper
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }
  
  let t = i / (bladeCount - 1);  // 0 to 1
  
  const cx = lerp(startX, endX, t);
  const rw = lerp(startRectWidth, endRectWidth, t);
  const rh = lerp(startRectHeight, endRectHeight, t);
  const ttW = lerp(startTrapTopWidth, endTrapTopWidth, t);
  const th = lerp(startTrapHeight, endTrapHeight, t);
  
  createBlade(cx, rw, rh, ttW, th);
}

const hpcGroup = engineGroup.append("g").attr("id", "hpc-group");

// Draw top of HPC body
hpcGroup.append("path")
  .attr("d", `
    M188,${centerY - 5}
    L188,${centerY - 15}
    C223,${centerY - 30} 245,${centerY - 20} 242,${centerY - 5}
    Z
  `)
  .attr("fill", "#444")
  .attr("stroke", "none")
  .attr("stroke-width", 5);

// Draw bottom of HPC body
hpcGroup.append("path")
  .attr("d", `
    M188,${centerY + 5}
    L188,${centerY + 15}
    C223,${centerY + 30} 245,${centerY + 20} 242,${centerY + 5}
    Z
  `)
  .attr("fill", "#444")
  .attr("stroke", "none")
  .attr("stroke-width", 5);

// Draw top of HPC blade 1
hpcGroup.append("line")
  .attr("x1", 191)   
  .attr("y1", centerY - 5)
  .attr("x2", 191)  
  .attr("y2", centerY - 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 7);

// Draw top of HPC blade 2
hpcGroup.append("line")
  .attr("x1", 202)   
  .attr("y1", centerY - 5)
  .attr("x2", 202)  
  .attr("y2", centerY - 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 3
hpcGroup.append("line")
  .attr("x1", 212)   
  .attr("y1", centerY - 5)
  .attr("x2", 212)  
  .attr("y2", centerY - 30)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 4
hpcGroup.append("line")
  .attr("x1", 222)   
  .attr("y1", centerY - 5)
  .attr("x2", 222)  
  .attr("y2", centerY - 30)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 5
hpcGroup.append("line")
  .attr("x1", 232)   
  .attr("y1", centerY - 5)
  .attr("x2", 232)  
  .attr("y2", centerY - 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 1
hpcGroup.append("line")
  .attr("x1", 191)   
  .attr("y1", centerY + 28)
  .attr("x2", 191)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 7);

// Draw bottom of HPC blade 2
hpcGroup.append("line")
  .attr("x1", 202)   
  .attr("y1", centerY + 28)
  .attr("x2", 202)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 3
hpcGroup.append("line")
  .attr("x1", 212)   
  .attr("y1", centerY + 30)
  .attr("x2", 212)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 4
hpcGroup.append("line")
  .attr("x1", 222)   
  .attr("y1", centerY + 30)
  .attr("x2", 222)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 5
hpcGroup.append("line")
  .attr("x1", 232)   
  .attr("y1", centerY + 28)
  .attr("x2", 232)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

const n2Group = engineGroup.append("g").attr("id", "n2-group");

// Draw top of n2 shaft
n2Group.append("line")
  .attr("x1", 240)   
  .attr("y1", centerY - 8)
  .attr("x2", 342)  
  .attr("y2", centerY - 8)
  .attr("stroke", "#444")
  .attr("stroke-width", 6);

// Draw bottom of n2 shaft
n2Group.append("line")
  .attr("x1", 240)   
  .attr("y1", centerY + 8)
  .attr("x2", 342)  
  .attr("y2", centerY + 8)
  .attr("stroke", "#444")
  .attr("stroke-width", 6);

const hptGroup = engineGroup.append("g").attr("id", "hpt-group");

// Draw top of HPT blade
hptGroup.append("line")
  .attr("x1", 337)   
  .attr("y1", centerY - 5)
  .attr("x2", 337)  
  .attr("y2", centerY - 40)
  .attr("stroke", "#444")
  .attr("stroke-width", 10);
  
// Draw bottom of HPT blade
hptGroup.append("line")
  .attr("x1", 337)   
  .attr("y1", centerY + 40)
  .attr("x2", 337)  
  .attr("y2", centerY + 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 10);

// Draw combustor section
engineGroup.append("ellipse")
  .attr("cx", 290)           // horizontal center of combustor section
  .attr("cy", centerY - 28)  // above center line
  .attr("rx", 35)            // horizontal radius
  .attr("ry", 15)            // vertical radius
  .attr("fill", "red")
  .attr("opacity", 0.7);

engineGroup.append("ellipse")
  .attr("cx", 290)           // horizontal center of combustor section
  .attr("cy", centerY + 28)  // below center line
  .attr("rx", 35)
  .attr("ry", 15)
  .attr("fill", "red")
  .attr("opacity", 0.7);

//define a tooltip group
const tooltip = d3.select("#engine-tooltip");

const regions = [
  { name: "Fan",                         x: 75,  width: 25 },
  { name: "Low Pressure Compressor",     x: 105, width: 75 },
  { name: "High Pressure Compressor",    x: 185, width: 55 },
  { name: "Combustor",                   x: 255, width: 70 },
  { name: "High Pressure Turbine",       x: 330, width: 15 },
  { name: "Low Pressure Turbine",        x: 350, width: 30 },
  { name: "Exhaust Nozzle",              x: 380, width: 70 }
];

// Create a group to hold interaction hitboxes
const interactionGroup = engineGroup.append("g").attr("id", "interaction-layer");

regions.forEach(region => {
  interactionGroup.append("rect")
    .datum(region) // Bind region data
    .attr("x", region.x)
    .attr("y", centerY - 100)
    .attr("width", region.width)
    .attr("height", 200)
    .attr("fill", "transparent")
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .style("opacity", 1)
        .html(`<strong>${d.name} Section</strong>`);
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip
        .style("display", "none")
        .style("opacity", 0);
    });
});

// Airflow groups
const airflowGroup = engineGroup.append("g").attr("id", "airflow-group");

const bypassPathTop1 = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 70} C200,${centerY - 90} 250,${centerY - 90} 300,${centerY - 80}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

const bypassPathTop2 = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 60} C200,${centerY - 80} 250,${centerY - 80} 300,${centerY - 70}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

const bypassPathBottom1 = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 70} C200,${centerY + 90} 250,${centerY + 90} 300,${centerY + 80}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

const bypassPathBottom2 = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 60} C200,${centerY + 80} 250,${centerY + 80} 300,${centerY + 70}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);


const corePathTop = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 40} C220,${centerY - 15} 250,${centerY - 28} 300,${centerY - 30} L425,${centerY - 30}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 3)
  .attr("stroke-dasharray", "4,4")
  .attr("opacity", 0);

const corePathBottom = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 40} C220,${centerY + 15} 250,${centerY + 28} 300,${centerY + 30} L425,${centerY + 30}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 3)
  .attr("stroke-dasharray", "4,4")
  .attr("opacity", 0);

// Animate the dash offset
function animateFlow(path) {
  path.transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attrTween("stroke-dashoffset", () => d3.interpolate(10, 0))
    .on("end", () => animateFlow(path));
}

const width = 120;
const height = 200;

const throttle = d3.select("#throttle-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Background track
throttle.append("rect")
  .attr("x", width / 2 - 30)
  .attr("y", 20)
  .attr("width", 60)
  .attr("height", height - 40)
  .attr("fill", "#333")
  .attr("rx", 8);

// center of background track
throttle.append("line")
  .attr("x1", width / 2)   
  .attr("y1", 20)
  .attr("x2", width / 2)  
  .attr("y2", height - 20)
  .attr("stroke", "#444")
  .attr("stroke-width", 2);

// Left throttle knob
const leftKnob = throttle.append("rect")
  .attr("x", width / 2 - 31)
  .attr("y", height - 60)
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "#bbb")
  .attr("stroke", "#666")
  .attr("cursor", "grab")
  .attr("rx", 3);

// Right throttle knob
const rightKnob = throttle.append("rect")
  .attr("x", width / 2 + 1)
  .attr("y", height - 60)
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "#bbb")
  .attr("stroke", "#666")
  .attr("cursor", "grab")
  .attr("rx", 3);

// Label
const valueText = throttle.append("text")
  .attr("x", width / 2)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .attr("fill", "#000")
  .attr("font-size", "14px")
  .text("Throttle: 0%");

// Shared drag behavior (coupled)
const drag = d3.drag()
  .on("drag", function (event) {
    let newY = Math.min(Math.max(event.y, 20), height - 40);

    // Move both knobs together
    leftKnob.attr("y", newY);
    rightKnob.attr("y", newY);

    const percent = Math.round(100 * (1 - (newY - 20) / (height - 60)));
    valueText.text(`Throttle: ${percent}%`);

    updateThrottleVisualization(percent);
  });

leftKnob.call(drag);
rightKnob.call(drag);

function updateThrottleVisualization(val) {
  const flowOpacity = Math.min(1, val / 50);
  const coreOpacity = Math.min(1, (val - 30) / 50);

  if (val > 0) {
    bypassPathTop1?.attr("opacity", flowOpacity);
    bypassPathTop2?.attr("opacity", flowOpacity);
    bypassPathBottom1?.attr("opacity", flowOpacity);
    bypassPathBottom2?.attr("opacity", flowOpacity);
    corePathTop?.attr("opacity", coreOpacity);
    corePathBottom?.attr("opacity", coreOpacity);
  } else {
    bypassPathTop1?.attr("opacity", 0);
    bypassPathTop2?.attr("opacity", 0);
    bypassPathBottom1?.attr("opacity", 0);
    bypassPathBottom2?.attr("opacity", 0);
    corePathTop?.attr("opacity", 0);
    corePathBottom?.attr("opacity", 0);
  }

  //Sliding lines fade in/out with flow
  slidingLineElements.forEach(path =>
    path.attr("opacity", flowOpacity)
  );

  dashOverlayElements.forEach(path =>
    path.attr("opacity", flowOpacity)
  );
}


animateFlow(bypassPathTop1);
animateFlow(bypassPathTop2);
animateFlow(bypassPathBottom1);
animateFlow(bypassPathBottom2);
animateFlow(corePathTop);
animateFlow(corePathBottom);

// Store all centerline paths for sliding lines
const slidingLinesPaths = [];

for(let i = 0; i < bladeCount; i++) {
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }
  
  let t = i / (bladeCount - 1);
  
  const cx = lerp(startX, endX, t);
  const rw = lerp(startRectWidth, endRectWidth, t);
  const rh = lerp(startRectHeight, endRectHeight, t);
  const ttW = lerp(startTrapTopWidth, endTrapTopWidth, t);
  const th = lerp(startTrapHeight, endTrapHeight, t);
  
  const centerline = createBlade(cx, rw, rh, ttW, th);
  slidingLinesPaths.push(centerline);
}

// Create sliding lines group
const slidingLinesGroup = engineGroup.append("g").attr("id", "sliding-lines-group");

const slidingLineElements = []; // <--- New array to store actual SVG elements

slidingLinesPaths.forEach(pathD => {
  const path = slidingLinesGroup.append("path")
    .attr("d", pathD)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", "5 10")
    .attr("stroke-dashoffset", 0)
    .attr("opacity", 0); // Start hidden

  slidingLineElements.push(path); // <--- Store path element

  // Animate dash offset for sliding effect
  function animateDash() {
    path.transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attrTween("stroke-dashoffset", () => d3.interpolate(0, 15))
      .on("end", animateDash);
  }
  animateDash();
});

const dashOverlayElements = [];

function animateBladeDashes(group) {
  // Clear any existing overlay dashed lines to avoid duplicates
  group.selectAll(".dash-overlay").remove();

  // Append new dashed overlay lines on top of each existing line
  group.selectAll("line").each(function() {
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
      .attr("stroke-width", strokeWidth*0.7) // 70% of strokeWidth
      .attr("fill", "none")
      .attr("stroke-dasharray", "8 8")
      .attr("stroke-dashoffset", 0)
      .attr("opacity", 0); // start hidden

    dashOverlayElements.push(dashLine);

    // Animate stroke-dashoffset for sliding dash effect
    function animate() {
      dashLine.transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 16)
        .on("end", () => {
          dashLine.attr("stroke-dashoffset", 0);
          animate();
        });
    }
    animate();
  });
}

animateBladeDashes(fanGroup);
animateBladeDashes(hpcGroup);
animateBladeDashes(hptGroup);
animateBladeDashes(lptGroup);