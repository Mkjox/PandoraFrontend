import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home/HomeScreen';
import CategoryScreen from '../screens/Category/CategoryScreen';
import SecurityToolsScreen from '../screens/Settings/SecurityToolsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import PassDetailsScreen from '../screens/Password/PassDetailsScreen';
import AddCredentialsScreen from '../screens/Password/AddCredentialsScreen';
import CustomTabBar from '../components/CustomTabBar';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import SuggestScreen from '../screens/Settings/SuggestScreen';
import AccountScreen from '../screens/Settings/AccountScreen';
import SecurityScreen from '../screens/Settings/SecurityScreen';
import AutofillScreen from '../screens/Settings/AutofillScreen';
import SearchScreen from '../screens/Settings/SearchScreen';
import ActionsScreen from '../screens/Settings/ActionsScreen';
import HelpScreen from '../screens/Settings/HelpScreen';
import AdvancedScreen from '../screens/Settings/AdvancedScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import PrivacyScreen from '../screens/Settings/PrivacyScreen';
import ThemeScreen from '../screens/Settings/ThemeScreen';
import PasswordGeneratorScreen from '../screens/Settings/PasswordGeneratorScreen';
import EmergencyAccessScreen from '../screens/Settings/EmergencyAccessScreen';
import SecurityChallengeScreen from '../screens/Settings/SecurityChallengeScreen';
import SecurityDashboardScreen from '../screens/Settings/SecurityDashboardScreen';
import TwoFactorScreen from '../screens/Auth/TwoFactorScreen';
import EditCategoriesScreen from '../screens/Category/EditCategoriesScreen';
import EditPasswordsScreen from '../screens/Password/EditPasswordsScreen';
import EditVaultScreen from '../screens/Vault/EditVaultsScreen';
import CategoryDetailsScreen from '../screens/Category/CategoryDetailsScreen';
import VaultDetailsScreen from '../screens/Vault/VaultDetailsScreen';
import PremiumScreen from '../screens/Premium/PremiumScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator initialRouteName='Home' tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Premium' component={PremiumScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Security Tools' component={SecurityToolsScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Tabs' component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name='PassDetails' component={PassDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='CategoryDetails' component={CategoryDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='VaultDetails' component={VaultDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='AddCredentials' component={AddCredentialsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Settings' component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Suggest' component={SuggestScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Account' component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Security' component={SecurityScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Autofill' component={AutofillScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Search' component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Actions' component={ActionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Help' component={HelpScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Advanced' component={AdvancedScreen} options={{ headerShown: false }} />
            <Stack.Screen name='About' component={AboutScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Privacy' component={PrivacyScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ThemeScreen' component={ThemeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='PasswordGenerator' component={PasswordGeneratorScreen} options={{ headerShown: false }} />
            <Stack.Screen name='EmergencyAccess' component={EmergencyAccessScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SecurityChallenge' component={SecurityChallengeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='SecurityDashboard' component={SecurityDashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name='TwoFactor' component={TwoFactorScreen} options={{ headerShown: false }} />
            <Stack.Screen name='EditCategories' component={EditCategoriesScreen} options={{ headerShown: false }} />
            <Stack.Screen name='EditPassword' component={EditPasswordsScreen} options={{ headerShown: false }} />
            <Stack.Screen name='EditVault' component={EditVaultScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
