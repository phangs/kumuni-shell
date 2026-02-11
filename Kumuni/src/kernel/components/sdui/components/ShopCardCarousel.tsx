import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';
import { useTheme } from '../../ThemeProvider';

const ShopCardCarousel: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.sectionContainer, { marginTop: 25 }]}>
            <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.sectionTitle, { fontSize: 20 }]}>Nearby</Text>
                    <Text style={{ marginLeft: 10, color: '#3498db', fontWeight: '600' }}>📍 Quezon City • 1 km</Text>
                </View>
                <TouchableOpacity><Text style={styles.linkText}>Show more {'>'}</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.shops?.map((shop: any, i: number) => (
                    <View key={i} style={styles.shopCard}>
                        <View style={styles.shopImgContainer}>
                            <Image source={{ uri: shop.imageUrl }} style={styles.shopImg} />
                            <View style={styles.distanceBadge}>
                                <Text style={styles.distanceText}>📍 {shop.distance}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: shop.isOpen ? '#00ff5e' : '#ff3b30' }]} />
                        </View>
                        <View style={styles.shopInfo}>
                            <Text style={styles.shopTitle}>{shop.name}</Text>
                            <Text style={styles.shopDesc}>{shop.category}</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingText}>⭐ {shop.rating} ({shop.reviews} Reviews)</Text>
                            </View>

                            <View style={styles.scheduleRow}>
                                <Text style={styles.iconTextSmall}>🕒</Text>
                                <Text style={styles.scheduleText}>{shop.statusText}</Text>
                            </View>

                            <View style={styles.priceRow}>
                                <Text style={styles.priceText}>₱ {shop.priceRange}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.iconTextSmall}>🏃</Text>
                                    <Text style={styles.scheduleText}>{shop.deliveryTime}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.visitBtn, { backgroundColor: theme.colors.primary }]} onPress={() => onAction?.(shop.action)}>
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
    distanceBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    distanceText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    statusBadge: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#FFF' },
    shopInfo: { padding: 12 },
    shopTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
    shopDesc: { fontSize: 13, color: '#888', marginTop: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    ratingText: { fontSize: 12, fontWeight: 'bold', color: '#FFA000' },
    scheduleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, marginTop: 12 },
    iconTextSmall: { fontSize: 14, marginRight: 6 },
    scheduleText: { fontSize: 12, fontWeight: '700', color: '#000' },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingHorizontal: 4 },
    priceText: { fontSize: 14, fontWeight: '900', color: '#000' },
    visitBtn: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 15 },
    visitBtnText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
});

export default ShopCardCarousel;
