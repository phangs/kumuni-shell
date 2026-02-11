import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Image, Platform } from 'react-native';
import { SDUIRenderingProps, useRenderer, SDUIFormContext } from '../SDUIRegistry';
import SDUIIcon from './SDUIIcon';
import DateTimePicker from '@react-native-community/datetimepicker';

export const SDUIContainer: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const SDUIRenderer = useRenderer();
    if (!SDUIRenderer) return null;

    return (
        <View style={data.props?.style}>
            {data.children?.map((child: any, index: number) => (
                <SDUIRenderer key={index} data={child} onAction={onAction} />
            ))}
        </View>
    );
};

export const SDUIScrollView: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    const SDUIRenderer = useRenderer();
    if (!SDUIRenderer) return null;

    return (
        <ScrollView style={data.props.style} contentContainerStyle={data.props.contentContainerStyle}>
            {data.children?.map((child: any, index: number) => (
                <SDUIRenderer key={index} data={child} onAction={onAction} />
            ))}
        </ScrollView>
    );
};

export const SDUIText: React.FC<SDUIRenderingProps> = ({ data, onAction }) => (
    <Text
        style={data.props.style}
        onPress={() => data.props.onPress && onAction?.(data.props.onPress.action)}
    >
        {data.props.text || data.props.content}
    </Text>
);

export const SDUIHeading: React.FC<SDUIRenderingProps> = ({ data }) => (
    <Text style={[styles.heading, data.props.style]}>
        {data.props.text || data.props.content}
    </Text>
);

export const SDUIImage: React.FC<SDUIRenderingProps> = ({ data }) => (
    <Image
        source={{ uri: data.props.source || data.props.imageUrl }}
        style={[styles.image, data.props.style]}
        resizeMode="contain"
    />
);

export const SDUIButton: React.FC<SDUIRenderingProps> = ({ data, onAction }) => {
    // Handle both { action: { type, params } } and { action: "string", actionParams: {} }
    const actionType = typeof data.action === 'object' ? data.action.type : (data.props.action || data.action);
    const actionParams = typeof data.action === 'object' ? data.action.params : (data.props.actionParams || {});
    const variant = data.props.variant || 'default';

    return (
        <TouchableOpacity
            style={[
                styles.buttonBase,
                data.props.style,
                variant === 'primary' && styles.btnPrimary,
                variant === 'outline' && styles.btnOutline
            ]}
            onPress={() => onAction?.(actionType, actionParams)}
            activeOpacity={0.8}
        >
            <Text style={[
                styles.btnText,
                data.props.textStyle,
                variant === 'primary' && styles.btnTextPrimary,
                variant === 'outline' && styles.btnTextOutline
            ]}>
                {data.props.text || data.props.label || data.props.title}
            </Text>
        </TouchableOpacity>
    );
};

export const SDUIInput: React.FC<SDUIRenderingProps> = ({ data }) => {
    const { values, onValueChange } = useContext(SDUIFormContext);
    const value = values[data.id] || '';

    return (
        <View style={[styles.inputContainer, data.props.style]}>
            {data.props.label && <Text style={styles.inputLabel}>{data.props.label}</Text>}
            <TextInput
                style={[styles.input, data.props.multiline && styles.textArea]}
                value={value}
                onChangeText={(text) => onValueChange(data.id, text)}
                placeholder={data.props.placeholder}
                keyboardType={data.props.keyboardType || 'default'}
                placeholderTextColor="#9EA1A8"
                multiline={data.props.multiline}
                numberOfLines={data.props.rows || 1}
                autoCapitalize={data.props.autoCapitalize || 'none'}
            />
        </View>
    );
};

export const SDUIDatePicker: React.FC<SDUIRenderingProps> = ({ data }) => {
    const { values, onValueChange } = useContext(SDUIFormContext);
    const [show, setShow] = useState(false);

    const value = values[data.id];
    const dateValue = value ? new Date(value) : new Date();
    const isSet = !!value;

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateValue;
        setShow(Platform.OS === 'ios');
        onValueChange(data.id, currentDate.toISOString());
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
        <View style={[styles.inputContainer, data.props.style]}>
            {data.props.label && <Text style={styles.inputLabel}>{data.props.label}</Text>}
            <TouchableOpacity
                style={styles.input}
                activeOpacity={0.7}
                onPress={showDatepicker}
            >
                <Text style={{
                    color: isSet ? '#1A1C1E' : '#9EA1A8',
                    marginTop: 14
                }}>
                    {isSet ? formatDate(dateValue) : (data.props.placeholder || 'Select Date')}
                </Text>
                <View style={{ position: 'absolute', right: 15, top: 15 }}>
                    <SDUIIcon data={{ props: { name: 'calendar', size: 18, color: isSet ? '#1A1C1E' : '#9EA1A8' } }} />
                </View>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dateValue}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1C1E',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 15,
    },
    buttonBase: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        minHeight: 56,
    },
    btnPrimary: {
        backgroundColor: '#000000',
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#E1E3E8',
    },
    btnText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#1A1C1E',
        fontWeight: '600',
    },
    btnTextPrimary: {
        color: '#FFFFFF',
    },
    btnTextOutline: {
        color: '#1A1C1E',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#44474E',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        height: 56,
        borderWidth: 1.5,
        borderColor: '#E1E3E8',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1A1C1E',
        backgroundColor: '#F9FAFC',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
});
