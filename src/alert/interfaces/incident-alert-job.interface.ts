export interface IncidentAlertJobData {
  alertId: number;
  incidentId: number;
  emails: string[];
  residentName: string;
  alertInstructions?: string | null;
  incidentDateLabel?: string;
  incidentTime?: string | null;
  incidentDetails: {
    incident?: string | null;
    location?: string | null;
    relatedInjuries?: string | null;
    witnessToIncident?: string | null;
    firstAid?: boolean | null;
    firstAidDescription?: string | null;
    nurseProgress?: string | null;
  };
}

