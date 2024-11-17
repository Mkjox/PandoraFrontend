import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const themeStyles = isDark ? darkTheme : lightTheme;

  const SIZE = 18;

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.topSection}>
        <Text style={[themeStyles.text, styles.title]}>Vault</Text>
        <View>
          <TouchableOpacity style={[styles.plusButton, themeStyles.button]}>
            <AntDesign name='plus' size={20} style={styles.plusButtonIcon} color='white' />
            <Text style={[themeStyles.text, styles.topSectionText]}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Searchbar
        placeholder='Search'
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.categoryWrapper}>
        <View style={{ elevation: 10 }}>
          <TouchableOpacity style={[themeStyles.button, styles.categoryInnerWrapper]}>
            <FontAwesome5 name='compress-arrows-alt' style={[themeStyles.buttonText,styles.categoryIcon]} size={SIZE} />
            <Text style={[themeStyles.buttonText,styles.categoryName]}>CategoryName</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[themeStyles.button, styles.categoryInnerWrapper]}>
          <AntDesign name='lock' style={[themeStyles.buttonText,styles.categoryIcon]} size={SIZE} />
          <Text style={[themeStyles.buttonText,styles.categoryName]}>CategoryName</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[themeStyles.button, styles.categoryInnerWrapper]}>
          <FontAwesome5 name='compress-arrows-alt' style={[themeStyles.buttonText,styles.categoryIcon]} size={SIZE} />
          <Text style={[themeStyles.buttonText,styles.categoryName]}>CategoryName</Text>
        </TouchableOpacity>
      </View>


      {/* This is gonna be Card section below */}
      {/* <ScrollView horizontal style={{height: height * 0.4}}>

      </ScrollView> */}

      {/* Bottom Section */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.08,
    marginTop: StatusBar.currentHeight
  },
  plusButton: {
    flexDirection: 'row',
    height: 45,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  plusButtonIcon: {
    marginLeft: 5
  },
  topSectionText: {
    textAlign: 'center',
    marginRight: '15%',
    flex: 1,
    fontSize: 18,
    color: 'white'
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginTop: height * 0.01
  },
  searchBar: {
    marginHorizontal: width * 0.07,
    marginTop: height * 0.02,
    borderRadius: 10
  },
  categoryWrapper: {
    marginLeft: width * 0.035,
    flexDirection: 'row',
  },
  categoryInnerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: StyleSheet.absoluteFill,
    height: height * 0.04,
    marginTop: height * 0.019,
    marginLeft: width * 0.035,
    alignItems: 'center',
    borderRadius: 5
  },
  categoryIcon: {
    marginHorizontal: 5
  },
  categoryName: {
    marginRight: 5
  },
})

export default HomeScreen