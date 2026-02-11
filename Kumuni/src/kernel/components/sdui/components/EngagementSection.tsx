import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const EngagementSection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{data.props.title}</Text>
                    <Text style={styles.bizSubtitleSmall}>{data.props.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => onAction?.('show_more_engagement')}>
                    <Text style={styles.linkText}>Show more {'>'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.engagementScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.items?.map((item: any, i: number) => (
                    <TouchableOpacity key={i} style={[styles.engagementCard, { backgroundColor: item.backgroundColor || '#FFF' }]} onPress={() => onAction?.(item.action)}>
                        <View style={styles.engagementTextContainer}>
                            <Text style={styles.engagementTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.engagementSubtitle} numberOfLines={2}>{item.description}</Text>
                        </View>
                        {item.imageUrl && (
                            <View style={styles.engagementImgContainer}>
                                <Image source={{ uri: item.imageUrl }} style={styles.engagementImg} resizeMode="contain" />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000' },
    bizSubtitleSmall: { fontSize: 13, color: '#888', marginTop: 4 },
    linkText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    engagementScroll: { marginHorizontal: -20, marginTop: 20, paddingLeft: 20 },
    engagementCard: {
        width: screenWidth * 0.65,
        height: 140,
        borderRadius: 24,
        marginRight: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    engagementTextContainer: { flex: 1, marginRight: 10 },
    engagementTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
    engagementSubtitle: { fontSize: 13, color: '#333', marginTop: 8, fontWeight: '500' },
    engagementImgContainer: { width: 80, height: 100, justifyContent: 'center', alignItems: 'center' },
    engagementImg: { width: '120%', height: '120%' },
});

export default EngagementSection;
