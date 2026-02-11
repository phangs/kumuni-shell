import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import SDUIIcon from './SDUIIcon';

const ServicesGrid: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    return (
        <View style={styles.gridContainer}>
            {data.props.services?.map((service: any, i: number) => (
                <TouchableOpacity key={i} style={styles.serviceBox} onPress={() => onAction?.(service.action)}>
                    <View style={styles.serviceIconWrapper}>
                        <SDUIIcon
                            data={{
                                props: {
                                    name: service.icon || service.imageUrl || '▦',
                                    size: 45,
                                    color: '#000'
                                }
                            }}
                        />
                    </View>
                    <Text style={styles.serviceLabel} numberOfLines={2}>{service.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    serviceBox: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 5,
    },
    serviceIconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 18,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    serviceIconImg: {
        width: 38,
        height: 38,
    },
    serviceLabel: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 16,
    },
});

export default ServicesGrid;
