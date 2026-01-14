export function generateIncidentEmailBody(
  residentName: string,
  incidentData: {
    incident?: string | null;
    location?: string | null;
    relatedInjuries?: string | null;
    witnessToIncident?: string | null;
    firstAid?: boolean | null;
    firstAidDescription?: string | null;
    nurseProgress?: string | null;
  },
  incidentDate: string,
  incidentTime: string,
): string {
  return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Incident Report Notification</h2>
            <p>An incident has been reported for <strong>${residentName}</strong>.</p>
            
            <h3 style="color: #34495e; margin-top: 20px;">Incident Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; width: 200px;">Date:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${incidentDate}</td>
              </tr>
              ${
                incidentTime
                  ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Time:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${incidentTime}</td>
              </tr>
              `
                  : ''
              }
              ${
                incidentData.location
                  ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Location:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${incidentData.location}</td>
              </tr>
              `
                  : ''
              }
            </table>
  
            <h3 style="color: #34495e; margin-top: 20px;">Incident Description</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db;">
              ${incidentData.incident || 'No description provided'}
            </p>
  
            ${
              incidentData.relatedInjuries
                ? `
            <h3 style="color: #34495e; margin-top: 20px;">Related Injuries</h3>
            <p>${incidentData.relatedInjuries}</p>
            `
                : ''
            }
  
            ${
              incidentData.witnessToIncident
                ? `
            <h3 style="color: #34495e; margin-top: 20px;">Witness</h3>
            <p>${incidentData.witnessToIncident}</p>
            `
                : ''
            }
  
            ${
              incidentData.firstAid
                ? `
            <h3 style="color: #34495e; margin-top: 20px;">First Aid</h3>
            <p>${incidentData.firstAidDescription || 'First aid was provided'}</p>
            `
                : ''
            }
  
            ${
              incidentData.nurseProgress
                ? `
            <h3 style="color: #34495e; margin-top: 20px;">Nurse Progress</h3>
            <p>${incidentData.nurseProgress}</p>
            `
                : ''
            }
  
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #7f8c8d; font-size: 12px;">
              This is an automated notification. Please review the incident report in the system.
            </p>
          </body>
        </html>
      `;
}

export function generateNoteEmailBody(
  residentName: string,
  noteData: {
    noteName?: string | null;
    tags?: unknown;
    date?: Date | null;
    time?: string | null;
  },
  noteDate: string,
  noteTime: string,
): string {
  const tagsDisplay =
    noteData.tags && Array.isArray(noteData.tags)
      ? (noteData.tags as string[]).join(', ')
      : noteData.tags
        ? JSON.stringify(noteData?.tags)
        : '';

  return `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Note Alert Notification</h2>
            <p>A note alert has been triggered for <strong>${residentName}</strong>.</p>
            
            <h3 style="color: #34495e; margin-top: 20px;">Note Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; width: 200px;">Date:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${noteDate}</td>
              </tr>
              ${
                noteTime
                  ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Time:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${noteTime}</td>
              </tr>
              `
                  : ''
              }
              ${
                noteData.noteName
                  ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Note Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${noteData.noteName}</td>
              </tr>
              `
                  : ''
              }
              ${
                tagsDisplay
                  ? `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Tags:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${tagsDisplay}</td>
              </tr>
              `
                  : ''
              }
            </table>
  
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #7f8c8d; font-size: 12px;">
              This is an automated notification. Please review the note in the system.
            </p>
          </body>
        </html>
      `;
}

