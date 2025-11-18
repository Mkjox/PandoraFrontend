import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    Platform,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";

export interface PickerItem {
    label: string;
    value: string | number;
}

interface CustomPickerProps {
    value: string | number | null;
    onChange: (v: string | number) => void;
    items: PickerItem[];
    placeholder?: string;
    style?: object | object[];
}

const CustomPicker: React.FC<CustomPickerProps> = ({
    value,
    onChange,
    items,
    placeholder = "Select",
    style,
}) => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const [open, setOpen] = useState(false);

    const selectedLabel =
        items.find((i) => i.value === value)?.label || placeholder;

    const isPlaceholder = selectedLabel === placeholder;

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                android_ripple={
                    isDark
                        ? { color: "rgba(255,255,255,0.06)" }
                        : { color: "rgba(0,0,0,0.06)", borderless: false }
                }
                style={({ pressed }) => [
                    styles.card,
                    theme.styles.card,
                    style,
                    pressed && { opacity: Platform.OS === "ios" ? 0.6 : 1 },
                ]}
            >
                <View>
                    <Text
                        style={{
                            color: isPlaceholder
                                ? theme.styles.pickerPlaceholderColor.color
                                : theme.colors.text,
                            fontSize: 16,
                        }}
                    >
                        {selectedLabel}
                    </Text>
                </View>
            </Pressable>

            <Modal visible={open} transparent animationType="fade">
                <Pressable
                    style={styles.backdrop}
                    onPress={() => setOpen(false)}
                >
                    <View
                        style={[
                            styles.modalBox,
                            { backgroundColor: theme.colors.card },
                            theme.styles.card, theme.styles.border
                        ]}
                    >
                        {items.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                onPress={() => {
                                    onChange(item.value);
                                    setOpen(false);
                                }}
                                style={[styles.item,
                                item !== items[items.length - 1] && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.styles.border.borderColor,
                                    marginVertical: 4
                                },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        fontSize: 16,
                                    }}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
    },
    modalBox: {
        margin: 30,
        borderRadius: 10,
        padding: 20,
    },
    item: {
        paddingVertical: 12,
    },
});

export default CustomPicker;
