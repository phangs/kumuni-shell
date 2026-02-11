import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    Modal,
    FlatList,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

interface PersonalInformationScreenProps {
    onBack: () => void;
    onSave: (data: any) => void;
    initialData?: {
        displayName: string;
        fullName: string;
        email?: string;
        mobileNumber: string;
        dob: string;
        nationality: string;
    };
}

const PersonalInformationScreen: React.FC<PersonalInformationScreenProps> = ({
    onBack,
    onSave,
    initialData
}) => {
    const insets = useSafeAreaInsets();

    const [formData, setFormData] = useState(initialData || {
        displayName: '',
        fullName: '',
        email: 'juan.delacruz@gmail.com',
        mobileNumber: '+63 987 654 3210',
        dob: '07-23-1980',
        nationality: 'Filipino',
    });

    const [showNationalityPicker, setShowNationalityPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateValue, setDateValue] = useState(new Date(1980, 6, 23)); // Default date

    const formatDate = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setDateValue(selectedDate);
            setFormData({ ...formData, dob: formatDate(selectedDate) });
        }
    };

    const EditField = ({ label, value, keyName, placeholder, editable = true, onPress }: any) => (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            style={styles.fieldCard}
        >
            <Text style={styles.fieldLabel}>{label}</Text>
            <View pointerEvents={onPress ? 'none' : 'auto'}>
                <TextInput
                    style={[styles.fieldInput, !editable && { color: '#8E8E93' }]}
                    value={value}
                    onChangeText={(text) => setFormData({ ...formData, [keyName]: text })}
                    placeholder={placeholder}
                    placeholderTextColor="#C7C7CD"
                    editable={editable && !onPress}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <View style={styles.helpIconCircle}>
                        <Text style={styles.helpIconText}>?</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Text style={{ fontSize: 50 }}>👨‍💼</Text>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Text style={styles.cameraIcon}>📷</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Display Name Section */}
                <View style={styles.sectionCard}>
                    <EditField
                        label="Display Name"
                        value={formData.displayName}
                        keyName="displayName"
                        placeholder="Enter your nickname"
                    />

                    <EditField
                        label="Email Address"
                        value={formData.email}
                        keyName="email"
                        placeholder="Enter your email"
                    />

                    <View style={styles.infoBox}>
                        <View style={styles.infoIconWrapper}>
                            <Text style={styles.infoIconText}>!</Text>
                        </View>
                        <Text style={styles.infoText}>
                            This is how others will see you in Kumuni. Choose a name that's easy to remember and represents you well - pwedeng nickname, business name, o anumang gusto mo! 😊
                        </Text>
                    </View>
                </View>

                {/* Main Personal Info Section */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <EditField
                        label="Fullname"
                        value={formData.fullName}
                        keyName="fullName"
                        placeholder="Enter your full name"
                    />

                    <EditField
                        label="Mobile Number"
                        value={formData.mobileNumber}
                        keyName="mobileNumber"
                        editable={false}
                    />

                    <EditField
                        label="Date of birth"
                        value={formData.dob}
                        keyName="dob"
                        onPress={() => setShowDatePicker(true)}
                    />

                    <EditField
                        label="Nationality"
                        value={formData.nationality}
                        keyName="nationality"
                        onPress={() => setShowNationalityPicker(true)}
                    />
                </View>

                {/* Nationality Picker Modal */}
                <Modal
                    visible={showNationalityPicker}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Nationality</Text>
                                <TouchableOpacity onPress={() => setShowNationalityPicker(false)}>
                                    <Text style={styles.closeBtn}>Close</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.pickerItem}
                                onPress={() => {
                                    setFormData({ ...formData, nationality: 'Filipino' });
                                    setShowNationalityPicker(false);
                                }}
                            >
                                <Text style={styles.pickerItemText}>Filipino</Text>
                                {formData.nationality === 'Filipino' && <Text style={styles.checkIcon}>✓</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.pickerItem}
                                onPress={() => {
                                    setFormData({ ...formData, nationality: 'Others' });
                                    setShowNationalityPicker(false);
                                }}
                            >
                                <Text style={styles.pickerItemText}>Others</Text>
                                {formData.nationality === 'Others' && <Text style={styles.checkIcon}>✓</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Date Picker */}
                {showDatePicker && Platform.OS === 'ios' && (
                    <Modal
                        visible={showDatePicker}
                        transparent={true}
                        animationType="slide"
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Date of Birth</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.closeBtn}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={dateValue}
                                        mode="date"
                                        display="spinner"
                                        onChange={handleDateChange}
                                        maximumDate={new Date()}
                                        textColor="#000"
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
                {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={dateValue}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => onSave(formData)}
                >
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        justifyContent: 'space-between',
    },
    headerBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#000',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    avatarWrapper: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 5,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    cameraIcon: {
        fontSize: 16,
        color: '#FFF',
    },
    sectionCard: {
        backgroundColor: '#F9F9FB',
        borderRadius: 28,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    fieldCard: {
        backgroundColor: '#F0F0F3',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 6,
        fontWeight: '500',
    },
    fieldInput: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
        padding: 0,
    },
    infoBox: {
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        marginTop: 5,
    },
    infoIconWrapper: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.8,
        borderColor: '#8E8E93',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    infoIconText: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '900',
    },
    infoText: {
        flex: 1,
        fontSize: 12.5,
        color: '#8E8E93',
        lineHeight: 18,
        fontWeight: '400',
    },
    saveBtn: {
        backgroundColor: '#D1D1D6',
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    saveBtnText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#FFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        minHeight: 300,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    closeBtn: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    pickerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    pickerItemText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },
    checkIcon: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: '700',
    },
    datePickerContainer: {
        flex: 1,
    },
});

export default PersonalInformationScreen;
