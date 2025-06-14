import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import SecurityToolsScreen from '../screens/SecurityToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/subScreens/EditProfileScreen';
import PassDetailsScreen from '../screens/subScreens/data/PassDetailsScreen';
import AddCredentialsScreen from '../screens/subScreens/data/AddCredentialsScreen';
import CustomTabBar from '../components/CustomTabBar';
import SettingsScreen from '../screens/subScreens/SettingsScreen';
import SuggestScreen from '../screens/subScreens/settings/SuggestScreen';
import AccountScreen from '../screens/subScreens/settings/AccountScreen';
import SecurityScreen from '../screens/subScreens/settings/SecurityScreen';
import AutofillScreen from '../screens/subScreens/settings/AutofillScreen';
import SearchScreen from '../screens/subScreens/settings/SearchScreen';
import ActionsScreen from '../screens/subScreens/settings/ActionsScreen';
import HelpScreen from '../screens/subScreens/settings/HelpScreen';
import AdvancedScreen from '../screens/subScreens/settings/AdvancedScreen';
import AboutScreen from '../screens/subScreens/settings/AboutScreen';
import PrivacyScreen from '../screens/subScreens/settings/PrivacyScreen';
import ThemeScreen from '../screens/subScreens/ThemeScreen';
import PasswordGeneratorScreen from '../screens/subScreens/security/PasswordGeneratorScreen';
import EmergencyAccessScreen from '../screens/subScreens/security/EmergencyAccessScreen';
import SecurityChallengeScreen from '../screens/subScreens/security/SecurityChallengeScreen';
import SecurityDashboardScreen from '../screens/subScreens/security/SecurityDashboardScreen';
import TwoFactorScreen from '../screens/subScreens/settings/TwoFactorScreen';
import EditCategoriesScreen from '../screens/subScreens/data/EditCategoriesScreen';
import EditPasswordsScreen from '../screens/subScreens/data/EditPasswordsScreen';
import EditVaultScreen from '../screens/subScreens/data/EditVaultsScreen';
import CategoryDetailsScreen from '../screens/subScreens/data/CategoryDetailsScreen';
import VaultDetailsScreen from '../screens/subScreens/data/VaultDetailsScreen';
import PremiumScreen from '../screens/PremiumScreen';

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
