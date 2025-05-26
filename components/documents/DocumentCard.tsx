import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { File, Download, Trash2 } from 'lucide-react-native';
import { Document } from '../../types';
import Card from '../ui/Card';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDelete: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getIconColor = () => {
    switch (document.type) {
      case 'Contract':
        return '#4CAF50';
      case 'Deed':
        return '#2196F3';
      case 'Certificate':
        return '#FFC107';
      case 'Insurance':
        return '#9C27B0';
      default:
        return '#607D8B';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <File size={24} color={getIconColor()} />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.name} numberOfLines={1}>{document.name}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.type}>{document.type}</Text>
            <Text style={styles.date}>{formatDate(document.uploadDate)}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onView(document)}
          >
            <Download size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onDelete(document)}
          >
            <Trash2 size={20} color="#C1272D" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default DocumentCard;