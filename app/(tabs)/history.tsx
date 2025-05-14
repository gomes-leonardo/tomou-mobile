import { SetStateAction, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useMedications } from '../../lib/medications';
import MedicationList from '../../components/MedicationList';
import { formatDate } from '../../utils/dateUtils';

export default function HistoryScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const { getMedicationsByDate, getMarkedDates } = useMedications();
  const medications = getMedicationsByDate(selectedDate);
  const markedDates = getMarkedDates();

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Medicamentos</Text>
      </View>

      {/* Calendário */}
      <View style={styles.calendarWrapper}>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#F3F4F6',
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#6B7280',
            selectedDayBackgroundColor: '#4A90E2',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#4A90E2',
            dayTextColor: '#111827',
            textDisabledColor: '#D1D5DB',
            dotColor: '#4A90E2',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#4A90E2',
            monthTextColor: '#111827',
            indicatorColor: '#4A90E2',
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              selectedColor: '#4A90E2',
              ...markedDates[selectedDate],
            },
          }}
          onDayPress={(day: { dateString: SetStateAction<string> }) => {
            setSelectedDate(day.dateString);
          }}
          enableSwipeMonths={true}
        />
      </View>

      {/* Data selecionada */}
      <View style={styles.dateHeaderCard}>
        <Text style={styles.dateHeaderText}>{formatDate(new Date(selectedDate))}</Text>
      </View>

      {/* Lista ou vazio */}
      <ScrollView style={styles.medicationsContainer}>
        {medications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum medicamento neste dia</Text>
          </View>
        ) : (
          <MedicationList medications={medications} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  calendarWrapper: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 16,
  },
  dateHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  medicationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
