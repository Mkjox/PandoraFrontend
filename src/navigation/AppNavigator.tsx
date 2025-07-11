import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ActivityIndicator, View } from "react-native";
// import WelcomeScreen from "../screens/Home/WelcomeScreen";
// import { NavigationContainer } from "@react-navigation/native";
// import { useFirstLaunch } from "../hooks/useFirstLaunch";

export default function AppNavigator() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
//    const firstLaunch = useFirstLaunch()


    // if (firstLaunch === null) {
        // return (
            // <View style={{
            //     flex: 1,
            //     justifyContent: 'center',
            //     alignItems: 'center'
            // }}>
            //     <ActivityIndicator size="large" />
            // </View>
            // null
        // )
    // }

    return (
        isAuthenticated ? <MainNavigator /> : <AuthNavigator />
        // <NavigationContainer>
            //{/* {firstLaunch */}
                // ? <WelcomeScreen />
                // : isAuthenticated
                    // ? <MainNavigator />
                    // : <AuthNavigator />}
        //{/* </NavigationContainer> */}
    )
}