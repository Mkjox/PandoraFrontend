import CustomSpinner from "@components/CustomSpinner";
import { useRoute } from "@react-navigation/native";
import AuthService from "@services/AuthService";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function VerifyEmailScreen() {
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const run = async () => {
            try {
                const token = (route.params as any)?.token;
                if (!token) throw new Error('No token found in link.');

                const res = await AuthService.verifyEmail(token);

                if (res.success) {
                    setMessage('Your email has been verified successfully!');
                }
                else {
                    setMessage(res.message || 'Verification failed.');
                }
            }
            catch (e: any) {
                setMessage(e.message || 'Error verifying email.');
            }
            finally {
                setLoading(false);
            }
        };

        run();
    }, [route.params]);

    if (loading)
        return (
            <CustomSpinner />
        );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{message}</Text>
        </View>
    );
}