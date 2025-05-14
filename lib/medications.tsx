import { createContext, useContext, useState, useCallback } from 'react';
import { format } from 'date-fns';

// Define types
type Status = 'Pending' | 'Taken' | 'Missed';

type Medication = {
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

type MedicationsContextType = {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  addMedication: (medication: Omit<Medication, 'id' | 'status' | 'date'>) => Promise<void>;
  updateMedicationStatus: (id: string, status: Status) => void;
  deleteMedication: (id: string) => Promise<void>;
  refreshMedications: () => Promise<void>;
  getMedicationById: (id: string) => Medication | null;
  getMedicationsByDate: (date: string) => Medication[];
  getMarkedDates: () => Record<string, { marked: boolean; dotColor: string }>;
};

// Create the context
const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

// Mock medication data
const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Ibuprofen',
    dosage: '200mg',
    frequency: 3,
    times: ['08:00', '14:00', '20:00'],
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    status: 'Pending',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '2',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 2,
    times: ['09:00', '21:00'],
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    status: 'Taken',
    date: format(new Date(), 'yyyy-MM-dd')
  },
  {
    id: '3',
    name: 'Vitamin D',
    dosage: '1000 IU',
    frequency: 1,
    times: ['10:00'],
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    status: 'Missed',
    date: format(new Date(), 'yyyy-MM-dd')
  }
];

// Create a provider for the medications context
export function MedicationsProvider({ children }) {
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch medications
  const refreshMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from an API
      setMedications(MOCK_MEDICATIONS);
    } catch (err) {
      setError('Failed to load medications');
      console.error('Error refreshing medications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new medication
  const addMedication = useCallback(async (medicationData: Omit<Medication, 'id' | 'status' | 'date'>) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedication: Medication = {
        id: Date.now().toString(),
        ...medicationData,
        status: 'Pending',
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      // Add to state
      setMedications(prev => [...prev, newMedication]);
      
      // In a real app, you would save to a database
      MOCK_MEDICATIONS.push(newMedication);
    } catch (err) {
      setError('Failed to add medication');
      console.error('Error adding medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update medication status
  const updateMedicationStatus = useCallback((id: string, status: Status) => {
    try {
      // Update in state
      setMedications(prev => 
        prev.map(med => 
          med.id === id ? { ...med, status } : med
        )
      );
      
      // In a real app, you would save to a database
      const index = MOCK_MEDICATIONS.findIndex(med => med.id === id);
      if (index !== -1) {
        MOCK_MEDICATIONS[index].status = status;
      }
    } catch (err) {
      console.error('Error updating medication status:', err);
    }
  }, []);

  // Delete medication
  const deleteMedication = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from state
      setMedications(prev => prev.filter(med => med.id !== id));
      
      // In a real app, you would delete from a database
      const index = MOCK_MEDICATIONS.findIndex(med => med.id === id);
      if (index !== -1) {
        MOCK_MEDICATIONS.splice(index, 1);
      }
    } catch (err) {
      setError('Failed to delete medication');
      console.error('Error deleting medication:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get medication by id
  const getMedicationById = useCallback((id: string) => {
    return medications.find(med => med.id === id) || null;
  }, [medications]);

  // Get medications by date
  const getMedicationsByDate = useCallback((date: string) => {
    return medications.filter(med => med.date === date);
  }, [medications]);

  // Get marked dates for calendar
  const getMarkedDates = useCallback(() => {
    const markedDates: Record<string, { marked: boolean; dotColor: string }> = {};
    
    // Group medications by date
    const dateGroups = medications.reduce((acc, med) => {
      if (!acc[med.date]) {
        acc[med.date] = [];
      }
      acc[med.date].push(med);
      return acc;
    }, {} as Record<string, Medication[]>);
    
    // Create marked dates
    for (const date in dateGroups) {
      const meds = dateGroups[date];
      
      // Check if there are any missed medications
      if (meds.some(med => med.status === 'Missed')) {
        markedDates[date] = { marked: true, dotColor: '#F44336' };
      }
      // Check if all are taken
      else if (meds.every(med => med.status === 'Taken')) {
        markedDates[date] = { marked: true, dotColor: '#4CAF50' };
      }
      // Some are pending
      else {
        markedDates[date] = { marked: true, dotColor: '#FFC107' };
      }
    }
    
    return markedDates;
  }, [medications]);

  const value = {
    medications,
    loading,
    error,
    addMedication,
    updateMedicationStatus,
    deleteMedication,
    refreshMedications,
    getMedicationById,
    getMedicationsByDate,
    getMarkedDates,
  };

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>;
}

// Custom hook to use the medications context
export function useMedications() {
  const context = useContext(MedicationsContext);
  
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationsProvider');
  }
  
  return context;
}