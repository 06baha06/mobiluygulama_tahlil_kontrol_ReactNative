// components/UserCard.js
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserCard = ({ patient }) => {
  const immunoglobulins = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4']

  const calculateAge = (birthDate) => {
    try {
      const [day, month, year] = birthDate.split('.')
      const birth = new Date(year, month - 1, day)
      const today = new Date()

      let years = today.getFullYear() - birth.getFullYear()
      let months = today.getMonth() - birth.getMonth()

      if (months < 0) {
        years--
        months += 12
      }

      const totalMonths = (years * 12) + months

      if (years === 0) {
        return `${totalMonths} aylık`
      } else {
        return `${years}   (${totalMonths} aylık)`
      }
    } catch (error) {
      return "Geçersiz tarih"
    }
  }

  return (
    <View style={styles.userCard}>
      <View style={styles.headerInfo}>
        <View style={styles.basicInfo}>
          <Text>Adı soyadı: {patient.AdiSoyadi}</Text>
          <Text>Doğum Tarihi: {patient.DogumTarihi}</Text>
          <Text>Yaş: {calculateAge(patient.DogumTarihi)}</Text>
        </View>
        <Text style={styles.dateText}>
          Eklenme:{'\n'}{patient.eklemeTarihi || 'Belirtilmemiş'}
        </Text>
      </View>
      
      <View style={styles.igContainer}>
        {immunoglobulins.map((ig) => (
          <View key={ig} style={styles.igItem}>
            <Text style={styles.igText}>
              {ig}: {patient[ig] ? `${patient[ig]} g/L` : 'Belirtilmemiş'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default UserCard

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  basicInfo: {
    flex: 1,
    marginRight: 10,
  },
  dateText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
    width: 100,
  },
  igContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 5,
  },
  igItem: {
    width: '50%',
    paddingVertical: 2,
  },
  igText: {
    fontSize: 13,
  }
})