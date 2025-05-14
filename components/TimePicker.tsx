import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function TimePicker({ time, onTimeChange }) {
  const [showModal, setShowModal] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const [currentHour, currentMinute] = time.split(':');

  const handleTimeSelect = (hour, minute) => {
    const newTime = `${hour}:${minute}`;
    onTimeChange(newTime);
    setShowModal(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.timeButton} onPress={() => setShowModal(true)}>
        <Clock size={18} color="#4A90E2" />
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar horário</Text>

            <View style={styles.timePickers}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hora</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={`hour-${hour}`}
                      style={[styles.timeOption, hour === currentHour && styles.selectedTimeOption]}
                      onPress={() => handleTimeSelect(hour, currentMinute)}
                    >
                      <Text style={[styles.timeOptionText, hour === currentHour && styles.selectedTimeOptionText]}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minuto</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={`minute-${minute}`}
                      style={[styles.timeOption, minute === currentMinute && styles.selectedTimeOption]}
                      onPress={() => handleTimeSelect(currentHour, minute)}
                    >
                      <Text style={[styles.timeOptionText, minute === currentMinute && styles.selectedTimeOptionText]}>
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerScroll: {
    height: 180,
  },
  timeOption: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedTimeOption: {
    backgroundColor: '#EAF4FD',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedTimeOptionText: {
    fontWeight: '700',
    color: '#4A90E2',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
