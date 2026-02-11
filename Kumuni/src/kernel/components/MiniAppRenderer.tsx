import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SDUIRenderer from './SDUIRenderer';
import KernelBridge from '../../shared/api/KernelBridge';
import UserManager, { UserLevel } from '../../shared/utils/UserManager';
import Toast from './Toast';

interface Page {
    id: string;
    title: string;
    styleMode?: 'default' | 'fullscreen';
    components: any[];
}

interface MiniAppData {
    id: string;
    name: string;
    pages: Page[];
    navigation: {
        initialPageId: string;
        guestPageId?: string;
    };
}

interface MiniAppRendererProps {
    data: any;
    onAction?: (action: string, params?: any) => void;
    showHeader?: boolean;
}

import { SDUIRenderingProps, useRenderer, SDUIFormContext } from './sdui/SDUIRegistry';

const MiniAppHeader: React.FC<{
    title: string;
    canGoBack: boolean;
    onBack: () => void;
    onClose: () => void;
}> = ({ title, canGoBack, onBack, onClose }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <View style={styles.headerLeft}>
                {canGoBack && (
                    <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>← Back</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
                    <Text style={styles.headerBtnText}>✕ Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const MiniAppRenderer: React.FC<MiniAppRendererProps> = ({ data, onAction, showHeader = true }) => {
    const isMultiPage = data && Array.isArray(data.pages);
    const [pageStack, setPageStack] = useState<string[]>([]);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    useEffect(() => {
        if (isMultiPage && pageStack.length === 0) {
            const userManager = UserManager.getInstance();
            const isGuest = userManager.getUserLevel() === UserLevel.GUEST;
            const guestId = data.navigation?.guestPageId;
            const initialId = (isGuest && guestId) ? guestId : (data.navigation?.initialPageId || data.pages[0]?.id);
            setPageStack([initialId]);
        }
    }, [data, isMultiPage]);

    const currentPageId = pageStack[pageStack.length - 1];
    const currentPage = isMultiPage ? data.pages.find((p: Page) => p.id === currentPageId) : null;

    const validatePage = (page: Page) => {
        const missingFields: string[] = [];
        page.components.forEach((comp: any) => {
            const isRequired = comp.props?.required || comp.validation?.required;
            if (isRequired) {
                const value = formValues[comp.id];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    missingFields.push(comp.props.label || comp.id);
                }
            }
        });
        return missingFields;
    };

    const handleInternalAction = (action: string, params: any = {}) => {
        console.log(`MiniApp Action: ${action}`, params);

        if (action === '@onValueChange') {
            setFormValues(prev => ({ ...prev, [params.id]: params.value }));
            return;
        }

        if (action === '@pushPage') {
            if (currentPage) {
                const missing = validatePage(currentPage);
                if (missing.length > 0) {
                    setToast({
                        message: `Please fill in required fields: ${missing.join(', ')}`,
                        type: 'warning'
                    });
                    return;
                }
            }

            const nextId = params.pageId;
            if (data.pages.find((p: Page) => p.id === nextId)) {
                setPageStack([...pageStack, nextId]);
            } else {
                console.warn(`Page not found: ${nextId}`);
            }
            return;
        }

        if (action === '@popPage') {
            if (pageStack.length > 1) {
                setPageStack(pageStack.slice(0, -1));
            } else {
                onAction?.('nav_home'); // Exit miniapp
            }
            return;
        }

        if (action === '@submitForm') {
            if (currentPage) {
                const missing = validatePage(currentPage);
                if (missing.length > 0) {
                    setToast({
                        message: `Please fill in required fields: ${missing.join(', ')}`,
                        type: 'warning'
                    });
                    return;
                }
            }

            // Show success toast
            const successMessage = params.onSuccess?.params?.message || 'Form submitted successfully!';
            const toastType = params.onSuccess?.params?.type || 'success';
            setToast({ message: successMessage, type: toastType });

            // Navigate home after a short delay
            setTimeout(() => {
                onAction?.('nav_home');
            }, 2000);
            return;
        }

        if (action === '@toast') {
            setToast({
                message: params.message || 'Notification',
                type: params.type || 'info'
            });
            return;
        }

        if (action === '@register') {
            onAction?.('registration');
            return;
        }

        // Pass-through to parent
        onAction?.(action, params);
    };

    if (isMultiPage && !currentPage) return null;

    // Determine layout mode: 'default' (ScrollView + Padding) vs 'fullscreen' (View + No Padding)
    const isFullscreen = isMultiPage ? (currentPage?.styleMode === 'fullscreen') : (data?.styleMode === 'fullscreen');

    // Convert 'components' to 'children' for SDUIRenderer
    const pageData = {
        type: isFullscreen ? (isMultiPage ? 'container' : (data?.type || 'container')) : 'scrollview',
        props: isFullscreen
            ? (isMultiPage ? { style: { flex: 1, backgroundColor: '#FFF' } } : (data?.props || { style: { flex: 1, backgroundColor: '#FFF' } }))
            : { style: { flex: 1, backgroundColor: '#FFF' }, contentContainerStyle: { padding: 20, paddingBottom: 40 } },
        children: isMultiPage ? currentPage?.components : data?.components || data?.children
    };

    const formContextValue = {
        values: formValues,
        onValueChange: (id: string, value: any) => handleInternalAction('@onValueChange', { id, value })
    };

    return (
        <SDUIFormContext.Provider value={formContextValue}>
            <View style={styles.container}>
                {!isFullscreen && showHeader && (
                    <MiniAppHeader
                        title={(isMultiPage ? currentPage?.title : data.title) || data.name}
                        canGoBack={isMultiPage && pageStack.length > 1}
                        onBack={() => handleInternalAction('@popPage')}
                        onClose={() => onAction?.('nav_home')}
                    />
                )}
                <SDUIRenderer data={pageData} onAction={handleInternalAction} />
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onHide={() => setToast(null)}
                    />
                )}
            </View>
        </SDUIFormContext.Provider>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F2',
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    headerLeft: {
        width: 70,
        alignItems: 'flex-start',
    },
    headerRight: {
        width: 70,
        alignItems: 'flex-end',
    },
    headerBtn: {
        padding: 5,
    },
    headerBtnText: {
        fontSize: 14,
        color: '#007AFF', // iOS blue or similar theme color
        fontWeight: '600',
    },
});

export default MiniAppRenderer;
