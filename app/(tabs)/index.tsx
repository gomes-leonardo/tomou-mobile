import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Bell } from 'lucide-react-native';
import MedicationList from '../../components/MedicationList';
import { useMedications } from '../../lib/medications';
import { formatDate } from '../../utils/dateUtils';
import { styles } from './styles/styles';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { medications, loading, error, refreshMedications } = useMedications();
  const today = new Date();
  const formattedDate = formatDate(today);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshMedications();
    setRefreshing(false);
  };

  const pendingMeds = medications.filter(med => med.status === 'Pending');
  const takenMeds = medications.filter(med => med.status === 'Taken');
  const missedMeds = medications.filter(med => med.status === 'Missed');

  const totalMeds = medications.length;
  const completedMeds = takenMeds.length;
  const progress = totalMeds > 0 ? (completedMeds / totalMeds) * 100 : 0;

  const getNextMedication = () => {
    if (pendingMeds.length === 0) return null;
    return pendingMeds[0];
  };

  const nextMed = getNextMedication();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#4A90E2" />
          {pendingMeds.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{pendingMeds.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Olá, Marcelo</Text>
        <Text style={styles.question}>Você tomou seus medicamentos hoje?</Text>

        <View style={styles.responseButtons}>
          <TouchableOpacity style={styles.buttonOutline}><Text style={styles.buttonText}>Sim</Text></TouchableOpacity>
          <TouchableOpacity style={styles.buttonFill}><Text style={styles.buttonFillText}>Não</Text></TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Próximo Medicamento</Text>
          {nextMed ? (
            <TouchableOpacity onPress={() => router.push(`/medication/${nextMed.id}`)}>
              <View style={styles.nextMedCard}>
                <Text style={styles.medName}>{nextMed.name}</Text>
                <Text style={styles.medTime}>{nextMed.times[0]}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMedText}>Nenhum medicamento pendente.</Text>
          )}
        </View>

        {pendingMeds.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pendentes</Text>
            <MedicationList medications={pendingMeds} />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/add')}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
