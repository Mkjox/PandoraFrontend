import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '@screens/Home/HomeScreen';
import CategoryScreen from '@screens/Category/CategoryScreen';
import SecurityToolsScreen from '@screens/Security/SecurityToolsScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';
import EditProfileScreen from '@screens/Profile/EditProfileScreen';
import PassDetailsScreen from '@screens/Password/PassDetailsScreen';
import AddCredentialsScreen from '@screens/Password/AddCredentialsScreen';
import CustomTabBar from '@components/CustomTabBar';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import SuggestScreen from '@screens/Settings/SuggestScreen';
import AccountScreen from '@screens/Settings/AccountScreen';
import SecurityScreen from '@screens/Settings/SecurityScreen';
// import AutofillScreen from '@screens/Settings/AutofillScreen';
import SearchScreen from '@screens/Settings/SearchScreen';
import ActionsScreen from '@screens/Settings/ActionsScreen';
import HelpScreen from '@screens/Settings/HelpScreen';
// import AdvancedScreen from '@screens/Settings/AdvancedScreen';
import AboutScreen from '@screens/Settings/AboutScreen';
import PrivacyScreen from '@screens/Settings/PrivacyScreen';
import ThemeScreen from '@screens/Settings/ThemeScreen';
import PasswordGeneratorScreen from '@screens/Security/PasswordGeneratorScreen';
// import EmergencyAccessScreen from '@screens/Security/EmergencyAccessScreen';
import SecurityChallengeScreen from '@screens/Security/SecurityChallengeScreen';
import SecurityDashboardScreen from '@screens/Security/SecurityDashboardScreen';
import EditCategoriesScreen from '@screens/Category/EditCategoriesScreen';
import EditPasswordsScreen from '@screens/Password/EditPasswordsScreen';
import EditVaultScreen from '@screens/Vault/EditVaultsScreen';
import CategoryDetailsScreen from '@screens/Category/CategoryDetailsScreen';
import VaultDetailsScreen from '@screens/Vault/VaultDetailsScreen';
// import PremiumScreen from '@screens/Premium/PremiumScreen';
import IdentitiesScreen from '@screens/Identity/IdentitiesScreen';
import IdentityDetailsScreen from '@screens/Identity/IdentityDetailsScreen';
import EditIdentityScreen from '@screens/Identity/EditIdentityScreen';
import ThemeColorScreen from '@screens/Settings/ThemeColorScreen';
import SessionsScreen from '@screens/Settings/SessionsScreen';
import TwoFactorScreen from '@screens/Settings/TwoFactorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator initialRouteName='Home' tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name='Home' component={HomeScreen} />
            {/* <Tab.Screen name='Premium' component={PremiumScreen} /> */}
            <Tab.Screen name='Security Tools' component={SecurityToolsScreen} />
            <Tab.Screen name='Profile' component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Tabs' component={TabNavigator} />
            <Stack.Screen name='Categories' component={CategoryScreen} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} />
            <Stack.Screen name='PassDetails' component={PassDetailsScreen} />
            <Stack.Screen name='CategoryDetails' component={CategoryDetailsScreen} />
            <Stack.Screen name='VaultDetails' component={VaultDetailsScreen} />
            <Stack.Screen name='AddCredentials' component={AddCredentialsScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='Suggest' component={SuggestScreen} />
            <Stack.Screen name='Account' component={AccountScreen} />
            <Stack.Screen name='Security' component={SecurityScreen} />
            {/* <Stack.Screen name='Autofill' component={AutofillScreen} /> */}
            <Stack.Screen name='Search' component={SearchScreen} />
            <Stack.Screen name='Actions' component={ActionsScreen} />
            <Stack.Screen name='Help' component={HelpScreen} />
            {/* <Stack.Screen name='Advanced' component={AdvancedScreen} /> */}
            <Stack.Screen name='About' component={AboutScreen} />
            <Stack.Screen name='Privacy' component={PrivacyScreen} />
            <Stack.Screen name='ThemeScreen' component={ThemeScreen} />
            <Stack.Screen name='PasswordGenerator' component={PasswordGeneratorScreen} />
            {/* <Stack.Screen name='EmergencyAccess' component={EmergencyAccessScreen} /> */}
            <Stack.Screen name='SecurityChallenge' component={SecurityChallengeScreen} />
            <Stack.Screen name='SecurityDashboard' component={SecurityDashboardScreen} />
            <Stack.Screen name='EditCategory' component={EditCategoriesScreen} />
            <Stack.Screen name='EditPassword' component={EditPasswordsScreen} />
            <Stack.Screen name='EditVault' component={EditVaultScreen} />
            <Stack.Screen name="Identities" component={IdentitiesScreen} />
            <Stack.Screen name="IdentityDetails" component={IdentityDetailsScreen} />
            <Stack.Screen name="EditIdentity" component={EditIdentityScreen} />
            <Stack.Screen name="ThemeColor" component={ThemeColorScreen} />
            <Stack.Screen name='Sessions' component={SessionsScreen} />
            <Stack.Screen name='TwoFactor' component={TwoFactorScreen} />
        </Stack.Navigator>
    );
}
