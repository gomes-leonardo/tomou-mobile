import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useMedications } from '../../lib/medications';
import TimePicker from '../../components/TimePicker';

export default function AddMedicationScreen() {
  type WeekDay =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

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
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const addTimeSlot = () => {
    if (times.length < 5) {
      setTimes([...times, '12:00']);
    }
  };

  const removeTimeSlot = (index: number) => {
    if (times.length > 1) {
      const newTimes = [...times];
      newTimes.splice(index, 1);
      setTimes(newTimes);
    }
  };

  const updateTime = (index: number, time: string) => {
    const newTimes = [...times];
    newTimes[index] = time;
    setTimes(newTimes);
  };

  const handleAddMedication = async () => {
    if (!name) {
      setError('Medication name is required');
      return;
    }

    if (times.length === 0) {
      setError('At least one time is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addMedication({
        name,
        dosage: dosage || 'Not specified',
        frequency: parseInt(frequency, 10),
        times,
        days,
      });
      router.back();
    } catch (err) {
      setError('Failed to add medication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Medicamento</Text>
          <View style={{ width: 24 }} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formContainer}>
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

          <Text style={styles.label}>Frequência por dia</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantas vezes por dia?"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={frequency}
            onChangeText={setFrequency}
          />

          <Text style={styles.label}>Horários *</Text>
          {times.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <TimePicker time={time} onTimeChange={(newTime: string) => updateTime(index, newTime)} />
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

          <Text style={styles.label}>Dias da semana</Text>
          <View style={styles.daysContainer}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.day, days[day] && styles.dayActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayText, days[day] && styles.dayTextActive]}>
                  {day.charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  input: {
    backgroundColor: '#F9FAFB',
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
    marginBottom: 24,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  dayActive: {
    backgroundColor: '#4A90E2',
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
