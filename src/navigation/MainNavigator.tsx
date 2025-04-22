import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import PersonalVaultScreen from '../screens/PersonalVaultScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PassDetailsScreen from '../screens/PassDetailsScreen';
import AddCredentialsScreen from '../screens/AddCredentialsScreen';
import CustomTabBar from '../components/CustomTabBar';
import SettingsScreen from '../screens/SettingsScreen';
import SuggestScreen from '../screens/subScreens/SuggestScreen';
import AccountScreen from '../screens/subScreens/AccountScreen';
import SecurityScreen from '../screens/subScreens/SecurityScreen';
import AutofillScreen from '../screens/subScreens/AutofillScreen';
import SearchScreen from '../screens/subScreens/SearchScreen';
import ActionsScreen from '../screens/subScreens/ActionsScreen';
import HelpScreen from '../screens/subScreens/HelpScreen';
import AdvancedScreen from '../screens/subScreens/AdvancedScreen';
import AboutScreen from '../screens/subScreens/AboutScreen';
import PrivacyScreen from '../screens/subScreens/PrivacyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator initialRouteName='Home' tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Category' component={CategoryScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Personal' component={PersonalVaultScreen} options={{ headerShown: false }} />
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
        </Stack.Navigator>
    );
}
