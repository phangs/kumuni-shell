import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import SDUIIcon from './sdui/components/SDUIIcon';

const { height, width } = Dimensions.get('window');

interface Miniapp {
    id: string;
    label: string;
    emoji?: string;
    icon?: string;
    action: string;
}

interface MiniappDrawerProps {
    visible: boolean;
    onClose: () => void;
    miniapps: Miniapp[];
    loading: boolean;
    onMiniappPress: (action: string) => void;
    onExpand: () => void;
}

const MiniappDrawer: React.FC<MiniappDrawerProps> = ({
    visible,
    onClose,
    miniapps,
    loading,
    onMiniappPress,
    onExpand
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }: { item: Miniapp }) => (
        <TouchableOpacity
            style={styles.miniappItem}
            onPress={() => {
                onMiniappPress(item.action);
                onClose();
            }}
        >
            <View style={styles.iconContainer}>
                {item.icon ? (
                    <SDUIIcon data={{ props: { name: item.icon, size: 28, color: '#000' } }} />
                ) : (
                    <Text style={styles.emoji}>{item.emoji || '▦'}</Text>
                )}
            </View>
            <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.drawerContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>Services</Text>
                        <TouchableOpacity onPress={onExpand}>
                            <Text style={styles.seeAllText}>See All ↗</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>Fetching available services...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={miniapps}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No more services found.</Text>
                                </View>
                            }
                        />
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    drawerContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: height * 0.55,
        paddingTop: 15,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#F0F0F2',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 20,
        paddingTop: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3498db',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    miniappItem: {
        width: (width - 30) / 4,
        alignItems: 'center',
        marginBottom: 25,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
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
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    emptyContainer: {
        paddingTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
});

export default MiniappDrawer;
