import React from 'react';
import { Text, StyleSheet, TextStyle, View, Image } from 'react-native';
import { SDUIRenderingProps } from '../SDUIRegistry';
import { SvgUri } from 'react-native-svg';

// --- SVG IMPORTS ---
import navHome from '../../../assets/icons/nav_home.svg';
import navMarketPlace from '../../../assets/icons/nav_marketplace.svg';
import navQR from '../../../assets/icons/nav_qr.svg';
import navWallet from '../../../assets/icons/nav_wallet.svg';
import wc_ArrowUp from '../../../assets/icons/circle_arrow_up_right.svg';
import searchIcon from '../../../assets/icons/search_icon.svg';
import searchMicrophone from '../../../assets/icons/search_microphone.svg';

/**
 * SDUIIcon - A flexible icon component supporting multiple formats
 * 
 * Supported formats:
 * 1. SVG: Managed via SVG_MAP (e.g., "home", "marketplace")
 * 2. URL: Remote SVG or Image (e.g., "https://example.com/icon.svg" or ".png")
 * 3. Emoji: Single character emoji (e.g., "✍️", "🛡️")
 * 4. Ionicons: "ionicons:name" (e.g., "ionicons:checkmark-circle")
 * 5. MaterialIcons: "material:name" (e.g., "material:check-circle")
 * 6. FontAwesome: "fa:name" (e.g., "fa:check-circle")
 * 7. Unicode: "unicode:U+XXXX" (e.g., "unicode:U+2713")
 * 
 * Props:
 * - name: string - Icon identifier
 * - size: number - Icon size (default: 24)
 * - color: string - Icon color (default: '#000')
 * - style: object - Additional styles
 */

// --- SVG IMPORTS ---
// Import your SVG files here after placing them in src/kernel/assets/icons/
// Example: import HomeIcon from '../../../assets/icons/home.svg';

// --- SVG MAPPING ---
// Map your imported SVGs to a name key
const SVG_MAP: { [key: string]: React.FC<any> } = {
    'home': navHome,
    'marketplace': navMarketPlace,
    'qr': navQR,
    'wallet': navWallet,
    'wc_arrowup': wc_ArrowUp,
    'search_icon': searchIcon,
    'search_microphone': searchMicrophone,
};

// Icon mapping for common icons (can be extended)
const ICON_MAP: { [key: string]: string } = {
    // Common UI icons
    'check': '✓',
    'checkmark': '✓',
    'close': '✕',
    'x': '✕',
    'menu': '☰',
    'home': '🏠',
    'user': '👤',
    'settings': '⚙️',
    'search': '🔍',
    'heart': '❤️',
    'star': '⭐',
    'arrow-right': '→',
    'arrow-left': '←',
    'arrow-up': '↑',
    'arrow-down': '↓',

    // Feature icons
    'shield': '🛡️',
    'lock': '🔒',
    'unlock': '🔓',
    'key': '🔑',
    'edit': '✍️',
    'pencil': '✏️',
    'sparkles': '✨',
    'lightning': '⚡',
    'fire': '🔥',
    'rocket': '🚀',
    'trophy': '🏆',
    'gift': '🎁',
    'bell': '🔔',
    'calendar': '📅',
    'clock': '🕐',
    'location': '📍',
    'map': '🗺️',
    'camera': '📷',
    'image': '🖼️',
    'document': '📄',
    'folder': '📁',
    'download': '⬇️',
    'upload': '⬆️',
    'share': '↗️',
    'link': '🔗',
    'mail': '✉️',
    'phone': '📞',
    'message': '💬',
    'chat': '💬',
    'info': 'ℹ️',
    'warning': '⚠️',
    'error': '❌',
    'success': '✅',
    'plus': '➕',
    'minus': '➖',
    'refresh': '🔄',
    'trash': '🗑️',
    'cart': '🛒',
    'wallet': '💰',
    'credit-card': '💳',
    'bank': '🏦',
    'chart': '📊',
    'graph': '📈',
    'marketplace': '🛍️',
    'qr': '🔳',
    'scan': '📸',
};

const SDUIIcon: React.FC<SDUIRenderingProps> = ({ data }) => {
    const { name, size = 24, color = '#000', style } = data.props || {};

    if (!name) return <Text style={{ fontSize: size }}>?</Text>;

    // 1. Check if it's a remote URL
    if (name.startsWith('http')) {
        if (name.toLowerCase().endsWith('.svg')) {
            return (
                <View style={style}>
                    <SvgUri uri={name} width={size} height={size} color={color} />
                </View>
            );
        }
        return (
            <Image
                source={{ uri: name }}
                style={[{ width: size, height: size }, style]}
                resizeMode="contain"
            />
        );
    }

    // 2. Check if it's an SVG from our map
    const SvgIcon = SVG_MAP[name.toLowerCase()];
    if (SvgIcon) {
        return (
            <View style={style}>
                <SvgIcon width={size} height={size} fill={color} />
            </View>
        );
    }

    const getIconContent = (): string => {
        // Check if it's already an emoji (single character or emoji)
        if (name.length <= 2) {
            return name;
        }

        // Check if it's in our icon map
        const mappedIcon = ICON_MAP[name.toLowerCase()];
        if (mappedIcon) {
            return mappedIcon;
        }

        // Handle unicode format: "unicode:U+XXXX"
        if (name.startsWith('unicode:')) {
            const codePoint = name.replace('unicode:U+', '');
            try {
                return String.fromCodePoint(parseInt(codePoint, 16));
            } catch {
                return '?';
            }
        }

        // For now, if it's a prefixed icon (ionicons:, material:, fa:),
        // we'll return a placeholder. In the future, this can integrate with icon libraries.
        if (name.includes(':')) {
            const [library, iconName] = name.split(':');
            return '◆'; // Generic icon placeholder
        }

        // Default: treat as emoji or return first character
        return name.charAt(0);
    };

    const iconContent = getIconContent();

    const iconStyle: TextStyle = {
        fontSize: size,
        color: color,
        ...style,
    };

    return <Text style={iconStyle}>{iconContent}</Text>;
};

export default SDUIIcon;
