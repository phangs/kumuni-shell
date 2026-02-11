import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { useTheme } from '../../ThemeProvider';
import SDUIIcon from './SDUIIcon';
import UserManager, { UserLevel } from '../../../../shared/utils/UserManager';
import { baseStyles } from '../BaseStyles';

const WalletCard: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    const userLevel = UserManager.getInstance().getUserLevel();
    const isGuest = userLevel === UserLevel.GUEST;
    const isRegistered = userLevel === UserLevel.REGISTERED;

    const cardBgImage = isGuest
        ? (data.props.guestBackgroundImage || data.props.backgroundImage || 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_23PM.webp')
        : (data.props.registeredBackgroundImage || data.props.backgroundImage);

    if (isGuest || isRegistered) {
        const title = isGuest
            ? (data.props.guestTitle || "Your LGU's mobile-first community platform")
            : (data.props.registeredTitle || "Get verified for exclusive benefits!");

        const btnText = isGuest ? "Sign Up Now!" : "Verify Now!";
        const action = isGuest ? "signup" : "verify_identity";

        return (
            <View style={styles.promoWalletContainer}>
                {cardBgImage && (
                    <Image
                        source={{ uri: cardBgImage }}
                        style={styles.promoWalletBackgroundImage}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.promoWalletOverlay} />
                <View style={styles.promoWalletContent}>
                    <Text style={styles.promoWalletTitle}>{title}</Text>
                    <TouchableOpacity style={styles.promoWalletBtn} onPress={() => onAction?.(action)}>
                        <Text style={styles.promoWalletBtnText}>{btnText}</Text>
                        <View style={styles.arrowCircle}>
                            <SDUIIcon data={{ props: { name: 'wc_ArrowUp', size: 24, color: '#FFF' } }} />
                        </View>
                    </TouchableOpacity>
                </View>
                {isRegistered && data.props.heroImageUrl && (
                    <Image
                        source={{ uri: data.props.heroImageUrl }}
                        style={styles.registeredHeroImage}
                        resizeMode="contain"
                    />
                )}
            </View>
        );
    }

    return (
        <View style={[styles.walletBase, { backgroundColor: theme.colors.primary }]}>
            {cardBgImage && (
                <Image source={{ uri: cardBgImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            )}
            <View style={baseStyles.rowBetween}>
                <Text style={styles.walletLabel}>My Wallet balance</Text>
                <SDUIIcon data={{ props: { name: 'settings', size: 18, color: '#000' } }} />
            </View>
            <Text style={styles.balanceText}>{data.props.balance}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    walletBase: {
        margin: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    walletLabel: { color: '#000', fontSize: 13, fontWeight: '600', opacity: 0.7 },
    balanceText: { fontSize: 32, fontWeight: 'bold', color: '#000', marginTop: 5 },
    promoWalletContainer: {
        margin: 20,
        marginTop: 20,
        height: 190,
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        overflow: 'hidden',
        flexDirection: 'row',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    promoWalletContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        zIndex: 2,
    },
    promoWalletTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        lineHeight: 28,
        marginBottom: 20,
        width: '90%',
    },
    promoWalletBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    promoWalletBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
        marginRight: 8,
    },
    arrowCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    promoWalletBackgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    promoWalletOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    registeredHeroImage: {
        height: '100%',
        width: 150,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});

export default WalletCard;
