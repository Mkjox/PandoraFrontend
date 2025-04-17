import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';

const { width, height } = Dimensions.get('window');

const AddCredentialsScreen = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [selectedTab, setSelectedTab] = useState<'password' | 'vault' | 'category'>('password');

  const [form, setForm] = useState<any>({
    UserId: '',
    SiteName: '',
    UsernameOrEmail: '',
    Password: '',
    PasswordRepeat: '',
    Notes: '',
    PasswordExpirationDate: '',
    CategoryId: '',

    Title: '',
    Content: '',
    Url: '',
    MediaFile: '',
    Summary: '',
    Tags: '',
    IsLocked: false,
    UnlockDate: '',
    ExpirationDate: '',
    IsFavorite: false,

    Name: '',
    Description: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderPasswordForm = () => (
    <>
      {/* <TextInput placeholder="UserId" style={styles.input} onChangeText={v => handleChange('UserId', v)} /> */}
      <TextInput placeholder="Site Name" style={styles.input} onChangeText={v => handleChange('SiteName', v)} />
      <TextInput placeholder="Username or Email" style={styles.input} onChangeText={v => handleChange('UsernameOrEmail', v)} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={v => handleChange('Password', v)} />
      <TextInput placeholder="Repeat Password" secureTextEntry style={styles.input} onChangeText={v => handleChange('PasswordRepeat', v)} />
      <TextInput placeholder="Notes (encrypted)" style={styles.input} onChangeText={v => handleChange('Notes', v)} />
      <TextInput placeholder="Password Expiration Date" style={styles.input} onChangeText={v => handleChange('PasswordExpirationDate', v)} />
      {/* <TextInput placeholder="CategoryId" style={styles.input} onChangeText={v => handleChange('CategoryId', v)} /> */}
    </>
  );

  const renderVaultForm = () => (
    <>
      {/* <TextInput placeholder="UserId" style={styles.input} onChangeText={v => handleChange('UserId', v)} /> */}
      <TextInput placeholder="Title" style={styles.input} onChangeText={v => handleChange('Title', v)} />
      <TextInput placeholder="Content" style={styles.input} onChangeText={v => handleChange('Content', v)} />
      <TextInput placeholder="URL" style={styles.input} onChangeText={v => handleChange('Url', v)} />
      <TextInput placeholder="Media File" style={styles.input} onChangeText={v => handleChange('MediaFile', v)} />
      <TextInput placeholder="Summary" style={styles.input} onChangeText={v => handleChange('Summary', v)} />
      <TextInput placeholder="Tags (comma separated)" style={styles.input} onChangeText={v => handleChange('Tags', v)} />
      <TextInput placeholder="Unlock Date" style={styles.input} onChangeText={v => handleChange('UnlockDate', v)} />
      <TextInput placeholder="Expiration Date" style={styles.input} onChangeText={v => handleChange('ExpirationDate', v)} />
      {/* <TextInput placeholder="CategoryId" style={styles.input} onChangeText={v => handleChange('CategoryId', v)} /> */}
    </>
  );

  const renderCategoryForm = () => (
    <>
      {/* <TextInput placeholder="UserId" style={styles.input} onChangeText={v => handleChange('UserId', v)} /> */}
      <TextInput placeholder="Name" style={styles.input} onChangeText={v => handleChange('Name', v)} />
      <TextInput placeholder="Description" style={styles.input} onChangeText={v => handleChange('Description', v)} />
    </>
  );

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('password')} style={[styles.tab, selectedTab === 'password' && styles.activeTab]}>
          <Text>Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('vault')} style={[styles.tab, selectedTab === 'vault' && styles.activeTab]}>
          <Text>Vault</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('category')} style={[styles.tab, selectedTab === 'category' && styles.activeTab]}>
          <Text>Category</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {selectedTab === 'password' && renderPasswordForm()}
        {selectedTab === 'vault' && renderVaultForm()}
        {selectedTab === 'category' && renderCategoryForm()}
      </View>

      <TouchableOpacity style={[styles.submitButton, themeStyles.button]}>
        <Text style={[themeStyles.buttonText, styles.buttonText]}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    marginTop: StatusBar.currentHeight,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6E7FEC',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default AddCredentialsScreen;
