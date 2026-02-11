import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const FeaturedSection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={[styles.sectionContainer, { marginTop: 25 }]}>
            <View style={styles.rowBetween}>
                <Text style={[styles.sectionTitle, { fontSize: 20 }]}>{data.props.title}</Text>
                <TouchableOpacity><Text style={styles.linkText}>View all {'>'}</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.shops?.map((shop: any, i: number) => (
                    <View key={i} style={styles.shopCard}>
                        <View style={styles.shopImgContainer}>
                            <Image source={{ uri: shop.imageUrl }} style={styles.shopImg} />
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredBadgeText}>FEATURED</Text>
                            </View>
                        </View>
                        <View style={styles.shopInfo}>
                            <Text style={styles.shopTitle}>{shop.name}</Text>
                            <Text style={styles.shopDesc}>{shop.category}</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {shop.tags?.map((tag: string, idx: number) => (
                                    <Text key={idx} style={styles.metaText}>• {tag}  </Text>
                                ))}
                            </View>

                            <Text style={styles.priceTextSmall}>{shop.priceHighlight}</Text>

                            <TouchableOpacity style={styles.visitBtn} onPress={() => onAction?.(shop.action)}>
                                <Text style={styles.visitBtnText}>Visit Shop</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    linkText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
    shopScroll: { marginTop: 15 },
    shopCard: { width: screenWidth * 0.72, backgroundColor: '#FFF', borderRadius: 24, padding: 8, marginRight: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 4 },
    shopImgContainer: { height: 160, borderRadius: 18, overflow: 'hidden', position: 'relative' },
    shopImg: { width: '100%', height: '100%' },
    featuredBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#00ff5e', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    featuredBadgeText: { color: '#000', fontSize: 11, fontWeight: '900' },
    shopInfo: { padding: 12 },
    shopTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
    shopDesc: { fontSize: 13, color: '#888', marginTop: 4 },
    metaText: { fontSize: 11, fontWeight: '600', color: '#666' },
    priceTextSmall: { fontSize: 12, fontWeight: '700', color: '#000', marginTop: 8 },
    visitBtn: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 15 },
    visitBtnText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
});

export default FeaturedSection;
