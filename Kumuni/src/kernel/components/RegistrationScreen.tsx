import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import KernelBridge from '../../shared/api/KernelBridge';

import SDUIIcon from './sdui/components/SDUIIcon';

const { width } = Dimensions.get('window');

interface RegistrationScreenProps {
    onBack: () => void;
    onSendOTP: (mobileNumber: string) => void;
    onHelp?: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onBack, onSendOTP, onHelp }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [mobileNumber, setMobileNumber] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Simulate mobile number auto-detection
    useEffect(() => {
        const detectPhoneNumber = async () => {
            try {
                // In a real app, this would use a native bridge/SIM module
                // Here we fetch from our mock endpoint
                const response = await KernelBridge.makeSecureRequest({
                    moduleId: 'shell',
                    endpoint: '/device/identity',
                    method: 'GET',
                    clientType: 'tenant'
                });

                if (response.success && response.data.phoneNumber) {
                    setMobileNumber(response.data.phoneNumber);
                }
            } catch (err) {
                console.error('Failed to auto-detect phone number:', err);
            }
        };

        detectPhoneNumber();
    }, []);

    const isValid = mobileNumber.length >= 10;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Top Navigation */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onHelp}
                        style={styles.iconBtn}
                    >
                        <View style={styles.helpBubble}>
                            <Text style={styles.helpText}>?</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Logo Area */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoRow}>
                            <View style={styles.logoIcon}>
                                <SDUIIcon data={{ props: { name: 'reg_logomark', size: 40, color: '#000' } }} />
                            </View>
                            <Text style={styles.logoText}>Kumuni</Text>
                        </View>
                    </View>

                    {/* Heading Area */}
                    <View style={styles.headingArea}>
                        <Text style={styles.title}>Enter your mobile number</Text>
                        <Text style={styles.subtitle}>
                            We'll send you a one-time password (OTP) to your mobile number
                        </Text>
                    </View>

                    {/* Input Area */}
                    <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
                        <Text style={styles.countryCode}>(+63)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="987-654-3210"
                            placeholderTextColor="#C7C7CD"
                            keyboardType="phone-pad"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            maxLength={13} // Adjust as needed
                            autoFocus
                        />
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[
                            styles.sendBtn,
                            isValid ? { backgroundColor: theme.colors.primary } : styles.btnDisabled
                        ]}
                        onPress={() => isValid && onSendOTP(mobileNumber)}
                        disabled={!isValid}
                    >
                        <Text style={[styles.sendBtnText, !isValid && { color: '#BDBDBD' }]}>
                            Send OTP
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 100,
    },
    iconBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrow: {
        fontSize: 28,
        color: '#000',
        fontWeight: '300',
    },
    helpBubble: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        paddingHorizontal: 30,
        alignItems: 'center',
        paddingBottom: 40,
    },
    scrollContent: {
        flexGrow: 1,
    },
    logoContainer: {
        marginTop: 20,
        marginBottom: 80,
        alignItems: 'center',
        width: '100%',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        letterSpacing: -0.5,
    },
    headingArea: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
        fontWeight: '400',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 15,
        marginBottom: 40,
    },
    inputFocused: {
        // Optional boundary highlight
    },
    countryCode: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginRight: 10,
    },
    input: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    sendBtn: {
        width: '100%',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00ff5e',
    },
    btnDisabled: {
        backgroundColor: '#F2F2F7',
    },
    sendBtnText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
    },
});

export default RegistrationScreen;
