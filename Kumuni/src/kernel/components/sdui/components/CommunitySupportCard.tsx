import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { useTheme } from '../../ThemeProvider';

const CommunitySupportCard: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.sectionContainer, { marginTop: 25, marginBottom: 40 }]}>
            <View style={styles.supportCard}>
                <Text style={{ textAlign: 'center', fontSize: 50, marginBottom: 20 }}>🤝</Text>
                <Text style={styles.supportTitle}>{data.props.title}</Text>
                <Text style={styles.supportSubtitle}>{data.props.subtitle}</Text>

                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    {data.props.primaryAction && (
                        <TouchableOpacity style={[styles.primarySupportBtn, { backgroundColor: theme.colors.primary }]} onPress={() => onAction?.(data.props.primaryAction.action)}>
                            <Text style={styles.primarySupportText}>{data.props.primaryAction.label}</Text>
                        </TouchableOpacity>
                    )}
                    {data.props.secondaryAction && (
                        <TouchableOpacity style={styles.secondarySupportBtn} onPress={() => onAction?.(data.props.secondaryAction.action)}>
                            <Text style={styles.secondarySupportText}>{data.props.secondaryAction.label}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: { paddingHorizontal: 20, marginTop: 15 },
    supportCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    supportTitle: { fontSize: 26, fontWeight: '900', color: '#000', textAlign: 'center' },
    supportSubtitle: { fontSize: 14, color: '#333', textAlign: 'center', marginTop: 15, lineHeight: 22, fontWeight: '500' },
    primarySupportBtn: { backgroundColor: '#000', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, flex: 1, marginRight: 10, alignItems: 'center' },
    primarySupportText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    secondarySupportBtn: { backgroundColor: '#F2F2F7', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, flex: 1, alignItems: 'center' },
    secondarySupportText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});

export default CommunitySupportCard;
