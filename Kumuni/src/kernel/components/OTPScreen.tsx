import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';

const { width } = Dimensions.get('window');

interface OTPScreenProps {
    mobileNumber: string;
    onBack: () => void;
    onVerify: (otp: string) => void;
    onResend: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ mobileNumber, onBack, onVerify, onResend }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value.length > 0 && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // If all digits are filled, auto-verify
        if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
            onVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                inputs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
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
                </View>

                <View style={styles.content}>
                    <View style={styles.headingArea}>
                        <Text style={styles.title}>Enter the OTP</Text>
                        <Text style={styles.subtitle}>
                            We sent a code to +63 {mobileNumber}
                        </Text>
                    </View>

                    {/* OTP Inputs */}
                    <View style={styles.otpGrid}>
                        {otp.map((digit, index) => (
                            <View key={index} style={styles.otpInputWrapper}>
                                <TextInput
                                    ref={(ref) => { inputs.current[index] = ref; }}
                                    style={[styles.otpInput, digit !== '' && styles.otpInputActive]}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    autoFocus={index === 0}
                                    selectionColor="#666"
                                />
                            </View>
                        ))}
                    </View>

                    {/* Links */}
                    <View style={styles.linksArea}>
                        <TouchableOpacity onPress={onResend} style={styles.linkRow}>
                            <Text style={styles.linkText}>Request a new OTP via SMS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkRow}>
                            <Text style={styles.linkText}>Need help?</Text>
                        </TouchableOpacity>
                    </View>
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
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 20,
        height: 60,
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
    content: {
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    headingArea: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        lineHeight: 22,
        opacity: 0.8,
    },
    otpGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
        width: '100%',
    },
    otpInputWrapper: {
        width: (width - 100) / 6,
        height: 64,
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '500',
        color: '#000',
    },
    otpInputActive: {
        // Optional active state styling
    },
    linksArea: {
        marginTop: 10,
    },
    linkRow: {
        marginBottom: 20,
    },
    linkText: {
        fontSize: 16,
        color: '#FF7F6F', // Coral color from design
        fontWeight: '400',
    },
});

export default OTPScreen;
