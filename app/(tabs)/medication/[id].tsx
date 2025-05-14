import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Pill, Pencil, Trash2 } from 'lucide-react-native';
import { useMedications } from '../../../lib/medications';
import ConfirmationModal from '../../../components/ConfirmationModal';

export default function MedicationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getMedicationById, deleteMedication } = useMedications();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      try {
        const med = getMedicationById(id);
        if (!med) {
          setError('Medicamento não encontrado');
        } else {
          setMedication(med);
        }
      } catch {
        setError('Erro ao carregar medicamento');
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteMedication(id);
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pillIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  dosage: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoSection: {
    padding: 20,
    gap: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
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
    backgroundColor: '#F2F8FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timeChipText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayActive: {
    backgroundColor: '#4A90E2',
  },
  dayInactive: {
    backgroundColor: '#F3F4F6',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextInactive: {
    color: '#A0A0A0',
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
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteBtn: {
    flex: 0.5,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
