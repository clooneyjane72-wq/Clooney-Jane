import { SolarLead, SolarProject, Appointment } from '../types/solar';

export const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJson = (filename: string, data: any) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportLeadsCsv = (leads: SolarLead[]) => {
  const formatted = leads.map((l) => ({
    LeadID: l.id,
    ClientName: l.clientName,
    Email: l.email,
    Phone: l.phone,
    Address: l.address,
    City: l.city,
    State: l.state,
    ZipCode: l.zipCode,
    PropertyType: l.propertyType,
    RoofType: l.roofType,
    MonthlyElectricBill: l.avgMonthlyElectricBill,
    EstimatedSystemKW: l.estimatedSystemSizeKW,
    EstimatedGrossCost: l.estimatedGrossCost,
    EstimatedNetCost: l.estimatedNetCost,
    Status: l.status,
    Source: l.source,
    CreatedAt: l.createdAt,
    Notes: l.notes || '',
  }));
  exportToCsv('Tonex_Solar_Leads_Export', formatted);
};

export const exportProjectsCsv = (projects: SolarProject[]) => {
  const formatted = projects.map((p) => ({
    ProjectNumber: p.projectNumber,
    ClientName: p.clientName,
    Address: p.address,
    SystemSizeKW: p.systemSizeKW,
    PanelCount: p.panelCount,
    PanelModel: p.panelModel,
    InverterModel: p.inverterModel,
    BatteryStorage: p.batteryStorage,
    ContractValue: p.contractValue,
    CurrentPhase: p.currentPhase,
    ProgressPercent: `${p.phaseProgressPercent}%`,
    PermitNumber: p.permitNumber || 'N/A',
    UtilityCompany: p.utilityCompany,
    AssignedEngineer: p.assignedEngineer,
    TargetCompletionDate: p.targetCompletionDate,
    Notes: p.notes,
  }));
  exportToCsv('Tonex_Solar_Projects_Export', formatted);
};

export const exportAppointmentsCsv = (appointments: Appointment[]) => {
  const formatted = appointments.map((a) => ({
    AppointmentID: a.id,
    ServiceType: a.serviceType,
    ClientName: a.clientName,
    ClientEmail: a.clientEmail,
    ClientPhone: a.clientPhone,
    Address: a.address,
    Date: a.date,
    TimeSlot: a.timeSlot,
    Status: a.status,
    AssignedStaff: a.assignedStaff,
    SyncedToGoogleCalendar: a.syncedToGoogleCalendar ? 'YES' : 'NO',
    Notes: a.notes || '',
  }));
  exportToCsv('Tonex_Solar_Appointments_Export', formatted);
};
