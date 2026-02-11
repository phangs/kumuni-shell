import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SDUIRenderingProps } from '../SDUIRegistry';
import UserManager, { UserLevel } from '../../../../shared/utils/UserManager';
import SDUIIcon from './SDUIIcon';
import { useTheme } from '../../ThemeProvider';

const DashboardHeader: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const userLevel = UserManager.getInstance().getUserLevel();
    const isGuestHeader = userLevel === UserLevel.GUEST;
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        // Double security: ensure keyboard is closed and input is blurred on mount
        Keyboard.dismiss();
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }, []);

    if (isGuestHeader) {
        return (
            <View style={[styles.headerContainer, { backgroundColor: theme.colors.primary, paddingTop: insets.top + 10, paddingBottom: 15 }]}>
                <View style={styles.searchBarWrapper}>
                    <SDUIIcon data={{ props: { name: 'search_icon', size: 20, color: '#999' } }} />
                    <TextInput
                        ref={inputRef}
                        placeholder={data.props.searchPlaceholder || "Search..."}
                        placeholderTextColor="#999"
                        style={styles.headerInput}
                        autoFocus={false}
                    />
                    <SDUIIcon data={{ props: { name: 'search_microphone', size: 20, color: '#999' } }} />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.headerContainer, { backgroundColor: '#FFF', paddingTop: insets.top + 5, paddingBottom: 10 }]}>
            <View style={styles.headerTopRow}>
                <TouchableOpacity style={styles.profileSection} onPress={() => onAction?.('nav_profile')}>
                    <View style={styles.avatarWrapper}>
                        <Text style={{ fontSize: 16 }}>{data.props.userEmoji || '👨‍💼'}</Text>
                    </View>
                    <Text style={styles.profileName}>{data.props.userName || 'User'}</Text>
                    <Text style={styles.profileArrow}>〉</Text>
                </TouchableOpacity>

                <View style={styles.headerRightIcons}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Image
                            source={{ uri: data.props.cityLogoUrl || 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/City_Logo.png' }}
                            style={styles.cityLogo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconBtn} onPress={() => onAction?.('help')}>
                        <View style={styles.helpIconCircle}>
                            <Text style={styles.helpIconText}>?</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchBarWrapperShadow}>
                <SDUIIcon data={{ props: { name: 'search_icon', size: 18, color: '#C7C7CC' } }} />
                <TextInput
                    ref={inputRef}
                    placeholder={data.props.searchPlaceholder || "Search"}
                    placeholderTextColor="#999"
                    style={styles.headerInput}
                    autoFocus={false}
                />
                <SDUIIcon data={{ props: { name: 'mic_icon', size: 18, color: '#C7C7CC' } }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    searchBarWrapper: {
        backgroundColor: '#FFF',
        height: 48,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerInput: {
        flex: 1,
        fontSize: 17,
        color: '#000',
        paddingHorizontal: 12,
        fontWeight: '400',
    },
    iconText: { fontSize: 20 },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: 15,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginLeft: 10,
    },
    profileArrow: {
        fontSize: 12,
        color: '#000',
        marginLeft: 8,
        fontWeight: '700',
    },
    headerRightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconBtn: {
        marginLeft: 12,
    },
    cityLogo: {
        width: 28,
        height: 28,
    },
    helpIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpIconText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    searchBarWrapperShadow: {
        backgroundColor: '#FFF',
        height: 52,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: '#F2F2F7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchIconGrey: {
        fontSize: 18,
        color: '#C7C7CC',
    },
    micIconGrey: {
        fontSize: 18,
        color: '#C7C7CC',
    },
});

export default DashboardHeader;
