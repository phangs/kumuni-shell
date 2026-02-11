import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    StatusBar,
    Keyboard,
    Platform,
    UIManager,
    Animated,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';
import KernelBridge from '../../shared/api/KernelBridge';
import SDUIRenderer, { SDUIData } from './SDUIRenderer';
import SDUIIcon from './sdui/components/SDUIIcon';
import MiniAppRenderer from './MiniAppRenderer';
import MiniappDrawer from './MiniappDrawer';
import MiniappFullPage from './MiniappFullPage';
import RegistrationScreen from './RegistrationScreen';
import OTPScreen from './OTPScreen';
import PinCodeScreen from './PinCodeScreen';
import WelcomeModal from './WelcomeModal';
import ProfileScreen from './ProfileScreen';
import PersonalInformationScreen from './PersonalInformationScreen';
import EmailAddressScreen from './EmailAddressScreen';
import DigitalIdScreen from './DigitalIdScreen';
import HelpCenterScreen from './HelpCenterScreen';
import UserManager, { UserLevel } from '../../shared/utils/UserManager';

interface MainDashboardProps {
    onLogout?: () => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ onLogout }) => {
    const [sduiData, setSduiData] = useState<SDUIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState('/central/dashboard');
    const [showMoreDrawer, setShowMoreDrawer] = useState(false);
    const [showFullPage, setShowFullPage] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showOTPScreen, setShowOTPScreen] = useState(false);
    const [showPinScreen, setShowPinScreen] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);
    const [showEmailAddress, setShowEmailAddress] = useState(false);
    const [showDigitalId, setShowDigitalId] = useState(false);
    const [showHelpCenter, setShowHelpCenter] = useState(false);
    const [pendingMobile, setPendingMobile] = useState('');
    const [pendingToken, setPendingToken] = useState('');
    const [moreMiniapps, setMoreMiniapps] = useState<any[]>([]);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [userLevel, setUserLevel] = useState<UserLevel>(UserManager.getInstance().getUserLevel());
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const screenWidth = Dimensions.get('window').width;
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const [prevPath, setPrevPath] = useState('');
    const [prevSduiData, setPrevSduiData] = useState<SDUIData | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward');
    const [activeScreenKey, setActiveScreenKey] = useState('/central/dashboard');
    const sduiCache = React.useRef<{ [key: string]: SDUIData }>({});

    useEffect(() => {
        fetchScreenData(currentPath, prevPath);
    }, [currentPath]);

    const startTransition = (newData: SDUIData, endpoint: string, fromPath: string) => {
        // Determine direction
        const getPriority = (path: string) => {
            if (path.includes('dashboard')) return 0;
            if (path.includes('marketplace')) return 1;
            if (path.includes('help')) return 2;
            if (path.includes('registration') || path.includes('profile')) return 3;
            return 4;
        };
        const isBack = getPriority(endpoint) < getPriority(fromPath);
        const dir = isBack ? 'back' : 'forward';
        setTransitionDirection(dir);

        // 1. Prepare "Entering" view position off-screen
        const entryStart = isBack ? -screenWidth : screenWidth;
        slideAnim.setValue(entryStart);
        fadeAnim.setValue(0);

        // 2. Commit the new data and start transition mode
        setSduiData(newData);
        setActiveScreenKey(endpoint);
        setIsTransitioning(true);

        // 3. Small delay to ensure React has mounted the new heavy UI components
        setTimeout(() => {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 4,
                }),
                Animated.spring(fadeAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 18,
                    bounciness: 0,
                })
            ]).start(() => {
                setIsTransitioning(false);
                setPrevSduiData(null);
            });
        }, 40);
    };

    const fetchScreenData = async (endpoint: string, fromPath: string = '') => {
        const cachedData = sduiCache.current[endpoint];

        // If we have cached data, show it immediately!
        if (cachedData) {
            console.log(`MainDashboard: Using cached data for ${endpoint}`);
            startTransition(cachedData, endpoint, fromPath);
        } else {
            setLoading(true);
        }

        try {
            const clientType = endpoint.startsWith('/tenant') ? 'tenant' : 'central';
            const response = await KernelBridge.makeSecureRequest({
                moduleId: 'shell',
                endpoint: endpoint,
                method: 'GET',
                clientType: clientType,
            });

            if (response.success) {
                const newData = response.data;
                sduiCache.current[endpoint] = newData;

                if (!cachedData) {
                    // This is our first time seeing this page, animate it in
                    startTransition(newData, endpoint, fromPath);
                } else {
                    // We already showed the cache, just update the data silently
                    // React will update only what's necessary (prices, text, etc.)
                    setSduiData(newData);
                }
            } else {
                if (!cachedData) throw new Error(response.message || 'Failed to fetch screen data');
            }
        } catch (err) {
            console.error('Error fetching screen data:', err);
            if (!cachedData) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action: string, params: any = {}) => {
        console.log(`Dashboard Action: ${action}`, params);

        // Handle Navigation Actions
        if (action === 'nav_home') {
            // Clear overlays
            setShowHelpCenter(false);
            setShowProfile(false);
            setShowRegistration(false);
            setShowMoreDrawer(false);
            setShowFullPage(false);

            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/central/dashboard');
            return;
        }
        if (action === 'nav_marketplace') {
            // Clear overlays
            setShowHelpCenter(false);
            setShowProfile(false);
            setShowRegistration(false);
            setShowMoreDrawer(false);
            setShowFullPage(false);

            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/central/marketplace');
            return;
        }

        if (action === 'nav_wallet') {
            Alert.alert('Wallet', 'Wallet feature coming soon!');
            return;
        }

        if (action === 'more') {
            handleShowMore();
            return;
        }

        if (action === 'registration' || action === 'seller_signup' || action === 'signup') {
            if (userLevel === UserLevel.GUEST) {
                if (sduiData) setPrevSduiData(sduiData);
                setPrevPath(currentPath);
                setCurrentPath('/central/registration');
            } else {
                setShowRegistration(true);
            }
            return;
        }

        if (action === 'nav_profile') {
            if (userLevel === UserLevel.GUEST) {
                if (sduiData) setPrevSduiData(sduiData);
                setPrevPath(currentPath);
                setCurrentPath('/central/registration');
            } else {
                setShowProfile(true);
            }
            return;
        }

        if (action === 'help' || action === 'nav_help') {
            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/central/help');
            return;
        }

        if (action === '@popPage') {
            if (sduiData) setPrevSduiData(sduiData);
            const targetPath = (prevPath && prevPath !== '/central/registration') ? prevPath : '/central/dashboard';
            setPrevPath(currentPath);
            setCurrentPath(targetPath);
            return;
        }

        if (action === '@sendOTP') {
            handleSendOTP(params.phone);
            return;
        }

        if (action === 'solo') {
            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/tenant/sdui/solo-parent-form');
            return;
        }

        if (action === 'cedula') {
            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/tenant/sdui/cedula-app');
            return;
        }

        if (action === 'submit_form') {
            const { moduleId, endpoint, method, data: submitData, onSuccess } = params;
            setLoading(true);
            KernelBridge.makeSecureRequest({
                moduleId: moduleId || 'shell',
                endpoint,
                method: method || 'POST',
                clientType: 'tenant',
                body: submitData || { timestamp: new Date().toISOString() }
            }).then(response => {
                if (response.success) {
                    if (onSuccess?.type === '@toast') {
                        Alert.alert('Success', onSuccess.params?.message || 'Done!');
                    } else {
                        Alert.alert('Success', response.message || 'Form submitted successfully!');
                    }
                    setCurrentPath('/central/dashboard');
                } else {
                    Alert.alert('Error', response.message || 'Submission failed');
                }
            }).catch(err => {
                Alert.alert('Error', 'An error occurred during submission');
            }).finally(() => {
                setLoading(false);
            });
            return;
        }

        if (action === 'continue') {
            if (sduiData) setPrevSduiData(sduiData);
            setPrevPath(currentPath);
            setCurrentPath('/central/onboarding');
            return;
        }

        Alert.alert('Action Triggered', `Action: ${action}\nParams: ${JSON.stringify(params)}`);
    };

    const handleSendOTP = async (num: string) => {
        Keyboard.dismiss();
        setPendingMobile(num);
        setLoading(true);
        try {
            const response = await KernelBridge.makeSecureRequest({
                moduleId: 'shell',
                endpoint: '/auth/otp/send',
                method: 'POST',
                clientType: 'central',
                body: { phoneNumber: num }
            });
            if (response.success) {
                setShowRegistration(false);
                setShowOTPScreen(true);
            } else {
                Alert.alert('Error', response.message || 'Failed to send OTP');
            }
        } catch (err) {
            console.error('OTP Send Error:', err);
            Alert.alert('Error', 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            const response = await KernelBridge.makeSecureRequest({
                moduleId: 'shell',
                endpoint: '/auth/otp/verify',
                method: 'POST',
                clientType: 'central',
                body: { phoneNumber: pendingMobile, otp }
            });

            if (response.success && response.token) {
                setPendingToken(response.token);
                setShowOTPScreen(false);
                setShowPinScreen(true);
            } else {
                Alert.alert('Verification Failed', 'Invalid code entered.');
            }
        } catch (err) {
            console.error('Verification Error:', err);
            Alert.alert('Error', 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePinComplete = async (pin: string) => {
        setLoading(true);
        try {
            // In a real app, we would send the PIN to the backend to secure the account
            console.log('PIN Setup Complete:', pin);

            // Properly use UserManager to transition to REGISTERED mode
            await UserManager.getInstance().initializeRegisteredMode(pendingToken, 'dev-tenant-123');

            setShowPinScreen(false);
            setShowWelcomeModal(true);

            // Refresh dashboard data to show wallet etc.
            fetchScreenData('/central/dashboard');
        } catch (err) {
            console.error('PIN Setup Error:', err);
            Alert.alert('Error', 'Failed to set PIN');
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        setShowMoreDrawer(true);
        setFetchingMore(true);
        try {
            const response = await KernelBridge.makeSecureRequest({
                moduleId: 'shell',
                endpoint: '/miniapps/more',
                method: 'GET',
                clientType: 'tenant',
            });
            if (response.success) {
                setMoreMiniapps(response.data);
            } else {
                console.error('Failed to fetch more miniapps:', response.message);
            }
        } catch (err) {
            console.error('Error fetching more miniapps:', err);
        } finally {
            setFetchingMore(false);
        }
    };

    const getActiveTab = (): 'home' | 'marketplace' | 'wallet' | 'profile' | 'help' | null => {
        if (currentPath.includes('help')) return 'help';
        if (currentPath.includes('dashboard')) return 'home';
        if (currentPath.includes('marketplace')) return 'marketplace';
        if (currentPath.includes('wallet')) return 'wallet';
        if (currentPath.includes('profile')) return 'profile';
        return null; // Hide nav bar for detailed views/miniapps
    };

    const activeTab = getActiveTab();

    const handleLogout = async () => {
        await UserManager.getInstance().logout();
        setUserLevel(UserLevel.GUEST);
        setCurrentPath('/central/dashboard');
        setShowProfile(false);
        if (onLogout) onLogout();
    };

    if (loading && !sduiData) {
        return (
            <View style={[styles.container, { backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your experience...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={styles.errorText}>Oops! {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchScreenData(currentPath)}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <View style={{ flex: 1, overflow: 'hidden' }}>
                {/* Previous Page (Exiting) */}
                {isTransitioning && prevSduiData && (
                    <Animated.View style={[
                        StyleSheet.absoluteFill,
                        {
                            // Old page fades out as fadeAnim goes 0 -> 1
                            opacity: fadeAnim.interpolate({
                                inputRange: [0.1, 1],
                                outputRange: [1, 0],
                                extrapolate: 'clamp'
                            }),
                            transform: [{
                                translateX: slideAnim.interpolate({
                                    inputRange: [-screenWidth, 0, screenWidth],
                                    outputRange: [screenWidth, 0, -screenWidth],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }
                    ]}>
                        <MiniAppRenderer key="prev-page" data={prevSduiData} onAction={() => { }} showHeader={!activeTab} />
                    </Animated.View>
                )}

                {/* Current Page (Entering) */}
                <Animated.View style={{
                    flex: 1,
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }]
                }}>
                    {sduiData && <MiniAppRenderer key={activeScreenKey} data={sduiData} onAction={handleAction} showHeader={!activeTab} />}
                </Animated.View>
            </View>

            {/* Premium Loading Bar at top */}
            {loading && !isTransitioning && (
                <View style={styles.topLoadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
            )}

            {/* Global Floating Navigation Bar */}
            {activeTab && (
                <View style={[styles.navContainer, { bottom: Math.max(insets.bottom, 20) }]}>
                    <View style={styles.navBar}>
                        {userLevel === UserLevel.GUEST ? (
                            // Guest Nav Bar: 4 Icons
                            <>
                                <TouchableOpacity onPress={() => handleAction('nav_home')} style={styles.navItem}>
                                    <View style={activeTab === 'home' ? styles.activeIconCircle : null}>
                                        <SDUIIcon data={{ props: { name: 'nav_home_guest', size: 30, color: activeTab === 'home' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'home' ? 1 : 0.6 } } }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAction('nav_marketplace')} style={styles.navItem}>
                                    <View style={activeTab === 'marketplace' ? styles.activeIconCircle : null}>
                                        <SDUIIcon data={{ props: { name: 'nav_marketplace_guest', size: 30, color: activeTab === 'marketplace' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'marketplace' ? 1 : 0.6 } } }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAction('help')} style={styles.navItem}>
                                    <View style={activeTab === 'help' ? styles.activeIconCircle : null}>
                                        <SDUIIcon data={{ props: { name: 'nav_help_guest', size: 30, color: activeTab === 'help' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'help' ? 1 : 0.6 } } }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAction('nav_profile')} style={styles.navItem}>
                                    <View style={activeTab === 'profile' ? styles.activeIconCircle : null}>
                                        <SDUIIcon data={{ props: { name: 'nav_person_guest', size: 30, color: activeTab === 'profile' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'profile' ? 1 : 0.6 } } }} />
                                    </View>
                                </TouchableOpacity>
                            </>
                        ) : (
                            // Registered/Verified Nav Bar: 5 Icons with Central QR
                            <>
                                <TouchableOpacity onPress={() => handleAction('nav_home')}>
                                    <SDUIIcon data={{ props: { name: 'home', size: 35, color: activeTab === 'home' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'home' ? 1 : 0.6 } } }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAction('nav_marketplace')}>
                                    <SDUIIcon data={{ props: { name: 'marketplace', size: 35, color: activeTab === 'marketplace' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'marketplace' ? 1 : 0.6 } } }} />
                                </TouchableOpacity>
                                <View style={styles.qrCircle}>
                                    <SDUIIcon data={{ props: { name: 'qr', size: 35, color: '#000' } }} />
                                </View>
                                <TouchableOpacity onPress={() => handleAction('nav_wallet')}>
                                    <SDUIIcon data={{ props: { name: 'wallet', size: 35, color: activeTab === 'wallet' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'wallet' ? 1 : 0.6 } } }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAction('nav_profile')}>
                                    <SDUIIcon data={{ props: { name: 'user', size: 35, color: activeTab === 'profile' ? theme.colors.primary : '#FFF', style: { opacity: activeTab === 'profile' ? 1 : 0.6 } } }} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            )}

            {/* More Miniapps Drawer */}
            <MiniappDrawer
                visible={showMoreDrawer}
                loading={fetchingMore}
                miniapps={moreMiniapps}
                onClose={() => setShowMoreDrawer(false)}
                onExpand={() => {
                    setShowMoreDrawer(false);
                    setShowFullPage(true);
                }}
                onMiniappPress={(action) => handleAction(action, {})}
            />

            {/* All Miniapps Full Page */}
            {showFullPage && (
                <View style={StyleSheet.absoluteFill}>
                    <MiniappFullPage
                        miniapps={moreMiniapps}
                        loading={fetchingMore}
                        onClose={() => setShowFullPage(false)}
                        onMiniappPress={(action) => {
                            setShowFullPage(false);
                            handleAction(action, {});
                        }}
                    />
                </View>
            )}

            {/* Profile Screen */}
            {showProfile && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
                    <ProfileScreen
                        onBack={() => setShowProfile(false)}
                        userData={{
                            name: 'User',
                            fullName: '',
                            phone: pendingMobile ? `+63 ${pendingMobile}` : '+63 987 654 3210',
                            isVerified: false
                        }}
                        onAction={(act) => {
                            if (act === 'logout') {
                                handleLogout();
                            }
                            if (act === 'personal_info') {
                                setShowPersonalInfo(true);
                            }
                            if (act === 'email_address') {
                                setShowEmailAddress(true);
                            }
                            if (act === 'digital_id') {
                                setShowDigitalId(true);
                            }
                            console.log('Profile Action:', act);
                        }}
                    />
                </View>
            )}

            {/* Personal Information Edit Screen */}
            {showPersonalInfo && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1100 }]}>
                    <PersonalInformationScreen
                        onBack={() => setShowPersonalInfo(false)}
                        initialData={{
                            displayName: '',
                            fullName: '',
                            email: 'juan.delacruz@gmail.com',
                            mobileNumber: pendingMobile ? `+63 ${pendingMobile}` : '+63 987 654 3210',
                            dob: '07-23-1980',
                            nationality: 'Filipino',
                        }}
                        onSave={(data) => {
                            console.log('Saving User Info:', data);
                            setShowPersonalInfo(false);
                        }}
                    />
                </View>
            )}

            {/* Email Address Screen */}
            {showEmailAddress && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1200 }]}>
                    <EmailAddressScreen
                        onBack={() => setShowEmailAddress(false)}
                        initialEmail=""
                        onSave={(email) => {
                            console.log('Saving Email:', email);
                            setShowEmailAddress(false);
                        }}
                    />
                </View>
            )}

            {/* Digital ID Screen */}
            {showDigitalId && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1300 }]}>
                    <DigitalIdScreen
                        onBack={() => setShowDigitalId(false)}
                    />
                </View>
            )}

            {/* Help Center Screen is now handled via SDUI Transition */}

            {/* Registration Screen is now handled via SDUI Transition for Guests */}

            {/* OTP Verification Screen */}
            {showOTPScreen && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1001 }]}>
                    <OTPScreen
                        mobileNumber={pendingMobile}
                        onBack={() => setShowOTPScreen(false)}
                        onVerify={handleVerifyOTP}
                        onResend={() => handleSendOTP(pendingMobile)}
                    />
                </View>
            )}

            {/* PIN Setup Screen */}
            {showPinScreen && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 1002 }]}>
                    <PinCodeScreen
                        onComplete={async (pin) => {
                            await handlePinComplete(pin);
                            setUserLevel(UserLevel.REGISTERED);
                        }}
                    />
                </View>
            )}

            {/* Welcome Modal for newly registered users */}
            <WelcomeModal
                visible={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
            />

            {/* Overlay loading for transitions */}
            {loading && (
                <View style={styles.overlayLoading}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    retryText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    overlayLoading: {
        display: 'none', // Hide the old floating loader
    },
    topLoadingContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        right: 25,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 20,
        elevation: 10,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    navContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 20,
        zIndex: 3000 // Ensure it's above all overlays like Help Center (2000)
    },
    navBar: {
        height: 75,
        backgroundColor: 'rgba(28, 28, 30, 0.85)',
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    navIcon: { fontSize: 24, color: '#FFF', opacity: 0.6 },
    qrCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -45,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    activeIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default MainDashboard;

