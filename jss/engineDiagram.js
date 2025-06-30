const svg = d3.select("#engine-diagram")
  .attr("width", 460)
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

// Draw the fan 
n1Group.append("line")
  .attr("x1", 80)   
  .attr("y1", centerY)
  .attr("x2", 95)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 175);

// Draw the n1 shaft
n1Group.append("line")
  .attr("x1", 180)   
  .attr("y1", centerY)
  .attr("x2", 350)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

  // Draw the LPT center
n1Group.append("line")
  .attr("x1", 350)   
  .attr("y1", centerY)
  .attr("x2", 380)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 30);

// Draw the LPT blade 1
n1Group.append("line")
  .attr("x1", 350)   
  .attr("y1", centerY)
  .attr("x2", 358)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 80);

// Draw the LPT blade 2
n1Group.append("line")
  .attr("x1", 361)   
  .attr("y1", centerY)
  .attr("x2", 369)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 80);

// Draw the LPT blade 3
n1Group.append("line")
  .attr("x1", 372)   
  .attr("y1", centerY)
  .attr("x2", 380)  
  .attr("y2", centerY)
  .attr("stroke", "#444")
  .attr("stroke-width", 80);

//draw the exhaust nozzle
n1Group.append("path")
  .attr("d", "M 378,185 L 450,200 L 380,215 Z")
  .attr("fill", "#444")        // fill the enclosed area
  .attr("stroke", "none")      // optional stroke for visibility
  .attr("stroke-width", 2);

// Function to create blade paths given centerX and sizes
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

  // Append paths for this blade
  n1Group.append("path")
    .attr("d", topTrap)
    .attr("fill", "#444")
    .attr("stroke", "none");

  n1Group.append("path")
    .attr("d", rect)
    .attr("fill", "#444")
    .attr("stroke", "none");

  n1Group.append("path")
    .attr("d", bottomTrap)
    .attr("fill", "#444")
    .attr("stroke", "none");
}

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

const n2Group = engineGroup.append("g").attr("id", "n2-group");

// Draw top of HPC body
n2Group.append("path")
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
n2Group.append("path")
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
n2Group.append("line")
  .attr("x1", 188)   
  .attr("y1", centerY - 17)
  .attr("x2", 195)  
  .attr("y2", centerY - 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw top of HPC blade 2
n2Group.append("line")
  .attr("x1", 200)   
  .attr("y1", centerY - 17)
  .attr("x2", 205)  
  .attr("y2", centerY - 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw top of HPC blade 3
n2Group.append("line")
  .attr("x1", 210)   
  .attr("y1", centerY - 19)
  .attr("x2", 215)  
  .attr("y2", centerY - 19)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw top of HPC blade 4
n2Group.append("line")
  .attr("x1", 220)   
  .attr("y1", centerY - 19)
  .attr("x2", 225)  
  .attr("y2", centerY - 19)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw top of HPC blade 5
n2Group.append("line")
  .attr("x1", 230)   
  .attr("y1", centerY - 17)
  .attr("x2", 235)  
  .attr("y2", centerY - 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

  // Draw bottom of HPC blade 1
n2Group.append("line")
  .attr("x1", 188)   
  .attr("y1", centerY + 17)
  .attr("x2", 195)  
  .attr("y2", centerY + 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw bottom of HPC blade 2
n2Group.append("line")
  .attr("x1", 200)   
  .attr("y1", centerY + 17)
  .attr("x2", 205)  
  .attr("y2", centerY + 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw bottom of HPC blade 3
n2Group.append("line")
  .attr("x1", 210)   
  .attr("y1", centerY + 19)
  .attr("x2", 215)  
  .attr("y2", centerY + 19)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw bottom of HPC blade 4
n2Group.append("line")
  .attr("x1", 220)   
  .attr("y1", centerY + 19)
  .attr("x2", 225)  
  .attr("y2", centerY + 19)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

// Draw bottom of HPC blade 5
n2Group.append("line")
  .attr("x1", 230)   
  .attr("y1", centerY + 17)
  .attr("x2", 235)  
  .attr("y2", centerY + 17)
  .attr("stroke", "#444")
  .attr("stroke-width", 22);

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

// Draw top of HPT blade
n2Group.append("line")
  .attr("x1", 332)   
  .attr("y1", centerY - 25)
  .attr("x2", 342)  
  .attr("y2", centerY - 25)
  .attr("stroke", "#444")
  .attr("stroke-width", 30);
  
// Draw bottom of HPT blade
n2Group.append("line")
  .attr("x1", 332)   
  .attr("y1", centerY + 25)
  .attr("x2", 342)  
  .attr("y2", centerY + 25)
  .attr("stroke", "#444")
  .attr("stroke-width", 30);

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

// Throttle input listener
function updateThrottleVisualization(val) {
  if (val > 0) {
    bypassPathTop1?.attr("opacity", Math.min(1, val / 50));
    bypassPathTop2?.attr("opacity", Math.min(1, val / 50));
    bypassPathBottom1?.attr("opacity", Math.min(1, val / 50));
    bypassPathBottom2?.attr("opacity", Math.min(1, val / 50));
    corePathTop?.attr("opacity", Math.min(1, (val - 30) / 50));
    corePathBottom?.attr("opacity", Math.min(1, (val - 30) / 50));
  } else {
    bypassPathTop1?.attr("opacity", 0);
    bypassPathTop2?.attr("opacity", 0);
    bypassPathBottom1?.attr("opacity", 0);
    bypassPathBottom2?.attr("opacity", 0);
    corePathTop?.attr("opacity", 0);
    corePathBottom?.attr("opacity", 0);
  }
}

animateFlow(bypassPathTop1);
animateFlow(bypassPathTop2);
animateFlow(bypassPathBottom1);
animateFlow(bypassPathBottom2);
animateFlow(corePathTop);
animateFlow(corePathBottom);