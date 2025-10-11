import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from 'react-native-modal';

interface CustomModalProps {
    visible: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
    onConfirm,
    onCancel,
}) => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onCancel}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            backdropOpacity={0.4}
        >
            <View style={[styles.modalContainer, themeStyles.card]}>
                <Text style={[styles.title, themeStyles.text]}>{title}</Text>
                <Text style={[styles.message, themeStyles.textGray]}>{message}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                        <Text style={themeStyles.text}>{cancelText}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[
                            styles.confirmButton,
                            destructive && { backgroundColor: '#e53935' }
                        ]}
                    >
                        <Text style={[
                            styles.confirmText,
                            destructive && { color: 'white', fontWeight: '600' }
                        ]}>
                            {confirmText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 14,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    message: {
        marginBottom: 25,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        marginRight: 16,
    },
    confirmButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#1976d2',
    },
    confirmText: {
        color: 'white',
        fontWeight: '500',
    },
});

export default CustomModal;