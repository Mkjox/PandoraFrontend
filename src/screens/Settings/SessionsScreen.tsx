import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AuthService from '@services/AuthService';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import CustomCard from '@components/CustomCard';

const { width, height } = Dimensions.get("window");

const SessionsScreen = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const [sessions, setSessions] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            const result = await AuthService.getSessions();
            if (result.success && result.data) {
                setSessions(result.data);
                setMessage(result.message);
            } else {
                setMessage(result.message);
            }
        };
        fetchSessions();
    }, []);

    return (
        <ScrollView contentContainerStyle={[styles.container, theme.styles.container, StyleSheet.absoluteFill]}>
            <Text style={[styles.title, theme.styles.text]}>Active Sessions</Text>

            {sessions.length > 0 ? (
                sessions.map((session, index) => (
                    <CustomCard key={index} style={[styles.sessionCard, theme.styles.card]} onPress={() => {}}>
                        <Text style={styles.dataText}>Id: {session.id}</Text>
                        <Text style={styles.dataText}>IP: {session.ipAddress}</Text>
                        <Text style={styles.dataText}>User Agent: {session.userAgent}</Text>
                        <Text style={styles.dataText}>Created: {new Date(session.createdAt).toLocaleString()}</Text>
                        <Text style={styles.dataText}>Expires: {new Date(session.expiresAt).toLocaleString()}</Text>
                        <Text style={styles.dataText}>Current: {session.isCurrentSession ? 'Yes' : 'No'}</Text>
                    </CustomCard>
                ))
            ) : (
                <View>
                    <Text style={[styles.message, theme.styles.textGray]}>{message}</Text>
                    <Text style={styles.empty}>No active sessions found.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
    },
    message: {
        color: '#666',
        marginBottom: 10,
    },
    sessionCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 3
    },
    empty: {
        color: '#888',
        marginTop: 20,
        textAlign: 'center',
    },
    dataText: {
        marginVertical: height * 0.0001,
        fontFamily: 'Poppins_500Medium',
        // fontWeight: '700'
    }
});

export default SessionsScreen;
