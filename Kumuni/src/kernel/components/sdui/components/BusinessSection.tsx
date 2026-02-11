import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const BusinessSection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{data.props.title}</Text>
                    <Text style={styles.bizSubtitleSmall}>{data.props.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => onAction?.('show_more_business')}>
                    <Text style={styles.linkText}>Show more {'>'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bizGrid}>
                <View style={styles.bizRow}>
                    {data.props.items?.slice(0, 2).map((item: any, i: number) => (
                        <TouchableOpacity key={i} style={styles.bizCardVertical} onPress={() => onAction?.(item.action)}>
                            <View style={styles.cardImageContainer}><Image source={{ uri: item.imageUrl }} style={styles.bizImgVertical} /></View>
                            <View style={styles.bizInfo}>
                                <Text style={styles.bizName}>{item.title}</Text>
                                <Text style={styles.bizSubtitle} numberOfLines={3}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {data.props.items?.[2] && (
                    <TouchableOpacity style={styles.bizCardHorizontal} onPress={() => onAction?.(data.props.items[2].action)}>
                        <View style={styles.cardImageContainerHorizontal}><Image source={{ uri: data.props.items[2].imageUrl }} style={styles.bizImgHorizontal} /></View>
                        <View style={[styles.bizInfo, { flex: 1 }]}>
                            <Text style={styles.bizName}>{data.props.items[2].title}</Text>
                            <Text style={styles.bizSubtitle} numberOfLines={2}>{data.props.items[2].description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000' },
    bizSubtitleSmall: { fontSize: 13, color: '#888', marginTop: 4 },
    linkText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    bizGrid: { marginTop: 15 },
    bizRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    cardImageContainer: { height: 120, overflow: 'hidden' },
    bizCardVertical: {
        width: (screenWidth - 55) / 2,
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    bizImgVertical: { width: '100%', height: '100%' },
    bizCardHorizontal: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        alignItems: 'center',
        marginBottom: 10,
    },
    cardImageContainerHorizontal: { width: 120, height: 100, overflow: 'hidden' },
    bizImgHorizontal: { width: '100%', height: '100%' },
    bizInfo: { padding: 12 },
    bizName: { fontSize: 15, fontWeight: '900', color: '#000' },
    bizSubtitle: { fontSize: 11, color: '#777', marginTop: 4, lineHeight: 16 },
});

export default BusinessSection;
