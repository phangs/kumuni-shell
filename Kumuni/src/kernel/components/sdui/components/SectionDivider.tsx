import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';

const SectionDivider: React.FC<SDUIRenderingProps> = () => {
    return <View style={styles.sectionDivider} />;
};

const styles = StyleSheet.create({
    sectionDivider: { height: 10, backgroundColor: '#F0F0F2', marginVertical: 15 },
});

export default SectionDivider;
