import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const CommunitySection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{data.props.title}</Text>
                    <Text style={styles.bizSubtitleSmall}>{data.props.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => onAction?.('show_more_community')}>
                    <Text style={styles.linkText}>Show more {'>'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.communityScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.items?.map((item: any, i: number) => (
                    <TouchableOpacity key={i} style={styles.communityCard} onPress={() => onAction?.(item.action)}>
                        <Image source={{ uri: item.imageUrl }} style={styles.communityImg} />
                        <View style={styles.communityInfo}>
                            <Text style={styles.communityName}>{item.title}</Text>
                            <Text style={styles.communitySubtitle}>{item.description}</Text>
                        </View>
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
    communityScroll: { marginHorizontal: -20, marginTop: 20, paddingLeft: 20 },
    communityCard: { width: screenWidth * 0.55, marginRight: 15 },
    communityImg: { width: '100%', height: 120, borderRadius: 20 },
    communityInfo: { marginTop: 10 },
    communityName: { fontSize: 16, fontWeight: '900', color: '#000' },
    communitySubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
});

export default CommunitySection;
