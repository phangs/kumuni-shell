import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
    onBack: () => void;
    onAction?: (action: string) => void;
    userData?: {
        name: string;
        fullName: string;
        phone: string;
        isVerified: boolean;
    };
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onAction, userData }) => {
    const insets = useSafeAreaInsets();

    // Default data if none provided
    const user = userData || {
        name: 'User',
        fullName: '',
        phone: '+63 987 654 3210',
        isVerified: false,
    };

    const MenuItem = ({ icon, label, subValue, onPress }: any) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuLeft}>
                <View style={styles.menuIconWrapper}>
                    <Text style={styles.menuIconEmoji}>{icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
            </View>
            <View style={styles.menuRight}>
                {subValue && <Text style={styles.subValue}>{subValue}</Text>}
                <Text style={styles.arrowIcon}>〉</Text>
            </View>
        </TouchableOpacity>
    );

    const SectionTitle = ({ title }: { title: string }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => onAction?.('help')}
                >
                    <View style={styles.helpIconCircle}>
                        <Text style={styles.helpIconText}>?</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* User Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarLarge}>
                            <Text style={{ fontSize: 45 }}>👨‍💼</Text>
                        </View>
                        {!user.isVerified && (
                            <View style={styles.unverifiedBadge}>
                                <Text style={styles.unverifiedBadgeText}>!</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.fullName ? <Text style={styles.userFullName}>{user.fullName}</Text> : null}
                    {user.phone ? <Text style={styles.userPhone}>{user.phone}</Text> : null}
                </View>

                {/* Upgrade Card */}
                {!user.isVerified && (
                    <View style={styles.upgradeCard}>
                        <View style={styles.upgradeContent}>
                            <Text style={styles.upgradeTitle}>Upgrade your account</Text>
                            <Text style={styles.upgradeSubtitle}>Verify your identity to unlock all features</Text>
                            <TouchableOpacity
                                style={styles.verifyBtn}
                                onPress={() => onAction?.('verify_now')}
                            >
                                <Text style={styles.verifyBtnText}>Verify now</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.upgradeIconSection}>
                            <View style={styles.sealCircle}>
                                <View style={styles.sealInner}>
                                    <Text style={styles.sealCheck}>✓</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Family Member Section */}
                <TouchableOpacity style={styles.familyCard} onPress={() => onAction?.('family')}>
                    <View>
                        <Text style={styles.familyTitle}>Family Member</Text>
                        <Text style={styles.familySubtitle}>0 member</Text>
                    </View>
                    <Text style={styles.arrowIconLight}>〉</Text>
                </TouchableOpacity>

                {/* Account Section */}
                <View style={styles.section}>
                    <SectionTitle title="Account" />
                    <MenuItem
                        icon="🪪"
                        label="Digital ID"
                        onPress={() => onAction?.('digital_id')}
                    />
                    <MenuItem
                        icon="👤"
                        label="Personal Information"
                        onPress={() => onAction?.('personal_info')}
                    />
                    <MenuItem
                        icon="📧"
                        label="Email Address"
                        onPress={() => onAction?.('email_address')}
                    />
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <SectionTitle title="Settings" />
                    <MenuItem icon="⌨️" label="Change PIN" />
                    <MenuItem icon="✋" label="Biometrics" subValue="Enabled" />
                    <MenuItem icon="📱" label="Connected Devices" />
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <SectionTitle title="Privacy" />
                    <MenuItem icon="🔔" label="Notifications" />
                    <MenuItem icon="📄" label="Terms and Conditions" />
                    <MenuItem icon="❓" label="Get Help" />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => onAction?.('logout')}>
                    <Text style={styles.logoutBtnText}>Log out</Text>
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.logoRow}>
                        <Text style={styles.footerLogo}>K</Text>
                        <Text style={styles.footerLogoText}>Kumuni</Text>
                    </View>
                    <Text style={styles.versionText}>v1.00.0.000</Text>
                </View>
            </ScrollView>
        </View>
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
        width: 40,
        height: 40,
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
    profileHeader: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unverifiedBadge: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unverifiedBadgeText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginBottom: 10,
    },
    userFullName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 14,
        color: '#666',
    },
    upgradeCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#F2F2F7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    upgradeContent: {
        flex: 1,
    },
    upgradeTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
        marginBottom: 8,
    },
    upgradeSubtitle: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 15,
        paddingRight: 10,
    },
    verifyBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    verifyBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    upgradeIconSection: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sealCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#1A1A1A', // Dark scalloped background look
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    sealInner: {
        width: 45,
        height: 45,
        borderRadius: 12, // Slightly rounded checkmark background
        backgroundColor: '#34C759', // iOS Green
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }], // Diamond shape for the inner seal
    },
    sealCheck: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        transform: [{ rotate: '-45deg' }], // Counter-rotate text
    },
    familyCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    familyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#8E8E93', // Muted as in image
        marginBottom: 5,
    },
    familySubtitle: {
        fontSize: 14,
        color: '#C7C7CC',
    },
    arrowIconLight: {
        fontSize: 16,
        color: '#C7C7CC',
    },
    section: {
        backgroundColor: '#F9F9F9',
        borderRadius: 24,
        padding: 16,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuIconEmoji: {
        fontSize: 18,
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subValue: {
        fontSize: 14,
        color: '#34C759', // Green for Enabled
        marginRight: 10,
    },
    arrowIcon: {
        fontSize: 16,
        color: '#000',
        fontWeight: '700',
    },
    logoutBtn: {
        backgroundColor: '#E5E5EA',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    logoutBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    footer: {
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    footerLogo: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginRight: 8,
    },
    footerLogoText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#000',
    },
    versionText: {
        fontSize: 14,
        color: '#8E8E93',
    },
});

export default ProfileScreen;
