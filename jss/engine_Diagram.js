//import functions from brayton_calcs.js
import {
  estimateTout
} from './brayton_calcs.js';

//import functions from engine_animation.js
import {
  lerp,
  createFlowDot,
  animateFlow,
  animateDash,
  animateBladeDashes
} from './engine_animation.js';

//store selected engine diagram in constant variable svg
const svg = d3.select("#engine-diagram")
  .attr("width", 500)
  .attr("height", 250);

//set horizontal centerline variable 
const centerY = 125;

//append engineGroup to the selected svg
const engineGroup = svg.append("g")
  .attr("transform", "translate(50, 0)");

//append nacelleGroup to engine group
const nacelleGroup = engineGroup.append("g").attr("id", "nacelle-group");

// Top nacelle contour path
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

// Top engine core contour
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

  // Bottom engine core contour (mirror of top)
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

//append n1Group to engineGroup
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

// append fanGroup to n1Group
const fanGroup = n1Group.append("g").attr("id", "n1-group");
  
// Draw the fan 
fanGroup.append("line")
  .attr("x1", 87)   
  .attr("y1", centerY - 175/2)
  .attr("x2", 87)  
  .attr("y2", centerY + 175/2)
  .attr("stroke", "#444")
  .attr("stroke-width", 15);

// append lptGroup to engineGroup
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
  .attr("d", "M 380,110 L 450,125 L 380,140 Z")
  .attr("fill", "#444")        
  .attr("stroke", "none")      
  .attr("stroke-width", 2);

// append LPC blades group to n1 group
const lpcBladesGroup = n1Group.append("g").attr("id", "lpc-blades-group");

// Original blade start parameters
const startX = 105;
const endX = 180;
const bladeCount = 7;

// Starting LPC sizes
const startRectWidth = 12;
const startRectHeight = 30;
const startTrapTopWidth = 8;
const startTrapHeight = 28;

// Ending LPC sizes
const endRectWidth = 8;
const endRectHeight = 30;
const endTrapTopWidth = 6;
const endTrapHeight = 14;

// For each LPC blade, interpolate position and sizes
for(let i = 0; i < bladeCount; i++) {
  
  let t = i / (bladeCount - 1);  // 0 to 1
  
  const cx = lerp(startX, endX, t);
  const rw = lerp(startRectWidth, endRectWidth, t);
  const rh = lerp(startRectHeight, endRectHeight, t);
  const ttW = lerp(startTrapTopWidth, endTrapTopWidth, t);
  const th = lerp(startTrapHeight, endTrapHeight, t);
  
  createBlade(cx, rw, rh, ttW, th);
}

// append blade paths to lpcBladesGroup 
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
  const centerlinePath = `M${centerX},${centerY - rectHeight / 2 - trapHeight} L${centerX},${centerY + rectHeight / 2 + trapHeight}`;
  
  return centerlinePath;
}

//append hpcGroup to engineGroup
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
  .attr("y1", centerY - 28)
  .attr("x2", 191)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 7);

// Draw top of HPC blade 2
hpcGroup.append("line")
  .attr("x1", 202)   
  .attr("y1", centerY - 28)
  .attr("x2", 202)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 3
hpcGroup.append("line")
  .attr("x1", 212)   
  .attr("y1", centerY - 30)
  .attr("x2", 212)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 4
hpcGroup.append("line")
  .attr("x1", 222)   
  .attr("y1", centerY - 30)
  .attr("x2", 222)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw top of HPC blade 5
hpcGroup.append("line")
  .attr("x1", 232)   
  .attr("y1", centerY - 28)
  .attr("x2", 232)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 1
hpcGroup.append("line")
  .attr("x1", 191)   
  .attr("y1", centerY + 5)
  .attr("x2", 191)  
  .attr("y2", centerY + 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 7);

// Draw bottom of HPC blade 2
hpcGroup.append("line")
  .attr("x1", 202)   
  .attr("y1", centerY + 5)
  .attr("x2", 202)  
  .attr("y2", centerY + 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 3
hpcGroup.append("line")
  .attr("x1", 212)   
  .attr("y1", centerY + 5)
  .attr("x2", 212)  
  .attr("y2", centerY + 30)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 4
hpcGroup.append("line")
  .attr("x1", 222)   
  .attr("y1", centerY + 5)
  .attr("x2", 222)  
  .attr("y2", centerY + 30)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

// Draw bottom of HPC blade 5
hpcGroup.append("line")
  .attr("x1", 232)   
  .attr("y1", centerY + 5)
  .attr("x2", 232)  
  .attr("y2", centerY + 28)
  .attr("stroke", "#444")
  .attr("stroke-width", 5);

//append n2Group to engineGroup
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

//append hptGroup to engineGroup
const hptGroup = engineGroup.append("g").attr("id", "hpt-group");

// Draw top of HPT blade
hptGroup.append("line")
  .attr("x1", 337)   
  .attr("y1", centerY - 40)
  .attr("x2", 337)  
  .attr("y2", centerY - 5)
  .attr("stroke", "#444")
  .attr("stroke-width", 10);
  
// Draw bottom of HPT blade
hptGroup.append("line")
  .attr("x1", 337)   
  .attr("y1", centerY + 5)
  .attr("x2", 337)  
  .attr("y2", centerY + 40)
  .attr("stroke", "#444")
  .attr("stroke-width", 10);

// Draw combustor section (top)
engineGroup.append("ellipse")
  .attr("cx", 290)           
  .attr("cy", centerY - 28)  
  .attr("rx", 35)            
  .attr("ry", 15)           
  .attr("fill", "red")
  .attr("opacity", 0.3);

// Draw combustor section (bottom)
engineGroup.append("ellipse")
  .attr("cx", 290)           
  .attr("cy", centerY + 28) 
  .attr("rx", 35)
  .attr("ry", 15)
  .attr("fill", "red")
  .attr("opacity", 0.3);

//define a tooltip group
const tooltip = d3.select("#engine-tooltip");

//define data associated with tooltip interaction regions
const regions = [
  { name: "Fan",
    desc: "Turned by low pressure turbine via N1 shaft, first compression stage, generates thrust through bypass ducts",
    x: 75,  width: 25 },
  { name: "Low Pressure Compressor",
    desc: "Turned by low pressure turbine via N1 shaft, first stages of core flow compression",
    x: 105, width: 75 },
  { name: "High Pressure Compressor",
    desc: "Turned by high pressure turbine via N2 shaft, final stages of core flow compression",
    x: 185, width: 55 },
  { name: "Combustor",
    desc: "Injects fuel into high pressure compressor outlet air and ignites it, temperature increases significantly",
    x: 255, width: 70 },
  { name: "High Pressure Turbine",
    desc: "Turns the high pressure compressor via N2 shaft, first stages of core flow expansion",
    x: 330, width: 15 },
  { name: "Low Pressure Turbine",
    desc: "Turns the low pressure compressor and fan via N1 shaft, final stages of core flow expansion",
    x: 350, width: 30 },
  { name: "Exhaust Nozzle",
    desc: "Core flow exits thorugh exhaust nozzle completing Brayton cycle",
    x: 380, width: 70 }
];

// Create a group to hold interaction hitboxes
const interactionGroup = engineGroup.append("g").attr("id", "interaction-layer");

//execute tooltip regions
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
        .html(`<strong>${d.name} Section</strong>
               <p>${d.desc}</p>`);
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

// Append airflow path group to engineGroup
const airflowGroup = engineGroup.append("g").attr("id", "airflow-group");

// Draw the first top bypass airflow path
const bypassPathTop1 = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 70} C200,${centerY - 90} 250,${centerY - 90} 300,${centerY - 80}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

// Draw the second top bypass airflow path
const bypassPathTop2 = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 60} C200,${centerY - 80} 250,${centerY - 80} 300,${centerY - 70}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

// Draw the first bottom bypass airflow path (mirror of top)
const bypassPathBottom1 = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 70} C200,${centerY + 90} 250,${centerY + 90} 300,${centerY + 80}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

// Draw the second bottom bypass airflow path (mirror of top)
const bypassPathBottom2 = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 60} C200,${centerY + 80} 250,${centerY + 80} 300,${centerY + 70}`)
  .attr("fill", "none")
  .attr("stroke", "deepskyblue")
  .attr("stroke-width", 4)
  .attr("stroke-dasharray", "5,5")
  .attr("opacity", 0);

// draw the top core airflow path
const corePathTop = airflowGroup.append("path")
  .attr("d", `M40,${centerY - 40} C220,${centerY - 15} 250,${centerY - 28} 300,${centerY - 30} L425,${centerY - 30}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 3)
  .attr("stroke-dasharray", "4,4")
  .attr("opacity", 0);

// draw the bottom core airflow path (mirror of top)
const corePathBottom = airflowGroup.append("path")
  .attr("d", `M40,${centerY + 40} C220,${centerY + 15} 250,${centerY + 28} 300,${centerY + 30} L425,${centerY + 30}`)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 3)
  .attr("stroke-dasharray", "4,4")
  .attr("opacity", 0);

// define pressure chart characteristics
const pChartWidth = 450;
const pChartHeight = 400;
const pMargin = { top: 20, right: 0, bottom: 30, left: 40 };

// define temperature chart characteristics to be same as pressure chart
const tChartWidth = pChartWidth;
const tChartHeight = pChartHeight;
const tMargin = pMargin;

//select pressure chart svg
const pChart = d3.select("#pressure-chart")
.attr("width", 500)
.attr("height", 400);

//create group in pChart
const pChartGroup = pChart.append("g")
  .attr("transform", "translate(50, 0)");

//select temperature chart svg
const tChart = d3.select("#temperature-chart")
.attr("width", 500)
.attr("height", 400);

//create group in tChart
const tChartGroup = tChart.append("g")
  .attr("transform", "translate(50, 0)");

// define segment arrays
let coreSegments = [], bypassSegments = [], flowDotElements = [], chartDotElements = [];

//add reference dots
const flowDotGroup = airflowGroup.append("g").attr("id", "flow-dots");
const pDotGroup = pChartGroup.append("g").attr("id", "p-chart-dots");
const tDotGroup = tChartGroup.append("g").attr("id", "t-chart-dots");

//load the first row from the brayton_cycle csv
d3.csv("brayton_cycle.csv").then(data => {
  // Use the first row or average multiple rows
  const d = data[0]; // example: use row 0

  const values = {
    temperature: {
      t2: +d.t2,
      t24: +d.t24,
      t30: +d.t30,
      t40: estimateTout(+d.ps30 * +d.phi, +d.farB, +d.t30),
      t50: +d.t50
    },
    pressure: {
      p2: +d.p2,
      p15: +d.p15,
      p30: +d.p30,
      p40: +d.p30,
      p50: +d.p2 * +d.epr
    }
  };

  // Define key temperature and pressure changes along the core flow path
  coreSegments = [
    { pct: 0.0, temp: values.temperature.t2,   pressure: values.pressure.p2 },   // Fan inlet
    { pct: 0.48, temp: values.temperature.t30, pressure: values.pressure.p30 },  // HPC outlet
    { pct: 0.70, temp: values.temperature.t40, pressure: values.pressure.p40 },  // Combustor outlet
    //{ pct: 0.90, temp: values.temperature.t50, pressure: values.pressure.p50 },  // LPT outlet
    { pct: 1.0, temp: values.temperature.t50,  pressure: values.pressure.p2 }    // Nozzle/exit
  ];

  // Define key temperature and pressure changes along the bypass flow path
  bypassSegments = [
    { pct: 0.0, temp: values.temperature.t2,  pressure: values.pressure.p2 },   // Fan inlet
    { pct: 0.16, temp: values.temperature.t2, pressure: values.pressure.p15 },  // Bypass duct
    { pct: 1.0, temp: values.temperature.t2,  pressure: values.pressure.p15 }   // Bypass exit
  ];
  
  const xScaleEngine = d3.scaleLinear()
    .domain([0, 1])
    .range([40, 425]);

  flowDotElements = [
  ...createFlowDot(corePathTop,flowDotGroup,coreSegments,xScaleEngine,null,"core"),
  ...createFlowDot(corePathBottom,flowDotGroup,coreSegments,xScaleEngine,null,"core")
  ];

  // For pressure chart dots
  const pXScale = d3.scaleLinear()
    .domain([0, 1])
    .range([pMargin.left, pChartWidth - pMargin.right]);

  const pYScale = d3.scaleLinear()
    .domain([0, 1.1*d3.max(coreSegments, d => d.pressure)])
    .range([pChartHeight - pMargin.bottom, pMargin.top]);

  // Similarly for temperature chart dots
  const tXScale = d3.scaleLinear()
    .domain([0, 1])
    .range([tMargin.left, tChartWidth - tMargin.right]);

  const tYScale = d3.scaleLinear()
    .domain([0, 1.1*d3.max(coreSegments, d => d.temp)])
    .range([tChartHeight - tMargin.bottom, tMargin.top]);

  const pChartPath = drawPressureChart(coreSegments,pXScale,pYScale);
  const tChartPath = drawTemperatureChart(coreSegments,tXScale,tYScale);

  chartDotElements = [
    ...createFlowDot(pChartPath, pDotGroup, coreSegments, pXScale, pYScale,"pressure"),
    ...createFlowDot(tChartPath, tDotGroup, coreSegments, tXScale, tYScale,"temp")
  ];

});

const width = 120;
const height = 200;

// select the throttle container and store it in a constant variable.
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

// Couple d drag behavior
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

//enable drag action
leftKnob.call(drag);
rightKnob.call(drag);

//call the animate flow functions for each of the paths.
animateFlow(bypassPathTop1);
animateFlow(bypassPathTop2);
animateFlow(bypassPathBottom1);
animateFlow(bypassPathBottom2);
animateFlow(corePathTop);
animateFlow(corePathBottom);

// Store all centerline paths for sliding lines
const slidingLinesPaths = [];

//create the sliding lines from the LPC blade shapes
for(let i = 0; i < bladeCount; i++) {
  
  let t = i / (bladeCount - 1);
  
  const cx = lerp(startX, endX, t);
  const rw = lerp(startRectWidth, endRectWidth, t);
  const rh = lerp(startRectHeight, endRectHeight, t);
  const ttW = lerp(startTrapTopWidth, endTrapTopWidth, t);
  const th = lerp(startTrapHeight, endTrapHeight, t);
  
  const centerline = createBlade(cx, rw, rh, ttW, th);
  slidingLinesPaths.push(centerline);
}

// Create sliding lines group for the LPC trapezoid blades
const slidingLinesGroup = engineGroup.append("g").attr("id", "sliding-lines-group");

//array to store sliding SVG elements for the LPC blades
const slidingLineElements = []; 

//array to store sliding SVG elements for the Fan, HPC, HPT, and LPT blades
const dashOverlayElements = [
  ...animateBladeDashes(fanGroup),
  ...animateBladeDashes(hpcGroup),
  ...animateBladeDashes(hptGroup),
  ...animateBladeDashes(lptGroup)
];

//create each sliding line path for the LPC blades
slidingLinesPaths.forEach(pathD => {
  const path = slidingLinesGroup.append("path")
    .attr("d", pathD)
    .attr("stroke-width", 6)
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("stroke-dasharray", "5 10")
    .attr("stroke-dashoffset", 0)
    .attr("opacity", 0); // Start hidden

  slidingLineElements.push(path); // <--- Store path element

  animateDash(path);
});

//function to update the visualization based on the throttle input
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
    flowDotGroup?.attr("opacity",coreOpacity)
    pDotGroup?.attr("opacity",coreOpacity)
    tDotGroup?.attr("opacity",coreOpacity)
  } else {
    bypassPathTop1?.attr("opacity", 0);
    bypassPathTop2?.attr("opacity", 0);
    bypassPathBottom1?.attr("opacity", 0);
    bypassPathBottom2?.attr("opacity", 0);
    corePathTop?.attr("opacity", 0);
    corePathBottom?.attr("opacity", 0);
    flowDotGroup?.attr("opacity",0);
    pDotGroup?.attr("opacity",0);
    tDotGroup?.attr("opacity",0);
  }

  //Sliding lines for LPC fade in/out with flow
  slidingLineElements.forEach(path =>
    path.attr("opacity", flowOpacity)
  );

  //Slides lines for Fan, HPC, HPT, and LPT fade in/out with flow
  dashOverlayElements.forEach(path =>
    path.attr("opacity", flowOpacity)
  );

  //Flow dots fade in/out with flow
  flowDotElements.forEach(dot =>
    dot.attr("opacity", flowOpacity)
  );

  //Flow dots fade in/out with flow
  chartDotElements.forEach(dot =>
    dot.attr("opacity", flowOpacity)
  );
}

function drawPressureChart(coreSegments,xScale,yScale) {
  
  // Add X Axis
  pChartGroup.append("g")
    .attr("transform", `translate(0, ${pChartHeight - pMargin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(0).tickFormat(d3.format(".0%")))
    .attr("font-size", 12);

  // Add Y Axis
  pChartGroup.append("g")
    .attr("transform", `translate(${pMargin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5))
    .attr("font-size", 12);
  
  // Chart Title
  pChartGroup.append("text")
    .attr("x", pChartWidth / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Pressure Along Core Flow Path")
    .style("font-size","18px");
  
  // X Axis Label
  pChartGroup.append("text")
    .attr("x", pChartWidth / 2)
    .attr("y", pChartHeight - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Core Flow Path")
    .style("font-size","14px");

  // Y Axis Label
  pChartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -pChartHeight / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Pressure (psi)")
    .style("font-size","14px");

  const line = d3.line()
    .x(d => xScale(d.pct))
    .y(d => yScale(d.pressure));

  const path = pChartGroup.append("path")
    .datum(coreSegments)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  return path;
}

function drawTemperatureChart(coreSegments,xScale,yScale) {
  
  // Add X Axis
  tChartGroup.append("g")
    .attr("transform", `translate(0, ${tChartHeight - tMargin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(0).tickFormat(d3.format(".0%")))
    .attr("font-size", 12);

  // Add Y Axis
  tChartGroup.append("g")
    .attr("transform", `translate(${tMargin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5))
    .attr("font-size", 12);

  // Title
  tChartGroup.append("text")
    .attr("x", tChartWidth / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Temperature Along Core Flow Path")
    .style("font-size","18px");

  // X Axis Label
  tChartGroup.append("text")
    .attr("x", tChartWidth / 2)
    .attr("y", tChartHeight - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Core Flow Path")
    .style("font-size","14px");

  // Y Axis Label
  tChartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -tChartHeight / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .text("Temperature (Rankine)")
    .style("font-size","14px");

  const line = d3.line()
    .x(d => xScale(d.pct))
    .y(d => yScale(d.temp));

  const path = tChartGroup.append("path")
    .datum(coreSegments)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  return path;
}