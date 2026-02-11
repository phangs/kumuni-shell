import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';

const PromosSection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.sectionTitle, { fontSize: 20 }]}>{data.props.title}</Text>
                    {data.props.badgeText && (
                        <View style={styles.promoBadge}>
                            <Text style={styles.promoBadgeText}>{data.props.badgeText}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity><Text style={styles.linkText}>Show more {'>'}</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.items?.map((promo: any, i: number) => (
                    <TouchableOpacity key={i} style={styles.promoCard} onPress={() => onAction?.(promo.action)}>
                        <View style={styles.promoCardLeft}>
                            <Image source={{ uri: promo.imageUrl }} style={styles.promoImg} />
                            {promo.offerBadge && (
                                <View style={styles.promoOfferBadge}>
                                    <Text style={styles.promoOfferText}>{promo.offerBadge}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.promoCardRight}>
                            <View>
                                <Text style={styles.promoShopName}>{promo.shopName}</Text>
                                <Text style={styles.promoSubtitle}>{promo.description}</Text>
                                <View style={styles.promoHighlightBox}>
                                    <Text style={styles.promoHighlightText}>{promo.highlight}</Text>
                                </View>
                            </View>
                            <View style={styles.rowBetween}>
                                <Text style={styles.promoValidity}>Valid until {promo.validUntil}</Text>
                                <Text style={styles.linkTextSmall}>Claim ↗</Text>
                            </View>
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
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    linkText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
    promoBadge: { backgroundColor: '#FF6B6B', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15, marginLeft: 10 },
    promoBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
    promoScroll: { marginTop: 15 },
    promoCard: { width: screenWidth * 0.85, height: 160, backgroundColor: '#FFF', borderRadius: 24, flexDirection: 'row', overflow: 'hidden', marginRight: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 3 },
    promoCardLeft: { width: '40%', height: '100%', position: 'relative' },
    promoImg: { width: '100%', height: '100%' },
    promoOfferBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FF5A5F', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
    promoOfferText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    promoCardRight: { flex: 1, padding: 15, justifyContent: 'space-between' },
    promoShopName: { fontSize: 16, fontWeight: '900', color: '#000' },
    promoSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
    promoHighlightBox: { backgroundColor: '#FF8084', padding: 10, borderRadius: 12, marginTop: 10 },
    promoHighlightText: { color: '#FFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
    promoValidity: { fontSize: 11, color: '#999', fontWeight: '500' },
    linkTextSmall: { color: '#3498db', fontSize: 12, fontWeight: '600' },
});

export default PromosSection;
