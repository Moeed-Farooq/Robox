import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';

const PerkoxWebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);

  const url = route?.params?.url || '';
  const title = route?.params?.title || 'Offer';

  const source = useMemo(() => ({ uri: url }), [url]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(2.8)} width={hp(2.8)} />
        </TouchableOpacity>
        <Label style={styles.title} numberOfLines={1}>
          {title}
        </Label>
        <View style={styles.headerSpacer} />
      </View>

      {!url ? (
        <View style={styles.centered}>
          <Label style={styles.errorText}>Offer link is unavailable.</Label>
        </View>
      ) : (
        <View style={styles.webWrap}>
          <WebView
            source={source}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
            allowsBackForwardNavigationGestures
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
            style={styles.webview}
          />
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

export default PerkoxWebViewScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  backButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginHorizontal: wp(3),
    color: COLORS.lightYellow,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
  },
  headerSpacer: {
    width: hp(5),
  },
  webWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.splashBg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  errorText: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    textAlign: 'center',
  },
});
