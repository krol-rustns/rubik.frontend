import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LogOut, User, Settings, HelpCircle, Bell, Shield, FileText } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const confirmLogout = () => {
    signOut();
    setIsModalVisible(false); // Close the modal after logout
  };

  const cancelLogout = () => {
    setIsModalVisible(false); // Just close the modal without logging out
  };

  const menuItems = [
    {
      icon: <User size={20} color="#666" />,
      title: 'Meus Dados',
      onPress: () => Alert.alert('Funcionalidade', 'Meus Dados'),
    },
    {
      icon: <Settings size={20} color="#666" />,
      title: 'Configurações',
      onPress: () => Alert.alert('Funcionalidade', 'Configurações'),
    },
    {
      icon: <Bell size={20} color="#666" />,
      title: 'Notificações',
      onPress: () => Alert.alert('Funcionalidade', 'Notificações'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.nome.charAt(0) || 'U'}</Text>
        </View>
        
        <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'usuario@exemplo.com'}</Text>
        
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => Alert.alert('Funcionalidade', 'Editar Perfil')}
        >
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={item.onPress}
              >
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
              
              {index < menuItems.length - 1 && (
                <View style={styles.menuDivider} />
              )}
            </React.Fragment>
          ))}
        </Card>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#C1272D" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Rubik v1.0.0</Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={cancelLogout} // Close modal if user taps outside
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Sim</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>Não</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: '#C1272D',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Rubik_500Medium',
    color: '#C1272D',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Rubik_500Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EEE',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#C1272D',
    marginLeft: 8,
    fontFamily: 'Rubik_500Medium',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#C1272D',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});