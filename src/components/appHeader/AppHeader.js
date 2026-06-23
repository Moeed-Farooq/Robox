import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import en from '../../languages/en.json';
import { SVG } from '../../assets';
import Image from '../../common/Image';
import { IMAGES } from '../../assets/images';

const AppHeader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Label style={styles.hiText} >{en.HiLogan}</Label>
                <Label style={styles.goodEveText}>{en.GoodEvening}</Label>
            </View>
            <View style={styles.iconContainer}>
                <SVG.NotificationBell w={wp(6)} h={hp(6)} />
                <Image
                    src={IMAGES.PROFILE_PIC}
                    style={{ width: wp(14), height: wp(14), borderRadius: wp(4) }}
                />
            </View>
        </View>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightBlack,
        flexDirection: 'row',
        marginTop: hp(0.5),

    },
    hiText: {
        color: COLORS.lightGrey,
        fontFamily: FONT.regular,
        fontSize: hp(2)
    },
    goodEveText: {
        color: COLORS.lighttgrey,
        fontFamily: FONT.regular,
        fontSize: hp(2.5)
    },
    textContainer: {

    },
    iconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: wp(4),
        alignItems: 'center'
    },
    notificationIcon: {

    }
});