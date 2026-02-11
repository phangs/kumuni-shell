import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const OnboardingSlide: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.onboardingContainer}>
            <View style={[styles.onboardingVisual, { backgroundColor: data.props.backgroundColor || '#FFF' }]}>
                {data.props.backgroundImage && (
                    <Image source={{ uri: data.props.backgroundImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                )}
                {data.props.phoneMockup && (
                    <Image source={{ uri: data.props.phoneMockup }} style={styles.phoneMockupImage} resizeMode="contain" />
                )}
                {data.props.overlayGrid && (
                    <View style={styles.overlayGridWrapper}>
                        {data.props.overlayGrid.map((item: any, i: number) => (
                            <View key={i} style={styles.gridItem}>
                                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                                <Text style={styles.gridItemLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.onboardingContent}>
                <View>
                    <View style={styles.progressWrapper}>
                        {[...Array(data.props.totalSteps || 3)].map((_, i: number) => (
                            <View
                                key={i}
                                style={[
                                    styles.progressSegment,
                                    i < (data.props.currentStep || 1) && styles.progressSegmentActive,
                                ]}
                            />
                        ))}
                    </View>

                    {data.props.tagLine && (
                        <View style={styles.tagWrapper}>
                            <Text style={styles.tagText}>{data.props.tagLine}</Text>
                        </View>
                    )}

                    <Text style={styles.onboardingHeading}>{data.props.title}</Text>
                </View>

                <View style={styles.onboardingFooter}>
                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={() => {
                            const action = typeof data.action === 'object' ? data.action.type : (data.props.action || data.action);
                            const params = typeof data.action === 'object' ? data.action.params : (data.props.actionParams || {});
                            onAction?.(action, params);
                        }}
                    >
                        <Text style={styles.continueBtnText}>{data.props.buttonText || 'Continue'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    onboardingContainer: { flex: 1, backgroundColor: '#FFF' },
    onboardingVisual: { height: '52%', backgroundColor: '#CCC' },
    phoneMockupImage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '90%',
        alignSelf: 'center',
    },
    overlayGridWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 5,
    },
    gridItem: {
        width: (screenWidth - 66) / 4,
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 18,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    gridItemLabel: { fontSize: 9, textAlign: 'center', marginTop: 4, fontWeight: '600', color: '#1A1A1A' },
    onboardingContent: { flex: 1, padding: 30, paddingTop: 20, justifyContent: 'space-between' },
    progressWrapper: { flexDirection: 'row', marginBottom: 25 },
    progressSegment: { height: 3, flex: 1, backgroundColor: '#E0E0E0', borderRadius: 2, marginRight: 8 },
    progressSegmentActive: { backgroundColor: '#000' },
    tagWrapper: {
        backgroundColor: '#F0F0F2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    tagText: { fontSize: 13, color: '#888', fontWeight: '500' },
    onboardingHeading: { fontSize: 32, fontWeight: '800', color: '#000', marginBottom: 20 },
    onboardingFooter: { width: '100%' },
    continueBtn: { backgroundColor: '#000', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    continueBtnText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});

export default OnboardingSlide;
