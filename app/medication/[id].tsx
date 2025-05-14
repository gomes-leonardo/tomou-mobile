import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Pill, Pencil, Trash2 } from 'lucide-react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useMedications } from '@/lib/medications';

type Medication = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  status: 'Pending' | 'Taken' | 'Missed';
  days: Record<string, boolean>;
};
export default function MedicationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getMedicationById, deleteMedication } = useMedications();
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
  if (id) {
    console.log(id)
    try {
      const med = getMedicationById(String(id)); // aqui está a correção
      setMedication(med);
    } catch (err) {
      setError('Medicamento não encontrado');
    } finally {
      setLoading(false);
    }
  }
}, [id]);


  const handleDelete = async () => {
    try {
     await deleteMedication(String(id));
      router.back();
    } catch {
      setError('Falha ao excluir o medicamento');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error || !medication) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Medicamento não encontrado'}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Medicamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.card}>
          <View style={styles.pillIcon}>
            <Pill size={28} color="#4A90E2" />
          </View>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#4A90E2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horários</Text>
              <View style={styles.timeList}>
                {medication.times.map((time, i) => (
                  <View key={i} style={styles.timeChip}>
                    <Text style={styles.timeChipText}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Calendar size={20} color="#4A90E2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dias da Semana</Text>
              <View style={styles.daysRow}>
                {Object.entries(medication.days).map(([day, isActive]) => (
                  <View
                    key={day}
                    style={[styles.dayChip, isActive ? styles.dayActive : styles.dayInactive]}
                  >
                    <Text style={isActive ? styles.dayTextActive : styles.dayTextInactive}>
                      {day.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/medication/edit/${id}`)}
          >
            <Pencil size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setShowDeleteModal(true)}
          >
            <Trash2 size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Excluir medicamento"
        message={`Tem certeza que deseja excluir ${medication.name}?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  pillIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  dosage: {
    fontSize: 15,
    color: '#6B7280',
  },
  infoSection: {
    marginHorizontal: 20,
    gap: 20,
  },
  infoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  timeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#E5F1FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timeChipText: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 14,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  dayInactive: {
    backgroundColor: '#FFFFFF',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextInactive: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});


