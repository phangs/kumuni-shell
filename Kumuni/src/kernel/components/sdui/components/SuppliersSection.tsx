import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { screenWidth } from '../BaseStyles';
import { useTheme } from '../../ThemeProvider';

const SuppliersSection: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.sectionContainer}>
            <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{data.props.title}</Text>
                    <Text style={styles.bizSubtitleSmall}>{data.props.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => onAction?.('show_more_suppliers')}>
                    <Text style={styles.linkText}>Show more {'>'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.supplierHero}>
                <Image source={{ uri: data.props.heroImage }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={styles.supplierHeroOverlay}>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}><Text style={styles.statVal}>500+</Text><Text style={styles.statLab}>PRODUCTS</Text></View>
                        <View style={styles.statItem}><Text style={styles.statVal}>24/7</Text><Text style={styles.statLab}>SUPPORT</Text></View>
                        <View style={styles.statItem}><Text style={styles.statVal}>15%</Text><Text style={styles.statLab}>AVG. SAVINGS</Text></View>
                    </View>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supplierScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.items?.map((item: any, i: number) => (
                    <View key={i} style={styles.supplierCard}>
                        <View style={styles.supplierTop}>
                            <View style={styles.supplierLogoContainer}>
                                <Image source={{ uri: item.logoUrl }} style={styles.supplierLogo} resizeMode="contain" />
                            </View>
                            {item.badgeText && (
                                <View style={[styles.supplierBadge, { backgroundColor: item.badgeColor || '#00ff5e' }]}>
                                    <Text style={styles.supplierBadgeText}>{item.badgeText}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.supplierInfo}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.supplierName}>{item.name}</Text>
                                <Text style={styles.supplierRating}>⭐ {item.rating}</Text>
                            </View>
                            <Text style={styles.supplierCategory}>{item.category}</Text>
                            <Text style={styles.supplierDesc} numberOfLines={1}>{item.description}</Text>

                            <View style={styles.uspContainer}>
                                {item.usps?.map((usp: any, idx: number) => (
                                    <View key={idx} style={styles.uspItem}>
                                        <Text style={styles.uspIcon}>{usp.icon}</Text>
                                        <Text style={styles.uspText}>{usp.text}</Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity style={[styles.browseBtn, { backgroundColor: theme.colors.primary }]} onPress={() => onAction?.(item.action)}>
                                <Text style={styles.browseBtnText}>Browse Catalog</Text>
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
    bizSubtitleSmall: { fontSize: 13, color: '#888', marginTop: 4 },
    linkText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    supplierHero: { height: 160, borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20 },
    supplierHeroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 15 },
    statRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 15 },
    statItem: { alignItems: 'center' },
    statVal: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    statLab: { color: '#FFF', fontSize: 8, fontWeight: '700', marginTop: 4, opacity: 0.8 },
    supplierScroll: { marginHorizontal: -20, paddingLeft: 20 },
    supplierCard: { width: screenWidth * 0.75, backgroundColor: '#FFF', borderRadius: 24, padding: 10, marginRight: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 4 },
    supplierTop: { height: 140, backgroundColor: '#F8F9FA', borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    supplierLogoContainer: { width: '60%', height: '60%' },
    supplierLogo: { width: '100%', height: '100%' },
    supplierBadge: { position: 'absolute', top: 12, right: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    supplierBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
    supplierInfo: { padding: 12 },
    supplierName: { fontSize: 18, fontWeight: '900', color: '#0056b3' },
    supplierRating: { fontSize: 13, fontWeight: 'bold', color: '#FFA000' },
    supplierCategory: { fontSize: 15, fontWeight: '800', color: '#000', marginTop: 8 },
    supplierDesc: { fontSize: 12, color: '#888', marginTop: 4 },
    uspContainer: { marginTop: 15 },
    uspItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    uspIcon: { fontSize: 14, width: 25 },
    uspText: { fontSize: 12, color: '#555', fontWeight: '500' },
    browseBtn: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
    browseBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});

export default SuppliersSection;
