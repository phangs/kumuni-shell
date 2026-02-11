import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SDUIRenderingProps } from '../SDUIRegistry';
import SDUIIcon from './SDUIIcon';

/**
 * AppWelcomeScreen - A standardized, semantic welcome screen for miniapps.
 * 
 * JSON Schema Props:
 * - heroImage: string (URL)
 * - logoIcon: string (URL) - The small icon that floats on the hero
 * - title: string - The brand title on the floating card (e.g., "Online Cedula")
 * - welcomeMessage: string - The main heading below the hero
 * - description: string - Optional extra text
 * - features: Array<{ icon: string, title: string, description: string }>
 * - requirements: Array<string> - Optional list of requirements
 * - buttonText: string
 */
const AppWelcomeScreen: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const insets = useSafeAreaInsets();
    const {
        heroImage,
        logoIcon,
        title,
        welcomeMessage,
        description,
        features = [],
        requirements = [],
        buttonText = 'Get Started'
    } = data.props;

    const handlePress = () => {
        const action = data.action?.type || data.props.action?.type;
        const params = data.action?.params || data.props.action?.params || {};
        if (action) {
            onAction?.(action, params);
        }
    };

    const handleClose = () => {
        onAction?.('nav_home');
    };

    return (
        <ScrollView style={styles.container} bounces={false} contentContainerStyle={styles.contentContainer}>
            {/* Close Button */}
            <TouchableOpacity
                style={[styles.closeButton, { top: insets.top + 10 }]}
                onPress={handleClose}
            >
                <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Hero Section */}
            <View style={styles.heroContainer}>
                <Image source={{ uri: heroImage }} style={styles.heroImage} />

                {/* Floating Brand Card */}
                <View style={styles.brandCard}>
                    <Image source={{ uri: logoIcon }} style={styles.brandIcon} resizeMode="contain" />
                    <Text style={styles.brandTitle}>{title}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.body}>
                <Text style={styles.welcomeHeading}>{welcomeMessage}</Text>

                {description && <Text style={styles.description}>{description}</Text>}

                {/* Features List */}
                <View style={styles.featuresList}>
                    {features.map((feature: any, index: number) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.featureIconContainer}>
                                <SDUIIcon
                                    data={{
                                        props: {
                                            name: feature.icon,
                                            size: 22,
                                            color: '#1A1C1E'
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Requirements Section */}
                {requirements.length > 0 && (
                    <View style={styles.requirementsContainer}>
                        <Text style={styles.sectionHeading}>What you'll need:</Text>
                        {requirements.map((req: string, index: number) => (
                            <View key={index} style={styles.requirementItem}>
                                <Text style={styles.requirementDot}>•</Text>
                                <Text style={styles.requirementText}>{req}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={handlePress}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '300',
    },
    heroContainer: {
        width: '100%',
        height: 380,
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: 340,
        backgroundColor: '#F5F5F7',
    },
    brandCard: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        width: 140,
        height: 140,
    },
    brandIcon: {
        width: 60,
        height: 60,
        marginBottom: 12,
    },
    brandTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        color: '#1A1C1E',
    },
    body: {
        paddingHorizontal: 25,
        marginTop: 30,
    },
    welcomeHeading: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1A1C1E',
        marginBottom: 30,
    },
    description: {
        fontSize: 15,
        color: '#5C6066',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
    },
    featuresList: {
        marginTop: 10,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 25,
        alignItems: 'flex-start',
    },
    featureIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureIconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    featureIconEmoji: {
        fontSize: 22,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1C1E',
        marginBottom: 4,
    },
    featureDescription: {
        color: '#8E9199',
        fontSize: 14,
        lineHeight: 20,
    },
    requirementsContainer: {
        marginTop: 10,
        padding: 20,
        backgroundColor: '#F5F5F7',
        borderRadius: 16,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1C1E',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    requirementDot: {
        marginRight: 8,
        color: '#5C6066',
    },
    requirementText: {
        fontSize: 14,
        color: '#5C6066',
        flex: 1,
    },
    footer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
    },
});

export default AppWelcomeScreen;
