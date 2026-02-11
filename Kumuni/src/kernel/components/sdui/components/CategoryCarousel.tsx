import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';

const CategoryCarousel: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={[styles.sectionContainer, { marginTop: 25 }]}>
            <View style={styles.rowBetween}>
                <Text style={[styles.sectionTitle, { fontSize: 20 }]}>{data.props.title}</Text>
                <TouchableOpacity><Text style={styles.linkText}>View All {'>'}</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingRight: 20 }}>
                {data.props.categories?.map((cat: any, i: number) => (
                    <TouchableOpacity key={i} style={styles.catItem}>
                        <View style={styles.catIconContainer}>
                            <Text style={{ fontSize: 26 }}>{cat.icon}</Text>
                        </View>
                        <Text style={styles.catLabel}>{cat.label}</Text>
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
    catScroll: { marginTop: 15 },
    catItem: { alignItems: 'center', marginRight: 20 },
    catIconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    catLabel: { fontSize: 12, fontWeight: '900', color: '#000' },
});

export default CategoryCarousel;
