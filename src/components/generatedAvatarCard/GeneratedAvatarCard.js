import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcon from '../../common/SvgIcon';
import Label from '../../common';
import { SVG } from '../../assets';
import { hp, wp } from '../../enums/StyleGuide';

const GeneratedAvatarCard = ({ item, onToggleFavorite }) => {
  return (
    <View style={styles.generatedCardWrapper}>
      <LinearGradient
        colors={['#8A76F9', '#6D53F6']}
        style={styles.avatarImagePlaceholder}
      >
        <View style={styles.avatarIconCircle}>
          <SvgIcon icon={SVG.userAvatarWhite || SVG.brain} width={hp(3)} height={hp(3)} />
        </View>

        <View style={styles.styleBadge}>
          <Label style={styles.styleBadgeText}>{item.styleName}</Label>
        </View>
      </LinearGradient>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <SvgIcon icon={SVG.share || SVG.brain} width={hp(2)} height={hp(2)} />
        </TouchableOpacity>
        
        {/* Heart/Favorite Button */}
        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => onToggleFavorite(item.id)}
          activeOpacity={0.7}
        >
          <SvgIcon 
            icon={item.isFavorite ? SVG.heartFilled : SVG.heartOutline} 
            width={hp(2)} 
            height={hp(2)} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.downloadBtn]}>
          <SvgIcon icon={SVG.download} width={hp(2)} height={hp(2)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(GeneratedAvatarCard);

const styles = StyleSheet.create({
  generatedCardWrapper: {
    width: wp(43),
    alignItems: 'center',
  },
  avatarImagePlaceholder: {
    width: '100%',
    height: wp(43),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarIconCircle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBadge: {
    position: 'absolute',
    bottom: hp(1.5),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.6),
    borderRadius: hp(2),
  },
  styleBadgeText: {
    color: '#FFFFFF', // Fallback color agar COLORS import nahi karna to
    fontSize: hp(1.4),
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: hp(1),
    justifyContent: 'center',
    gap: wp(2),
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: wp(2.5),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtn: {},
});