import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ThemeScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={[styles.container, theme.styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.styles.icon.color} />
          <Text style={[styles.headerText, theme.styles.text]}>Display & Theme</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.listWrapper, theme.styles.card, theme.styles.border]}>
        <List.Section>
          <List.Subheader style={[styles.subheader, theme.styles.text]}>Appearance</List.Subheader>

          <View style={styles.listInnerWrapper}>
            <List.Item
              title="Dark Mode"
              titleStyle={theme.styles.text}
              description={isDark ? 'Enabled' : 'Disabled'}
              descriptionStyle={theme.styles.text}
              left={props => (
                <List.Icon
                  {...props}
                  icon={() => <Icon name="dark-mode" size={24} color={theme.styles.icon.color} />}
                />
              )}
              right={props => (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                />
              )}
              style={theme.styles.card}
            />

            <List.Item
              title="Theme Color"
              titleStyle={theme.styles.text}
              left={props => (
                <List.Icon
                  {...props}
                  icon={() => <Icon name="palette" size={24} color={theme.styles.icon.color} />}
                />
              )}
              right={props => (
                <List.Icon {...props} icon="chevron-right" color={theme.styles.icon.color as string} />
              )}
              onPress={() => navigation.navigate('ThemeColor' as never)}
              style={theme.styles.card}
            />
          </View>
        </List.Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  listWrapper: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    paddingVertical: 4,
  },
  listInnerWrapper: {
    paddingHorizontal: 5
  },
  subheader: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 8,
  },
});

export default ThemeScreen;