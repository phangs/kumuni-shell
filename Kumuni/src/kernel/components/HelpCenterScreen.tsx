import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface HelpCenterScreenProps {
    onBack: () => void;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ onBack }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center</Text>
            </View>

            <ScrollView bounces={false} style={styles.scrollView}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>How can we help?</Text>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#A9A9A9"
                            style={styles.searchInput}
                        />
                        <TouchableOpacity>
                            <Text style={styles.micIcon}>🎙️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <View style={styles.actionIconWrapper}>
                            <Text style={styles.actionEmoji}>⚙️</Text>
                        </View>
                        <Text style={styles.actionText}>Service Availability</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn}>
                        <View style={styles.actionIconWrapper}>
                            <Text style={styles.actionEmoji}>🔍</Text>
                        </View>
                        <Text style={styles.actionText}>Track your ticket</Text>
                    </TouchableOpacity>
                </View>

                {/* More content can go here */}
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
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#FFF',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    backArrow: {
        fontSize: 24,
        color: '#000',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: '#D1D2D6',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        width: '100%',
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
        color: '#A9A9A9',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    micIcon: {
        fontSize: 18,
        marginLeft: 8,
        color: '#A9A9A9',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9EAEF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
    },
    actionIconWrapper: {
        marginRight: 8,
    },
    actionEmoji: {
        fontSize: 16,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
});

export default HelpCenterScreen;
