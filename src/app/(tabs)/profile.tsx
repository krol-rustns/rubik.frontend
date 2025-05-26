import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { LogOut, User, Settings, HelpCircle, Bell, Shield, FileText } from 'lucide-react-native';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
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
    {
      icon: <Shield size={20} color="#666" />,
      title: 'Privacidade e Segurança',
      onPress: () => Alert.alert('Funcionalidade', 'Privacidade e Segurança'),
    },
    {
      icon: <FileText size={20} color="#666" />,
      title: 'Termos de Uso',
      onPress: () => Alert.alert('Funcionalidade', 'Termos de Uso'),
    },
    {
      icon: <HelpCircle size={20} color="#666" />,
      title: 'Ajuda e Suporte',
      onPress: () => Alert.alert('Funcionalidade', 'Ajuda e Suporte'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name.charAt(0) || 'U'}</Text>
        </View>
        
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
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
        
        <Text style={styles.versionText}>ImobiGestor v1.0.0</Text>
      </View>
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
});