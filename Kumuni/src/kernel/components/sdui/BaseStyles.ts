import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const baseStyles = StyleSheet.create({
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonBase: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        textAlign: 'center',
    },
    sectionDivider: {
        height: 10,
        backgroundColor: '#F0F0F2',
        marginVertical: 15
    },
});

export const screenWidth = width;
