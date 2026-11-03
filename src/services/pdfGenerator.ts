import { jsPDF } from 'jspdf';
import { SolarQuoteCalculation, SiteConfiguration } from '../types/solar';

export interface CustomerQuoteInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  quoteId?: string;
}

export const generateSolarQuotePdf = (
  quote: SolarQuoteCalculation,
  customer: CustomerQuoteInfo,
  config: SiteConfiguration
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const quoteNumber = customer.quoteId || `TNX-Q${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Colors
  const primaryColor = [16, 85, 60]; // Deep Emerald
  const darkSlate = [15, 23, 42];    // Slate 900
  const mutedGray = [100, 116, 139]; // Slate 500
  const lightBg = [248, 250, 252];   // Slate 50
  const accentAmber = [217, 119, 6]; // Amber 600

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Accent stripe
  doc.setFillColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.rect(0, 32, 210, 2, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(config.companyName.toUpperCase(), 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(config.tagline, 14, 23);

  // License & contact in header right
  doc.setFontSize(8);
  doc.text(config.licenseNumber, 196, 12, { align: 'right' });
  doc.text(config.phone, 196, 17, { align: 'right' });
  doc.text(config.email, 196, 22, { align: 'right' });

  // 2. Proposal Metadata & Client Block
  let currentY = 44;

  // Left side: Prepared For
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SOLAR ENERGY PROPOSAL PREPARED FOR:', 14, currentY);

  currentY += 6;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(customer.name || 'Valued Property Owner', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  if (customer.address) {
    doc.text(`Property: ${customer.address}`, 14, currentY);
    currentY += 4.5;
  }
  if (customer.email) {
    doc.text(`Email: ${customer.email}  |  Phone: ${customer.phone || 'N/A'}`, 14, currentY);
    currentY += 4.5;
  }

  // Right side: Proposal Reference
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PROPOSAL ID:', 140, 44);
  doc.text('ISSUE DATE:', 140, 50);
  doc.text('VALID UNTIL:', 140, 56);

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(quoteNumber, 196, 44, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, 196, 50, { align: 'right' });
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  doc.text(validUntil.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 196, 56, { align: 'right' });

  // 3. Recommended System Card
  currentY = 66;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, currentY, 182, 38, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 38, 3, 3, 'S');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CUSTOM ENGINEERED SYSTEM SPECIFICATIONS', 20, currentY + 8);

  // 4 key metric stat boxes inside
  const colWidth = 43;
  const metrics = [
    { label: 'System Size', value: `${quote.recommendedSizeKW.toFixed(1)} kW DC` },
    { label: 'Panel Count', value: `${quote.panelCount} Solar Modules` },
    { label: 'Annual Output', value: `${Math.round(quote.annualProductionKWh).toLocaleString()} kWh/yr` },
    { label: 'Est. Payback', value: `${quote.paybackYears.toFixed(1)} Years` },
  ];

  metrics.forEach((m, idx) => {
    const xPos = 20 + idx * colWidth;
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(m.label, xPos, currentY + 18);

    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(m.value, xPos, currentY + 25);
  });

  // Equipment detail note below metrics
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  const batteryStr = quote.batterySelected ? ` + ${quote.batteryModel}` : ' (Grid-Tied)';
  doc.text(
    `Hardware: ${config.solarPanelBrand} | ${config.inverterBrand}${batteryStr}`,
    20,
    currentY + 33
  );

  // 4. Financial Breakdown Table
  currentY = 112;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INVESTMENT & FINANCIAL INCENTIVES SUMMARY', 14, currentY);

  currentY += 4;
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, 182, 7, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Description / Incentive Item', 18, currentY + 5);
  doc.text('Amount ($)', 190, currentY + 5, { align: 'right' });

  currentY += 7;

  const rows: { desc: string; amount: number; isNegative?: boolean; isTotal?: boolean; highlight?: boolean }[] = [
    { desc: `Turnkey Solar PV Installation (${quote.recommendedSizeKW.toFixed(1)} kW System)`, amount: quote.grossCost - (quote.batterySelected ? quote.batteryCost : 0) },
  ];

  if (quote.batterySelected) {
    rows.push({
      desc: `Intelligent Battery Energy Storage (${quote.batteryModel})`,
      amount: quote.batteryCost,
    });
  }

  rows.push(
    { desc: 'Gross Turnkey System Cost', amount: quote.grossCost, isTotal: true },
    { desc: 'Federal Investment Tax Credit (ITC 30% Clean Energy Credit)', amount: -quote.federalTaxCredit30, isNegative: true },
  );

  if (quote.localRebates > 0) {
    rows.push({ desc: 'Estimated Local Utility & Clean Energy Rebates', amount: -quote.localRebates, isNegative: true });
  }

  rows.push({
    desc: 'NET OUT-OF-POCKET INVESTMENT',
    amount: quote.netCost,
    isTotal: true,
    highlight: true,
  });

  rows.forEach((r) => {
    if (r.highlight) {
      doc.setFillColor(236, 253, 245); // light emerald
      doc.rect(14, currentY, 182, 8, 'F');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
    } else if (r.isTotal) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    } else if (r.isNegative) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    }

    doc.text(r.desc, 18, currentY + 5.5);
    const amtStr = r.amount < 0 ? `-$${Math.abs(Math.round(r.amount)).toLocaleString()}` : `$${Math.round(r.amount).toLocaleString()}`;
    doc.text(amtStr, 190, currentY + 5.5, { align: 'right' });

    // Border bottom
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY + 8, 196, currentY + 8);

    currentY += 8;
  });

  // 5. Long-Term Value & Environmental Impact Box
  currentY += 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, currentY, 182, 34, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, 34, 3, 3, 'S');

  doc.setTextColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PROJECTED 25-YEAR UTILITY SAVINGS & CLEAN IMPACT', 20, currentY + 7);

  const valueStats = [
    { label: 'Current Electric Bill', val: `$${Math.round(quote.monthlyBill)} / mo` },
    { label: 'Year 1 Est. Savings', val: `$${Math.round(quote.estimatedYearlySavings).toLocaleString()}` },
    { label: '25-Year Cumulative Savings', val: `$${Math.round(quote.estimated25YearSavings).toLocaleString()}` },
    { label: 'CO2 Offset Equivalent', val: `${quote.co2OffsetTonsPerYear.toFixed(1)} Tons/yr` },
  ];

  valueStats.forEach((v, idx) => {
    const xPos = 20 + idx * colWidth;
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(v.label, xPos, currentY + 16);

    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(v.val, xPos, currentY + 24);
  });

  // 6. Warranties & Guarantees Badge
  currentY += 40;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, 182, 24, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, 182, 24, 2, 2, 'S');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`★ TONEX TRIPLE-PROTECTION WARRANTY CERTIFIED`, 20, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(
    `• ${config.warrantyYearsProduct}-Year Linear Power Output & Manufacturer Equipment Warranty (92% guaranteed efficiency at year 25)\n• ${config.warrantyYearsWorkmanship}-Year Comprehensive Labor, Roof Penetration & Weather-Tight Seal Guarantee\n• Real-Time Mobile App Energy Monitoring with 24/7 Automated Production Tracking`,
    20,
    currentY + 11
  );

  // 7. Signature & Acceptance Footer
  currentY += 30;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('Client Acceptance Signature: _____________________________________      Date: _______________', 14, currentY);

  currentY += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, 196, currentY);

  currentY += 5;
  doc.setFontSize(7);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(
    `Tonex Solar Works | Headquarters: ${config.address} | Call: ${config.phone} | Licensed & Insured`,
    105,
    currentY,
    { align: 'center' }
  );
  doc.text(
    'Estimates based on regional irradiance, current utility tariff structures, and 30% federal tax credit rules. Subject to final engineering survey.',
    105,
    currentY + 4,
    { align: 'center' }
  );

  return doc;
};

export const downloadSolarQuotePdf = (
  quote: SolarQuoteCalculation,
  customer: CustomerQuoteInfo,
  config: SiteConfiguration
): string => {
  const doc = generateSolarQuotePdf(quote, customer, config);
  const cleanName = (customer.name || 'Solar_Quote').replace(/\s+/g, '_');
  const filename = `Tonex_Solar_Quote_${cleanName}.pdf`;
  doc.save(filename);
  return filename;
};
