import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getComponent, RendererContext } from './sdui/SDUIRegistry';

export interface SDUIData {
    type: string;
    props: any;
    visibleWhen?: {
        userLevel?: string[];
    };
    children?: SDUIData[];
}

interface SDUIRendererProps {
    data: SDUIData;
    onAction?: (action: string, params?: any) => void;
}

import UserManager from '../../shared/utils/UserManager';

const SDUIRenderer: React.FC<SDUIRendererProps> = ({ data, onAction }) => {
    if (!data) return null;

    // Handle visibility condition if present
    if (data.visibleWhen) {
        const { userLevel } = data.visibleWhen;
        if (userLevel && Array.isArray(userLevel)) {
            const currentUserLevel = UserManager.getInstance().getUserLevel();
            if (!userLevel.includes(currentUserLevel)) {
                return null;
            }
        }
    }

    const Component = getComponent(data.type);

    if (Component) {
        return (
            <RendererContext.Provider value={SDUIRenderer}>
                <Component data={data} onAction={onAction} />
            </RendererContext.Provider>
        );
    }

    // Fallback if component is not registered
    console.warn(`SDUI Component not found: ${data.type}`);
    return (
        <View style={styles.fallback}>
            <Text style={styles.fallbackText}>Unknown SDUI Component: {data.type}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    fallback: {
        padding: 10,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        margin: 10,
        borderWidth: 1,
        borderColor: '#FF0000',
    },
    fallbackText: {
        color: '#FF0000',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default SDUIRenderer;
