import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DigitalIdScreenProps {
    onBack: () => void;
}

const DigitalIdScreen: React.FC<DigitalIdScreenProps> = ({ onBack }) => {
    const insets = useSafeAreaInsets();

    const handleShare = () => {
        console.log('Share Digital ID');
    };

    const handleCopyLink = () => {
        console.log('Copy Link');
    };

    const handleDownload = () => {
        console.log('Download Digital ID');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Digital ID</Text>
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
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={{ fontSize: 50 }}>👨‍💼</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>Jay Doliente</Text>
                    <Text style={styles.userEmail}>jay.doliente@example.com</Text>
                    <Text style={styles.userPhone}>+63 987 654 3210</Text>
                </View>

                {/* Digital ID Card */}
                <View style={styles.idCard}>
                    {/* Card Header */}
                    <View style={styles.idCardHeader}>
                        <Text style={styles.idCardTitle}>DIGITAL ID</Text>
                        <Text style={styles.idCardNumber}>CRN - 0111-8740248-9</Text>
                        <View style={styles.verificationBadge}>
                            <View style={styles.badgeCircle}>
                                <Text style={styles.badgeCheck}>✓</Text>
                            </View>
                        </View>
                    </View>

                    {/* Card Body */}
                    <View style={styles.idCardBody}>
                        {/* Photo Section */}
                        <View style={styles.photoSection}>
                            <View style={styles.idPhoto}>
                                <Text style={{ fontSize: 40 }}>👨‍💼</Text>
                            </View>
                            <View style={styles.signatureContainer}>
                                <Text style={styles.signatureText}>Jay Doliente</Text>
                            </View>
                        </View>

                        {/* Right Section - Info and QR */}
                        <View style={styles.rightSection}>
                            {/* Top Row - Info and QR side by side */}
                            <View style={styles.topRow}>
                                {/* Info Section */}
                                <View style={styles.infoSection}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>LAST NAME</Text>
                                        <Text style={styles.infoValue}>DOLIENTE</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>FIRST NAME</Text>
                                        <Text style={styles.infoValue}>JAY</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>MIDDLE NAME</Text>
                                        <Text style={styles.infoValue}>MENDEZ</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>DATE OF BIRTH</Text>
                                        <Text style={styles.infoValue}>JULY 24, 1980</Text>
                                    </View>
                                </View>

                                {/* QR Code Section */}
                                <View style={styles.qrSection}>
                                    <View style={styles.qrCode}>
                                        {/* Realistic QR pattern using multiple squares */}
                                        <View style={styles.qrRow}>
                                            <View style={styles.qrDot} /><View style={styles.qrDot} /><View style={styles.qrDot} />
                                        </View>
                                        <View style={styles.qrRow}>
                                            <View style={[styles.qrDot, { backgroundColor: '#FFF' }]} /><View style={styles.qrDot} /><View style={[styles.qrDot, { backgroundColor: '#FFF' }]} />
                                        </View>
                                        <View style={styles.qrRow}>
                                            <View style={styles.qrDot} /><View style={[styles.qrDot, { backgroundColor: '#FFF' }]} /><View style={styles.qrDot} />
                                        </View>
                                    </View>
                                    <Text style={styles.qrLabel}>DIGITAL ID NO.</Text>
                                    <Text style={styles.qrValue} numberOfLines={1}>CYW652912</Text>
                                </View>
                            </View>

                            {/* Bottom Row - Address spanning full width */}
                            <View style={styles.addressRow}>
                                <Text style={styles.infoLabel}>ADDRESS</Text>
                                <Text style={styles.infoValue}>
                                    BLK 1 LOT2, JUPITER ST. KALAWAKAN{'\n'}
                                    CITY OF SAN JOSE DEL MONTE, BULACAN{'\n'}
                                    PHILIPPINES, 3023
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                        <Text style={styles.actionIcon}>⤴</Text>
                        <Text style={styles.actionLabel}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleCopyLink}>
                        <Text style={styles.actionIcon}>🔗</Text>
                        <Text style={styles.actionLabel}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
                        <Text style={styles.actionIcon}>⬇</Text>
                        <Text style={styles.actionLabel}>Download</Text>
                    </TouchableOpacity>
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
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginBottom: 8,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 14,
        color: '#666',
    },
    idCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    idCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    idCardTitle: {
        fontSize: 13,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 1,
    },
    idCardNumber: {
        fontSize: 11,
        color: '#666',
        marginLeft: 10,
    },
    verificationBadge: {
        position: 'absolute',
        right: 0,
        top: -5,
    },
    badgeCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    badgeCheck: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    idCardBody: {
        flexDirection: 'row',
    },
    photoSection: {
        width: 100,
        marginRight: 15, // Replaced gap
    },
    idPhoto: {
        width: 100,
        height: 120,
        backgroundColor: '#E5E5EA',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    signatureContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#000',
    },
    signatureText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#000',
        fontWeight: '600',
    },
    rightSection: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoSection: {
        flex: 1,
        marginRight: 10, // Replaced gap
    },
    infoRow: {
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
        lineHeight: 14,
    },
    addressRow: {
        marginTop: 5,
    },
    qrSection: {
        width: 70, // Reduced from 80
        alignItems: 'center',
    },
    qrCode: {
        width: 60, // Reduced from 70
        height: 60, // Reduced from 70
        backgroundColor: '#FFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, // Reduced marginBottom
        borderWidth: 1,
        borderColor: '#E5E5EA',
        overflow: 'hidden', // Ensure no overflow
    },
    qrRow: {
        flexDirection: 'row',
    },
    qrDot: {
        width: 12,
        height: 12,
        backgroundColor: '#000',
        margin: 1,
    },
    qrLabel: {
        fontSize: 8,
        fontWeight: '700',
        color: '#8E8E93',
        letterSpacing: 0.3,
        marginBottom: 2,
        textAlign: 'center',
    },
    qrValue: {
        fontSize: 9, // Slightly smaller font
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    actionBtn: {
        alignItems: 'center',
        padding: 10,
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
});

export default DigitalIdScreen;
