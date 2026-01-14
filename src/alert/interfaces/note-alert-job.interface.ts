export interface NoteAlertJobData {
  alertId: number;
  noteId: number;
  emails: string[];
  residentName: string;
  alertInstructions?: string | null;
  noteDateLabel?: string;
  noteTime?: string | null;
  noteDetails: {
    noteName?: string | null;
    tags?: unknown;
    date?: Date | null;
    time?: string | null;
  };
}




