import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { useNavigation } from '@react-navigation/native';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';

const CAR_SIZE = wp(14);
const ITEM_SIZE = wp(8);

const JailBreakGame = () => {
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [collectedCount, setCollectedCount] = useState(0);

  const boardLayout = useRef({ width: 0, height: 0 });

  const initialCarPos = { x: wp(5), y: hp(40) };

  const [keys, setKeys] = useState([
    { id: 1, x: wp(40), y: hp(10), collected: false },
    { id: 2, x: wp(15), y: hp(25), collected: false },
    { id: 3, x: wp(65), y: hp(35), collected: false },
  ]);

  const policemen = [
    { id: 1, x: wp(35), y: hp(5) },
    { id: 2, x: wp(55), y: hp(20) },
    { id: 3, x: wp(38), y: hp(42) },
    { id: 4, x: wp(78), y: hp(22) },
  ];

  const doorPos = { x: wp(70), y: hp(10) };

  const translateX = useSharedValue(initialCarPos.x);
  const translateY = useSharedValue(initialCarPos.y);
  const contextX = useSharedValue(initialCarPos.x);
  const contextY = useSharedValue(initialCarPos.y);

  useEffect(() => {
    if (modalVisible) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver('CAUGHT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [modalVisible]);

  const handleGameOver = result => {
    setGameResult(result);
    setModalVisible(true);
  };

  const checkCollisions = (currentX, currentY) => {
    if (modalVisible) return;

    setKeys(prevKeys => {
      let updatedCount = 0;
      const newKeys = prevKeys.map(key => {
        if (!key.collected) {
          const dist = Math.hypot(currentX - key.x, currentY - key.y);
          if (dist < (CAR_SIZE + ITEM_SIZE) / 2.2) {
            return { ...key, collected: true };
          }
        }
        if (key.collected) updatedCount++;
        return key;
      });

      if (updatedCount !== collectedCount) {
        setCollectedCount(updatedCount);
      }
      return newKeys;
    });

    policemen.forEach(police => {
      const dist = Math.hypot(currentX - police.x, currentY - police.y);
      if (dist < (CAR_SIZE + ITEM_SIZE) / 2.2) {
        handleGameOver('CAUGHT');
      }
    });
    if (collectedCount === 3) {
      const dist = Math.hypot(currentX - doorPos.x, currentY - doorPos.y);
      if (dist < (CAR_SIZE + ITEM_SIZE) / 2) {
        handleGameOver('ESCAPED');
      }
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate(event => {
      if (modalVisible) return;

      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;

      runOnJS(checkCollisions)(translateX.value, translateY.value);
    })
    .onEnd(() => {
      translateX.value = withSpring(initialCarPos.x, {
        damping: 15,
        stiffness: 100,
      });
      translateY.value = withSpring(initialCarPos.y, {
        damping: 15,
        stiffness: 100,
      });
    });
  const animatedCarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const resetGame = () => {
    translateX.value = initialCarPos.x;
    translateY.value = initialCarPos.y;
    contextX.value = initialCarPos.x;
    contextY.value = initialCarPos.y;
    setKeys([
      { id: 1, x: wp(40), y: hp(10), collected: false },
      { id: 2, x: wp(15), y: hp(25), collected: false },
      { id: 3, x: wp(65), y: hp(35), collected: false },
    ]);
    setCollectedCount(0);
    setTimer(60);
    setModalVisible(false);
    setGameResult(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        {/* Header Info */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon icon={SVG.goBack} width={wp(5)} height={hp(2.5)} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Label style={styles.jailBreakText}>{en.jailBreak}</Label>
            <Label style={styles.subtext}>{en.escapeFromPrison}</Label>
          </View>
          <View />
        </View>

        {/* Stats Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <SvgIcon icon={SVG.stopWatch} width={hp(3)} height={hp(3)} />
            <Label style={styles.statLabel}>{timer}s</Label>
          </View>
          <View style={styles.statBox}>
            <SvgIcon icon={SVG.key} width={hp(3)} height={hp(3)} />
            <Label
              style={[
                styles.statLabel,
                { color: collectedCount === 3 ? '#4CAF50' : COLORS.white },
              ]}
            >
              {collectedCount}/3
            </Label>
          </View>
        </View>

        {/* Main Game Board Layout */}
        <View
          style={styles.boardContainer}
          onLayout={event => {
            const { width, height } = event.nativeEvent.layout;
            boardLayout.current = { width, height };
          }}
        >
          {/* Dynamic Items Mapping */}
          {keys.map(
            key =>
              !key.collected && (
                <View
                  key={key.id}
                  style={[
                    styles.staticItem,
                    styles.keyGlow,
                    { left: key.x, top: key.y },
                  ]}
                >
                  <SvgIcon icon={SVG.key} width={hp(3)} height={hp(3)} />
                </View>
              ),
          )}

          {policemen.map(police => (
            <View
              key={police.id}
              style={[
                styles.staticItem,
                styles.policeGlow,
                { left: police.x, top: police.y },
              ]}
            >
              <SvgIcon icon={SVG.policeMan} width={hp(3)} height={hp(3)} />
            </View>
          ))}

          {collectedCount === 3 && (
            <View
              style={[
                styles.staticItem,
                styles.doorGlow,
                { left: doorPos.x, top: doorPos.y },
              ]}
            >
              <SvgIcon icon={SVG.door} width={hp(3)} height={hp(3)} />
            </View>
          )}

          {/* Movable Free Car Component via GestureDetector */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.carContainer, animatedCarStyle]}>
              <SvgIcon icon={SVG.car} width={hp(4)} height={hp(4)} />
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Shared Modal Template Structure */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <StatusBar
              backgroundColor={COLORS.black}
              barStyle={'light-content'}
            />
            <View style={styles.modalContent}>
              <Label style={styles.modalIcon}>
                {gameResult === 'ESCAPED' ? (
                  <SvgIcon
                    icon={SVG.partyPopper}
                    width={hp(6)}
                    height={hp(6)}
                  />
                ) : (
                  <SvgIcon icon={SVG.siren} width={hp(6)} height={hp(6)} />
                )}
              </Label>

              <Label
                style={[
                  styles.modalTitle,
                  {
                    color:
                      gameResult === 'ESCAPED'
                        ? COLORS.darkGreen
                        : COLORS.darkRed,
                  },
                ]}
              >
                {gameResult === 'ESCAPED' ? en.escaped : en.caught}
              </Label>

              <Label style={styles.modalSubText}>
                {gameResult === 'ESCAPED'
                  ? en.escapedSubtext
                  : en.caughtSubtext}
              </Label>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={resetGame}
                >
                  <Label style={styles.buttonText}>
                    {gameResult === 'ESCAPED' ? en.playAgain : en.tryAgain}
                  </Label>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => navigation.goBack()}
                >
                  <Label style={styles.buttonText}>{en.close}</Label>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default JailBreakGame;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg || '#121212',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  jailBreakText: {
    fontFamily: FONT.bold,
    fontSize: hp(3.5),
    color: COLORS.white,
    letterSpacing: wp(0.5),
  },
  subtext: {
    color: COLORS.white + HEX_OPACITY[78],
    fontSize: hp(1.8),
    marginTop: 4,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
    maxHeight: hp(7),
  },
  statBox: {
    backgroundColor: '#1E1E1E',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: 12,
    minWidth: wp(35),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: hp(1),
  },
  iconButton: {
    backgroundColor: COLORS.yellow,
    padding: wp(3),
    borderRadius: wp(10),
  },
  statLabel: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  boardContainer: {
    flex: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: hp(4),
  },
  staticItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  carContainer: {
    position: 'absolute',
    width: CAR_SIZE,
    height: CAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.darkRed,
  },
  keyGlow: {
    shadowColor: COLORS.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  policeGlow: {
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  doorGlow: {
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(85),
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 24,
    padding: wp(6),
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: hp(6),
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: hp(3.5),
    marginBottom: hp(1.5),
    fontFamily:FONT.bold
  },
  modalSubText: {
    color: COLORS.lightWhite,
    fontSize: hp(2),
    textAlign: 'center',
    marginBottom: hp(4),
    fontFamily:FONT.medium
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: COLORS.darkGreen,
    paddingVertical: hp(1.8),
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
 closeButton: {
    flex: 1,
    backgroundColor: COLORS.darkRed,
    paddingVertical: hp(1.8),
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily:FONT.semiBold
  },
});
