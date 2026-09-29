export interface ServiceVolumePoint {
  month: string;
  serviceVisits: number;
  breakdowns: number;
  installations: number;
}

export const serviceVolume: ServiceVolumePoint[] = [
{ month: 'Apr', serviceVisits: 186, breakdowns: 64, installations: 12 },
{ month: 'May', serviceVisits: 201, breakdowns: 58, installations: 18 },
{ month: 'Jun', serviceVisits: 194, breakdowns: 71, installations: 9 },
{ month: 'Jul', serviceVisits: 215, breakdowns: 49, installations: 21 },
{ month: 'Aug', serviceVisits: 228, breakdowns: 55, installations: 15 },
{ month: 'Sep', serviceVisits: 209, breakdowns: 43, installations: 19 }];