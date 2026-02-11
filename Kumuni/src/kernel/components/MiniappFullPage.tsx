import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import SDUIIcon from './sdui/components/SDUIIcon';

const { width } = Dimensions.get('window');

interface Miniapp {
    id: string;
    label: string;
    emoji?: string;
    icon?: string;
    action: string;
}

interface MiniappFullPageProps {
    miniapps: Miniapp[];
    loading: boolean;
    onClose: () => void;
    onMiniappPress: (action: string) => void;
}

const MiniappFullPage: React.FC<MiniappFullPageProps> = ({
    miniapps,
    loading,
    onClose,
    onMiniappPress
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }: { item: Miniapp }) => (
        <TouchableOpacity
            style={styles.miniappItem}
            onPress={() => onMiniappPress(item.action)}
        >
            <View style={styles.iconContainer}>
                {item.icon ? (
                    <SDUIIcon data={{ props: { name: item.icon, size: 28, color: '#000' } }} />
                ) : (
                    <Text style={styles.emoji}>{item.emoji || '▦'}</Text>
                )}
            </View>
            <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>All Services</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Loading all available services...</Text>
                </View>
            ) : (
                <FlatList
                    data={miniapps}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={4}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={styles.subtitle}>Discover more ways Kumuni can help you today.</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No services found at the moment.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F7',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 24,
        color: '#000',
        fontWeight: '300',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
        letterSpacing: -0.5,
    },
    listHeader: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    miniappItem: {
        width: (width - 20) / 4,
        alignItems: 'center',
        marginBottom: 25,
    },
    iconContainer: {
        width: 65,
        height: 65,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F0F0F2',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    emoji: {
        fontSize: 28,
    },
    label: {
        fontSize: 11,
        textAlign: 'center',
        color: '#333',
        fontWeight: '600',
        paddingHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 15,
        color: '#888',
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
});

export default MiniappFullPage;
