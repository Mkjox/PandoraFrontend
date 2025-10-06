import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { View, Text } from "react-native";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Access Denied. Please log in first.</Text>
            </View>
        );
    }

    return <>{children}</>
};

export default ProtectedRoute;