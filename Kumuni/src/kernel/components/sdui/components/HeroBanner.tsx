import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import UserManager, { UserLevel } from '../../../../shared/utils/UserManager';

const HeroBanner: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const userLevel = UserManager.getInstance().getUserLevel();
    const isGuestUser = userLevel === UserLevel.GUEST;
    let displayBtnText = data.props.buttonText;

    // If user is already registered/verified, don't show "Sign Up"
    if (!isGuestUser && displayBtnText && displayBtnText.toLowerCase().includes('sign up')) {
        displayBtnText = 'Explore Now';
    }

    return (
        <View style={styles.heroContainer}>
            <Image source={{ uri: data.props.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{data.props.title}</Text>
                <TouchableOpacity style={styles.heroBtn} onPress={() => onAction?.(data.props.action)}>
                    <Text style={styles.heroBtnText}>{displayBtnText} ↗</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroContainer: {
        margin: 20,
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    heroOverlay: { flex: 1, padding: 25, justifyContent: 'center', width: '70%', zIndex: 2 },
    heroTitle: { fontSize: 24, fontWeight: '900', color: '#000', lineHeight: 30, marginBottom: 10 },
    heroBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: 'flex-start',
        marginTop: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    heroBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
});

export default HeroBanner;
