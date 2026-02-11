import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EmailAddressScreenProps {
    onBack: () => void;
    onSave?: (email: string) => void;
    initialEmail?: string;
}

const EmailAddressScreen: React.FC<EmailAddressScreenProps> = ({
    onBack,
    onSave,
    initialEmail = ''
}) => {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState(initialEmail);
    const [isVerified, setIsVerified] = useState(false);

    const handleResendVerification = () => {
        console.log('Resending verification email to:', email);
        // TODO: Implement resend verification logic
    };

    const handleChangeEmail = () => {
        console.log('Change email address');
        setEmail('');
        setIsVerified(false);
        // TODO: Implement change email logic
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update email address</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <View style={styles.helpIconCircle}>
                        <Text style={styles.helpIconText}>?</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Update email address</Text>
                    <Text style={styles.subtitle}>
                        We will use this email address for billing statements and password recovery
                    </Text>
                </View>

                {/* Email Input Card */}
                <View style={styles.emailCard}>
                    <Text style={styles.statusLabel}>UNVERIFIED</Text>
                    <TextInput
                        style={styles.emailInput}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="jay.doliente@gmail.com"
                        placeholderTextColor="#E5E5EA"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Resend Verification Button */}
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleResendVerification}
                >
                    <Text style={styles.primaryBtnText}>Resend email verification</Text>
                </TouchableOpacity>

                {/* Change Email Button */}
                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={handleChangeEmail}
                >
                    <Text style={styles.secondaryBtnText}>Change recovery email address</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        justifyContent: 'space-between',
    },
    headerBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#000',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    helpIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpIconText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    titleSection: {
        marginTop: 10,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#000',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: '#8E8E93',
        lineHeight: 22,
        fontWeight: '400',
    },
    emailCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 20,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FF3B30',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    emailInput: {
        fontSize: 17,
        color: '#E5E5EA',
        fontWeight: '400',
        padding: 0,
    },
    primaryBtn: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FFF',
    },
    secondaryBtn: {
        backgroundColor: '#E5E5EA',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryBtnText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
});

export default EmailAddressScreen;
