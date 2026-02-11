import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface WelcomeModalProps {
    visible: boolean;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onClose }) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Close Button Top Right */}
                <TouchableOpacity
                    style={[styles.closeBtn, { top: Math.max(insets.top, 20) + 10 }]}
                    onPress={onClose}
                >
                    <Text style={styles.closeText}>Close</Text>
                    <View style={styles.closeIconWrapper}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </View>
                </TouchableOpacity>

                {/* Modal Card */}
                <View style={styles.card}>
                    {/* Top Image Section */}
                    <View style={styles.imageSection}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1577563906417-45a11b3f9f54?q=80&w=1000&auto=format&fit=crop' }} // Placeholder for the Mayor banner
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Content Section */}
                    <View style={styles.content}>
                        <Text style={styles.headline}>Headline</Text>
                        <Text style={styles.subHeadline}>Sub headline</Text>

                        <Text style={styles.description}>
                            Lorem ipsum dolor sit amet consectetur. Donec pharetra donec ultrices nisi ullamcorper amet.
                        </Text>

                        <TouchableOpacity onPress={() => console.log('Link pressed')}>
                            <Text style={styles.linkText}>Link here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        right: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 28, 30, 0.9)', // Dark pill
        paddingLeft: 18,
        paddingRight: 8,
        paddingVertical: 8,
        borderRadius: 24,
        zIndex: 100,
    },
    closeText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginRight: 10,
    },
    closeIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '300',
    },
    card: {
        width: width * 0.88,
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
    },
    imageSection: {
        height: width * 0.88 * 1.0, // Square-ish aspect ratio for the banner
        width: '100%',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 30,
        backgroundColor: '#FFF',
    },
    headline: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subHeadline: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 24,
    },
    linkText: {
        fontSize: 16,
        color: '#4DA3FF', // Lighter blue from mockup
        fontWeight: '600',
    },
});

export default WelcomeModal;
