import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
dateText: {
  fontSize: 14,
  color: '#9CA3AF',
  fontWeight: '500',
  textTransform: 'capitalize',
},
  iconButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  question: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  responseButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  buttonOutline: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonFill: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  buttonFillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  nextMedCard: {
    padding: 16,
    backgroundColor: '#EAF4FD',
    borderRadius: 12,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  medTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  noMedText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4A90E2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
