import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SDUIRenderingProps } from '../SDUIRegistry';
import SDUIIcon from './SDUIIcon';
import { useTheme } from '../../ThemeProvider';

const MarketplaceHeader: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        Keyboard.dismiss();
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, []);
    return (
        <View style={[styles.mktHeaderContainer, { paddingTop: Math.max(insets.top, 50) }]}>
            <View style={styles.rowBetween}>
                <Text style={styles.mktTitle}>Marketplace</Text>
                <TouchableOpacity style={[styles.addShopBtn, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.addShopText}>🏪 Add Your Shop</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.mktSearchOuter}>
                <View style={styles.mktSearchWrapper}>
                    <SDUIIcon data={{ props: { name: 'search_icon', size: 18, color: '#C7C7CC' } }} />
                    <TextInput
                        ref={inputRef}
                        placeholder="Search"
                        placeholderTextColor="#999"
                        style={styles.mktInput}
                        autoFocus={false}
                    />
                    <SDUIIcon data={{ props: { name: 'search_microphone', size: 18, color: '#C7C7CC' } }} />
                </View>
                <TouchableOpacity style={styles.mktFilterBtn}>
                    <SDUIIcon data={{ props: { name: 'menu', size: 20, color: '#000' } }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mktHeaderContainer: { paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#FFF' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mktTitle: { fontSize: 32, fontWeight: '900', color: '#000' },
    addShopBtn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
    addShopText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    mktSearchOuter: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    mktSearchWrapper: { flex: 1, backgroundColor: '#F2F2F7', height: 50, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
    iconText: { fontSize: 20 },
    mktInput: { flex: 1, fontSize: 16, color: '#000', paddingHorizontal: 10 },
    mktFilterBtn: { marginLeft: 10, width: 50, height: 50, backgroundColor: '#F2F2F7', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});

export default MarketplaceHeader;
