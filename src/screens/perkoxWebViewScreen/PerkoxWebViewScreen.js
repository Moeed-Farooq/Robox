import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
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

const isStoreOrExternalAppUrl = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const lower = url.toLowerCase();
  return (
    lower.startsWith('market://') ||
    lower.startsWith('itms://') ||
    lower.startsWith('itms-apps://') ||
    lower.startsWith('intent://') ||
    lower.includes('play.google.com/store') ||
    lower.includes('play.google.com/apps') ||
    lower.includes('market.android.com') ||
    lower.includes('apps.apple.com') ||
    lower.includes('itunes.apple.com')
  );
};

const PerkoxWebViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  const url = route?.params?.url || '';
  const title = route?.params?.title || 'Offer';

  const source = useMemo(() => ({ uri: url }), [url]);

  const openExternal = useCallback(async targetUrl => {
    try {
      await Linking.openURL(targetUrl);
      return true;
    } catch (error) {
      console.warn('Failed to open store/external URL:', error?.message || error);
      return false;
    }
  }, []);

  const handleBack = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    return false;
  }, [canGoBack, navigation]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return () => subscription.remove();
  }, [handleBack]);

  const handleShouldStartLoad = useCallback(
    request => {
      const requestUrl = request?.url;
      if (!requestUrl) {
        return true;
      }

      if (isStoreOrExternalAppUrl(requestUrl)) {
        openExternal(requestUrl);
        return false;
      }

      const scheme = String(requestUrl.split(':')[0] || '').toLowerCase();
      if (scheme && !['http', 'https', 'about', 'blob', 'data'].includes(scheme)) {
        openExternal(requestUrl);
        return false;
      }

      return true;
    },
    [openExternal],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
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
            ref={webViewRef}
            source={source}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={navState => {
              setCanGoBack(Boolean(navState?.canGoBack));
            }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            setSupportMultipleWindows={false}
            onOpenWindow={syntheticEvent => {
              const targetUrl = syntheticEvent?.nativeEvent?.targetUrl;
              if (targetUrl && isStoreOrExternalAppUrl(targetUrl)) {
                openExternal(targetUrl);
              } else if (targetUrl) {
                openExternal(targetUrl);
              }
            }}
            startInLoadingState
            allowsBackForwardNavigationGestures
            javaScriptEnabled
            domStorageEnabled
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
