import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Check, X } from 'lucide-react-native';
import { useMedications } from '../lib/medications';
import { Medication } from '@/app/types/medication';



type Props = {
  medications: Medication[];
};

export default function MedicationList({ medications }: Props) {
  const router = useRouter();
  const { updateMedicationStatus } = useMedications();

  const getStatusColor = (status: Medication['status']) => {
  switch (status) {
    case 'Taken':
      return '#4A90E2'; // azul principal
    case 'Missed':
      return '#9CA3AF'; // cinza elegante
    default:
      return '#FBBF24'; // amarelo para pendente
  }
};


  const handleMarkAsTaken = (id: string) => {
    updateMedicationStatus(id, 'Taken');
  };

  const handleMarkAsMissed = (id: string) => {
    updateMedicationStatus(id, 'Missed');
  };

  const renderStatus = (medication: Medication) => {
    if (medication.status === 'Pending') {
      return (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.buttonTaken]} onPress={() => handleMarkAsTaken(medication.id)}>
            <Check size={16} color="#fff" />
            <Text style={styles.buttonText}>Tomado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonMissed]} onPress={() => handleMarkAsMissed(medication.id)}>
            <X size={16} color="#fff" />
            <Text style={styles.buttonText}>Pular</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: getStatusColor(medication.status) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(medication.status) }]}>
          {medication.status === 'Taken' ? 'Tomado' : 'Perdido'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {medications.map((med) => (
        <TouchableOpacity
          key={med.id}
          style={styles.card}
          onPress={() => router.push(`/medication/${med.id}`)}
        >
          <View style={styles.content}>
            <View style={styles.info}>
              <Text style={styles.name}>{med.name}</Text>
              <Text style={styles.dosage}>{med.dosage}</Text>
              <View style={styles.time}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.timeText}>{med.times.join(', ')}</Text>
              </View>
            </View>
            {renderStatus(med)}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    padding: 16,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonTaken: {
    backgroundColor: '#4A90E2',
  },
  buttonMissed: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
});
