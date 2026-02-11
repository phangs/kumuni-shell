import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Animated,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeProvider';

const { width } = Dimensions.get('window');

interface PinCodeScreenProps {
    onComplete: (pin: string) => void;
}

const PinCodeScreen: React.FC<PinCodeScreenProps> = ({ onComplete }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [phase, setPhase] = useState<'set' | 'repeat'>('set');
    const [pin, setPin] = useState('');
    const [repeatPin, setRepeatPin] = useState('');

    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const currentPin = phase === 'set' ? pin : repeatPin;

    useEffect(() => {
        // Ensure standard keyboard is hidden when this screen is shown
        Keyboard.dismiss();
    }, []);

    const handleNumberPress = (num: string) => {
        if (currentPin.length >= 4) return;

        const newPin = currentPin + num;
        if (phase === 'set') {
            setPin(newPin);
        } else {
            setRepeatPin(newPin);
        }
    };

    const handleBackspace = () => {
        if (phase === 'set') {
            setPin(pin.slice(0, -1));
        } else {
            setRepeatPin(repeatPin.slice(0, -1));
        }
    };

    useEffect(() => {
        if (pin.length === 4 && phase === 'set') {
            const timer = setTimeout(() => {
                setPhase('repeat');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [pin, phase]);

    useEffect(() => {
        if (repeatPin.length === 4 && phase === 'repeat') {
            if (pin === repeatPin) {
                onComplete(pin);
            } else {
                startShake();
                setTimeout(() => {
                    setRepeatPin('');
                }, 500);
            }
        }
    }, [repeatPin, phase, pin, onComplete]);

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };

    const renderDot = (index: number) => {
        const isFilled = index < currentPin.length;
        return (
            <View
                key={index}
                style={[
                    styles.dot,
                    isFilled ? { backgroundColor: theme.colors.primary } : styles.dotEmpty
                ]}
            />
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />

            {/* Upper Content Area */}
            <View style={styles.contentArea}>
                <Text style={styles.title}>
                    {phase === 'set' ? 'Set your pincode' : 'Repeat your pincode'}
                </Text>

                <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                    {[0, 1, 2, 3].map(renderDot)}
                </Animated.View>
            </View>

            {/* Keypad Area */}
            <View style={[styles.keypadArea, { paddingBottom: insets.bottom + 40 }]}>
                {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, i) => (
                    <View key={i} style={styles.keypadRow}>
                        {row.map(num => (
                            <TouchableOpacity
                                key={num}
                                style={styles.key}
                                onPress={() => handleNumberPress(num.toString())}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.keyText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
                <View style={styles.keypadRow}>
                    <View style={styles.key} />
                    <TouchableOpacity
                        style={styles.key}
                        onPress={() => handleNumberPress('0')}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.keyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.key}
                        onPress={handleBackspace}
                        activeOpacity={0.6}
                    >
                        {currentPin.length > 0 && (
                            <View style={styles.backspaceIcon}>
                                <Text style={styles.backspaceText}>✕</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: '40%', // Take up top part of screen
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 60,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    dotEmpty: {
        backgroundColor: '#F2F2F7',
    },
    keypadArea: {
        flex: 2,
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    key: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 34,
        fontWeight: '400',
        color: '#000',
    },
    backspaceIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#FDECEC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backspaceText: {
        fontSize: 14,
        color: '#FF7F6F',
        fontWeight: '900',
    },
});

export default PinCodeScreen;
