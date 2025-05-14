import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell, Moon, Users, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Nome do usuário'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'usuario@email.com'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color="#4A90E2" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notificações</Text>
              <Switch
                trackColor={{ false: '#E0E0E0', true: '#AED6F1' }}
                thumbColor={'#4A90E2'}
                value={true}
              />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color="#4A90E2" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Modo escuro</Text>
              <Switch
                trackColor={{ false: '#E0E0E0', true: '#AED6F1' }}
                thumbColor={'#F4F3F4'}
                value={false}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Users size={20} color="#4A90E2" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Equipe de cuidados</Text>
              <ChevronRight size={20} color="#A0A0A0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={20} color="#4A90E2" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Ajuda e suporte</Text>
              <ChevronRight size={20} color="#A0A0A0" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </View>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  editButtonText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#111827',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 24,
  },
});

