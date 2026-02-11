import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';

const TrustSection: React.FC<SDUIRenderingProps> = ({ data }) => {
    return (
        <View style={[styles.sectionContainer, { marginTop: 30, marginBottom: 10 }]}>
            <View style={styles.trustCard}>
                <Text style={styles.trustHeading}>{data.props.title}</Text>
                <View style={styles.trustGrid}>
                    {data.props.items?.map((item: any, i: number) => (
                        <View key={i} style={styles.trustItem}>
                            <View style={styles.trustIconWrapper}>
                                <Image source={{ uri: item.iconUrl }} style={styles.trustIcon} resizeMode="contain" />
                            </View>
                            <Text style={styles.trustLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
    trustCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    trustHeading: { fontSize: 24, fontWeight: '900', color: '#000', textAlign: 'center', marginBottom: 25 },
    trustGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    trustItem: { width: '30%', alignItems: 'center' },
    trustIconWrapper: { width: 60, height: 60, marginBottom: 12 },
    trustIcon: { width: '100%', height: '100%' },
    trustLabel: { fontSize: 12, fontWeight: '900', color: '#000', textAlign: 'center', lineHeight: 16 },
});

export default TrustSection;
