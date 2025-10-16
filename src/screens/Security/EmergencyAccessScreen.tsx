import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useTheme } from '@context/ThemeContext'
import { darkTheme, lightTheme } from '@assets/colors/theme'
import { useFocusEffect } from '@react-navigation/native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
// import EmergencyAccessService from '@services/EmergencyAccessService'
// import { EmergencyContact } from '.@appTypes/emergency.types'

const { width } = Dimensions.get('window')

interface EmergencyContact {
  id: string
  name: string
  email: string
  delayHours: number
}

const EmergencyAccessScreen: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newDelay, setNewDelay] = useState('24')

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // const res = await EmergencyAccessService.getContacts()
      // if (!res.success) throw new Error(res.message)
      // setContacts(res.data)
      // ** Stubbed: replace with real data fetch **
      setContacts([
        { id: '1', name: 'Alice Smith', email: 'alice@example.com', delayHours: 24 },
        { id: '2', name: 'Bob Johnson', email: 'bob@example.com', delayHours: 48 },
      ])
    } catch (e: any) {
      setError(e.message || 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    fetchContacts()
  }, [fetchContacts]))

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please enter name and email'
      });
    }
    const delay = Number(newDelay)
    if (isNaN(delay) || delay < 1) {
      return (
        Toast.show({
          type: 'error',
          text1: 'Invalid delay',
          text2: 'Please enter a valid number of hours.'
        })
      )
    }
    try {
      // const res = await EmergencyAccessService.addContact({ name: newName, email: newEmail, delayHours: delay })
      // if (!res.success) throw new Error(res.message)
      // setContacts(prev => [res.data, ...prev])
      // ** Stub: generate temporary id **
      setContacts(prev => [
        { id: Date.now().toString(), name: newName, email: newEmail, delayHours: delay },
        ...prev,
      ])
      setModalVisible(false)
      setNewName('')
      setNewEmail('')
      setNewDelay('')
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Failed to add contact'
      })
    }
  }

  const handleRemove = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              // await EmergencyAccessService.removeContact(id)
              setContacts(prev => prev.filter(c => c.id !== id))
            } catch {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Could not remove contact.'
              });
            }
          },
        },
      ]
    )
  }

  const renderItem = ({ item }: { item: EmergencyContact }) => (
    <View style={[styles.card, theme.styles.card]}>
      <View style={styles.cardText}>
        <Text style={[styles.name, theme.styles.text]}>{item.name}</Text>
        <Text style={[styles.email, theme.styles.textGray]}>
          {item.email}
        </Text>
        <Text style={[styles.delay, theme.styles.text]}>
          Delay: {item.delayHours} hour{item.delayHours > 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <AntDesign name="delete" size={20} color={theme.styles.iconColor.color} />
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={[theme.styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={[styles.container, theme.styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme.styles.text]}>Emergency Access</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="add-circle-outline"
            size={28}
            color={theme.styles.iconColor.color}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={[styles.error, theme.styles.text]}>{error}</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={c => c.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Contact Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, theme.styles.card]}>
            <Text style={[styles.modalTitle, theme.styles.text]}>
              Add Contact
            </Text>
            <TextInput
              style={[styles.input, theme.styles.card]}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={[styles.input, theme.styles.card]}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <TextInput
              style={[styles.input, theme.styles.card]}
              placeholder="Delay hours"
              keyboardType="number-pad"
              value={newDelay}
              onChangeText={setNewDelay}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, theme.styles.button]}
                onPress={handleAdd}
              >
                <Text style={theme.styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={theme.styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight,
    marginHorizontal: width * 0.05,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },

  list: {
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  cardText: { flex: 1 },
  name: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  email: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginVertical: 2,
  },
  delay: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    padding: 16,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelBtn: {
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
})

export default EmergencyAccessScreen