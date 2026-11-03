import { SolarQuoteCalculation, SiteConfiguration } from '../types/solar';

export interface CalculatorInputs {
  monthlyBill: number;
  electricityRate?: number; // $/kWh, default 0.32
  sunHoursPerDay?: number;  // hours, default 5.2
  roofType?: string;
  batteryChoice: 'none' | 'tesla_powerwall_3' | 'enphase_5p_dual';
}

export const BATTERY_OPTIONS = {
  none: {
    name: 'None (Grid-Tied Net Metering)',
    capacityKWh: 0,
    cost: 0,
  },
  tesla_powerwall_3: {
    name: 'Tesla Powerwall 3 (13.5 kWh Backup)',
    capacityKWh: 13.5,
    cost: 11800,
  },
  enphase_5p_dual: {
    name: 'Dual Enphase IQ Battery 5P (10 kWh)',
    capacityKWh: 10.0,
    cost: 9800,
  },
};

export const calculateSolarSystem = (
  inputs: CalculatorInputs,
  config: SiteConfiguration
): SolarQuoteCalculation => {
  const bill = Math.max(50, Number(inputs.monthlyBill) || 200);
  const rate = inputs.electricityRate || 0.31;
  const sunHours = inputs.sunHoursPerDay || 5.2;
  const costPerWatt = config.solarCostPerWatt || 2.85;
  const panelWattage = 430; // 430W Tier-1 mono

  // Monthly kWh consumption
  const monthlyKWh = bill / rate;
  const annualKWhNeeded = monthlyKWh * 12;

  // System sizing: 1 kW produces approx sunHours * 365 * 0.81 kWh per year
  const kwhPerKwYear = sunHours * 365 * 0.82;
  const targetKW = annualKWhNeeded / kwhPerKwYear;

  // Discrete panel count
  const panelCount = Math.max(8, Math.ceil((targetKW * 1000) / panelWattage));
  const recommendedSizeKW = (panelCount * panelWattage) / 1000;
  const annualProductionKWh = recommendedSizeKW * kwhPerKwYear;

  // Battery addition
  const battery = BATTERY_OPTIONS[inputs.batteryChoice] || BATTERY_OPTIONS.none;
  const batteryCost = battery.cost;
  const batterySelected = inputs.batteryChoice !== 'none';

  // Gross and Net Costs
  const solarEquipmentCost = recommendedSizeKW * 1000 * costPerWatt;
  const grossCost = solarEquipmentCost + batteryCost;
  const federalTaxCredit30 = grossCost * 0.30;
  const localRebates = recommendedSizeKW > 15 ? 1200 : 650;
  const netCost = grossCost - federalTaxCredit30 - localRebates;

  // Utility savings
  const estimatedYearlySavings = Math.min(bill * 12 * 0.96, annualProductionKWh * rate);

  // 25-Year cumulative savings with 4% electricity inflation and 0.5% degradation
  let totalSavings25 = 0;
  let currentYearSavings = estimatedYearlySavings;
  for (let y = 1; y <= 25; y++) {
    totalSavings25 += currentYearSavings;
    currentYearSavings = currentYearSavings * 1.038 * 0.995;
  }
  const estimated25YearSavings = Math.round(totalSavings25 - netCost);

  // Payback years
  const paybackYears = Math.min(25, Math.max(3.5, netCost / (estimatedYearlySavings || 1)));

  // Environmental impact
  const co2OffsetTonsPerYear = (annualProductionKWh * 0.85) / 2000; // Tons
  const treesEquivalent = Math.round(recommendedSizeKW * 16);

  return {
    monthlyBill: bill,
    recommendedSizeKW,
    panelCount,
    annualProductionKWh,
    grossCost: Math.round(grossCost),
    federalTaxCredit30: Math.round(federalTaxCredit30),
    localRebates,
    netCost: Math.round(netCost),
    estimatedYearlySavings: Math.round(estimatedYearlySavings),
    estimated25YearSavings: Math.max(0, estimated25YearSavings),
    paybackYears: Number(paybackYears.toFixed(1)),
    co2OffsetTonsPerYear: Number(co2OffsetTonsPerYear.toFixed(1)),
    treesEquivalent,
    batterySelected,
    batteryCost,
    batteryModel: battery.name,
  };
};
