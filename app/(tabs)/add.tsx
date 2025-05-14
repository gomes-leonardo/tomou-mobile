import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Info, Clock } from 'lucide-react-native';
import { useMedications } from '../../lib/medications';
import TimePicker from '../../components/TimePicker';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function AddMedicationScreen() {
  type WeekDay =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

  const dayAbbreviations: Record<WeekDay, string> = {
    sunday: 'D',
    monday: 'S',
    tuesday: 'T',
    wednesday: 'Q',
    thursday: 'Q',
    friday: 'S',
    saturday: 'S',
  };

  const weekDays: WeekDay[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1');
  const [times, setTimes] = useState(['08:00']);
  const [days, setDays] = useState<Record<WeekDay, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { addMedication } = useMedications();

  const toggleDay = (day: WeekDay) => {
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const addTimeSlot = () => {
    if (times.length < 5) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTimes([...times, '12:00']);
    }
  };

  const removeTimeSlot = (index: number) => {
    if (times.length > 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const updated = [...times];
      updated.splice(index, 1);
      setTimes(updated);
    }
  };

  const updateTime = (index: number, time: string) => {
    const updated = [...times];
    updated[index] = time;
    setTimes(updated);
  };

  const handleAddMedication = async () => {
    if (!name) {
      setError('O nome do medicamento é obrigatório');
      return;
    }
    if (times.length === 0) {
      setError('Adicione pelo menos um horário');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addMedication({
        name,
        dosage: dosage || 'Não especificado',
        frequency: parseInt(frequency, 10),
        times,
        days,
      });
      router.back();
    } catch (err) {
      setError('Erro ao salvar medicamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F3F4F6' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Medicamento</Text>
          <View style={{ width: 24 }} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Card: Informações Básicas */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Info size={16} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
          </View>

          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do medicamento"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Dosagem</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 10mg, 1 comprimido"
            placeholderTextColor="#9CA3AF"
            value={dosage}
            onChangeText={setDosage}
          />
        </View>

        {/* Card: Frequência e Horários */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Frequência e Horários</Text>
          </View>

          <Text style={styles.label}>Frequência por dia</Text>
          <TextInput
            style={[styles.input, { width: 100 }]}
            placeholder="1"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={frequency}
            onChangeText={setFrequency}
          />

          <Text style={styles.label}>Horários *</Text>
          {times.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <TimePicker time={time} onTimeChange={(t: string) => updateTime(index, t)} />
              {times.length > 1 && (
                <TouchableOpacity onPress={() => removeTimeSlot(index)}>
                  <Text style={styles.removeTime}>Remover</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {times.length < 5 && (
            <TouchableOpacity onPress={addTimeSlot}>
              <Text style={styles.addTime}>+ Adicionar horário</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Card: Dias da semana */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dias da semana</Text>
          <View style={styles.daysContainer}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.day, days[day] && styles.dayActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayText, days[day] && styles.dayTextActive]}>
                  {dayAbbreviations[day]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleAddMedication}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>{isLoading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  errorText: {
    color: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  removeTime: {
    color: '#EF4444',
    fontWeight: '500',
  },
  addTime: {
    color: '#4A90E2',
    fontWeight: '500',
    marginBottom: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  dayText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 32,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
