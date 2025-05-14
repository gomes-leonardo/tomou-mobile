import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useMedications } from '../../lib/medications';
import MedicationList from '../../components/MedicationList';
import { formatDate } from '../../utils/dateUtils';

export default function HistoryScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const { getMedicationsByDate } = useMedications();
  const medications = getMedicationsByDate(selectedDate);

  // Generate marked dates
  const { getMarkedDates } = useMedications();
  const markedDates = getMarkedDates();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medication History</Text>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#666666',
          selectedDayBackgroundColor: '#4A90E2',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#4A90E2',
          dayTextColor: '#333333',
          textDisabledColor: '#D9E1E8',
          dotColor: '#4A90E2',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#4A90E2',
          monthTextColor: '#333333',
          indicatorColor: '#4A90E2',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: '#4A90E2',
            ...markedDates[selectedDate]
          }
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        enableSwipeMonths={true}
      />
      
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateHeader}>{formatDate(new Date(selectedDate))}</Text>
      </View>
      
      <ScrollView style={styles.medicationsContainer}>
        {medications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medications for this date</Text>
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
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  dateHeaderContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  medicationsContainer: {
    flex: 1,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});