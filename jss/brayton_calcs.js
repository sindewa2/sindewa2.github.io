const width = 400, height = 400, margin = 50, ambientP = 14.7;

//function to estimate combustor outlet temperature
function estimateTout(mFuel, fuelAirRatio, Tin, LHV = 18400, Cp = 0.4) {
  const mAir = mFuel / fuelAirRatio;
  const mTotal = mFuel + mAir;
  const Qfuel = mFuel * LHV;
  return Tin + Qfuel / (mTotal * Cp);
}

//function to estimate compression efficiency from fan inlet to HPC outlet
function estimateEtaComp(p2, t2, p30, t30, gamma = 1.39){ 
    const ctr = t30 / t2;
    const cpr = p30 / p2;
    return (Math.pow(cpr,(gamma - 1) / gamma) - 1) / (ctr - 1);

}

//function to estimate turbine efficiency from combustor outlet to LPT outlet
function estimateEtaTurb(p40,t40,p50,t50, gamma = 1.32){ 
    const ttr = t50/t40;
    const tpr = p50/p40; 
    return (ttr - 1) / (Math.pow(tpr,(gamma - 1) / gamma) - 1);
}

//function to calculate volume proxy for P-v diagram
function calcVolume(T, P) {
  return T / P;
}

export {
  estimateTout,
  estimateEtaComp,
  estimateEtaTurb,
  calcVolume
};