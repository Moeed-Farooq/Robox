import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { ConversionCard } from '../../components';
import { CONVERSION_TYPES } from '../../dummies';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { isIOS } from '../../helpers';
import { en } from '../../languages';
import { SafeAreaView } from 'react-native-safe-area-context';

const RbxCalculatorScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState(CONVERSION_TYPES[0]);

  const result = useMemo(() => {
    const value = Number(amount || 0);
    return selected.calculate(value).toFixed(2);
  }, [amount, selected]);

  const onReset = () => {
    setAmount('');
    setSelected(CONVERSION_TYPES[0]);
  };

  const renderItem = ({ item }) => (
    <ConversionCard
      item={item}
      selected={selected.id === item.id}
      onPress={() => setSelected(item)}
    />
  );
  const handleAmountChange = text => {
    setAmount(text.replace(/\D/g, ''));
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.circleBtn1}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon icon={SVG.goBack} width={hp(3)} height={hp(3)} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.circleBtn2}
            onPress={onReset}
          >
            <SvgIcon icon={SVG.restart} width={wp(5)} height={wp(5)} />
          </TouchableOpacity>
        </View>

        {/* Hero */}

        <View style={styles.heroShell}>
          <LinearGradient
            colors={[COLORS.yellow, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.heroContent}>
            <Label style={styles.heroTitle}>{en.RobuxCalculator}</Label>
            <Label style={styles.heroSub}>{en.premiumConversionsAwait}</Label>
          </View>
        </View>

        {/* Amount */}

        <View style={styles.section}>
          <Label style={styles.heading}>{en.enterAmount}</Label>

          <View style={styles.inputBox}>
            <TextInput
              value={amount}
              keyboardType="number-pad"
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor={COLORS.lightWhite}
              style={styles.input}
            />
          </View>
        </View>

        {/* Conversion */}

        <View style={styles.section}>
          <Label style={styles.heading}>{en.selectConversionType}</Label>

          <FlatList
            data={CONVERSION_TYPES}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            bounces={false}
            columnWrapperStyle={styles.column}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Result */}

        <View style={styles.resultCard}>
          <Label style={styles.resultTitle}>{en.conversionResult}</Label>

          <View style={styles.resultRow}>
            <View style={styles.symbolView}>
              <Label style={styles.resultSymbol}>{selected.symbol}</Label>
            </View>

            <Label style={styles.resultValue}>{result}</Label>
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
      </SafeAreaView>
  );
};

export default RbxCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(5),
    paddingVertical: isIOS() ? wp(1) : hp(2),
  },
  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: hp(2),
  },

  circleBtn1: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: COLORS.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBtn2: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: COLORS.contrastCoral,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroShell: {
    borderRadius: wp(5),
    marginBottom: hp(3),
    overflow: 'hidden',
  },
  heroContent: {
    paddingVertical: hp(2.4),
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: hp(2.6),
    fontFamily: FONT.bold,
    letterSpacing: 1,
  },

  heroSub: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
    marginTop: hp(0.5),
    opacity: 0.9,
  },

  section: {
    marginBottom: hp(2.5),
  },

  heading: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.semiBold,
    marginBottom: hp(1.2),
  },

  inputBox: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: '#324B76',
    paddingHorizontal: wp(4),
  },

  input: {
    color: COLORS.white,
    height: hp(6.5),
    fontSize: hp(2),
    fontFamily: FONT.medium,
  },

  column: {
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },

  resultCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: wp(5),
    paddingVertical: hp(1),
    alignItems: 'center',
    marginBottom: hp(1.5),
  },

  resultTitle: {
    color: '#B8C4D8',
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
    marginBottom: hp(0.8),
  },

  resultValue: {
    color: COLORS.lightestGreen,
    fontSize: hp(3.5),
    fontFamily: FONT.bold,
  },
  resultSymbol: {
    color: COLORS.lightestGreen,
    fontSize: hp(1.7),
    fontFamily: FONT.semiBold,
    alignSelf: 'center',
  },
  symbolView: {
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(2.6),
    borderTopRightRadius: wp(5),
    borderBottomLeftRadius: wp(5),
    borderColor: COLORS.green,
    borderWidth: wp(0.3),
    alignSelf: 'center',
  },
});
