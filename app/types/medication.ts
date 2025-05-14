export type Status = 'Pending' | 'Taken' | 'Missed';

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  times: string[];
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  status: Status;
  date: string;
};
