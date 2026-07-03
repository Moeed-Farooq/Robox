import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';

const INITIAL_KEYS = [
  { id: 1, x: wp(16), y: hp(18) },
  { id: 2, x: wp(70), y: hp(24) },
  { id: 3, x: wp(50), y: hp(42) },
];

const POLICE_OFFICERS = [
  { id: 1, x: wp(12), y: hp(54) },
  { id: 2, x: wp(64), y: hp(58) },
];

const DOOR_POSITION = { x: wp(78), y: hp(60) };
const CAR_SIZE = { width: 72, height: 44 };

const JailBreakGame = () => {
  const [carPosition, setCarPosition] = useState({ x: wp(8), y: hp(8) });
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [modalState, setModalState] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const carRect = {
    x: carPosition.x,
    y: carPosition.y,
    width: CAR_SIZE.width,
    height: CAR_SIZE.height,
  };

  useEffect(() => {
    if (modalState) {
      return;
    }

    const touchedKey = keys.find(item => intersects(carRect, item, 46));
    if (touchedKey) {
      setKeys(prev => prev.filter(key => key.id !== touchedKey.id));
      return;
    }

    const touchedPolice = POLICE_OFFICERS.find(item => intersects(carRect, item, 56));
    if (touchedPolice) {
      setModalState('caught');
      return;
    }

    if (keys.length === 0) {
      if (intersects(carRect, DOOR_POSITION, 58, 110)) {
        setModalState('escaped');
      }
    }
  }, [carPosition, keys, modalState]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      dragStartRef.current = carPosition;
    },
    onPanResponderMove: (_event, gesture) => {
      setCarPosition({
        x: Math.max(0, Math.min(wp(84), dragStartRef.current.x + gesture.dx)),
        y: Math.max(0, Math.min(hp(64), dragStartRef.current.y + gesture.dy)),
      });
    },
  });

  const resetGame = () => {
    setCarPosition({ x: wp(8), y: hp(8) });
    setKeys(INITIAL_KEYS);
    setModalState(null);
  };

  const renderModal = () => {
    if (!modalState) {
      return null;
    }

    const isEscape = modalState === 'escaped';

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Label style={styles.modalTitle}>{isEscape ? 'Escaped' : 'Caught'}</Label>
          <Label style={styles.modalText}>
            {isEscape
              ? 'You reached the door and escaped the jail.'
              : 'A police officer spotted your car and caught you.'}
          </Label>
          <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
            <Label style={styles.modalButtonText}>
              {isEscape ? 'Play Again' : 'Try Again'}
            </Label>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer} testID="jail-break-game-screen">
      <Label style={styles.title}>Jail Break Game</Label>
      <Label style={styles.hint} testID="game-hint">
        Collect all 3 keys and reach the door without getting caught.
      </Label>

      <View style={styles.gameArea} {...panResponder.panHandlers}>
        <View style={styles.floor} />

        {keys.map(item => (
          <View
            key={item.id}
            style={[styles.key, { left: item.x, top: item.y }]}
          >
            <Label style={styles.keyText}>Key</Label>
          </View>
        ))}

        {POLICE_OFFICERS.map(item => (
          <View
            key={item.id}
            style={[styles.police, { left: item.x, top: item.y }]}
          >
            <Label style={styles.policeText}>Police</Label>
          </View>
        ))}

        <View style={[styles.door, keys.length === 0 ? styles.doorVisible : null]}>
          <Label style={styles.doorText}>Door</Label>
        </View>

        <View style={[styles.car, { left: carPosition.x, top: carPosition.y }]}>
          <Label style={styles.carText}>Car</Label>
        </View>
      </View>

      {renderModal()}
    </View>
  );
};

const intersects = (car, item, size, height = size) => {
  const itemRect = {
    x: item.x,
    y: item.y,
    width: size,
    height,
  };

  return (
    car.x < itemRect.x + itemRect.width &&
    car.x + car.width > itemRect.x &&
    car.y < itemRect.y + itemRect.height &&
    car.y + car.height > itemRect.y
  );
};

export default JailBreakGame;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2),
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: hp(3),
    color: COLORS.white,
    marginBottom: hp(1),
  },
  hint: {
    fontFamily: FONT.regular,
    fontSize: hp(1.8),
    color: COLORS.lightWhite,
    marginBottom: hp(2),
  },
  gameArea: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  floor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceAlt,
  },
  key: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.contrastYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: COLORS.black,
    fontFamily: FONT.bold,
    fontSize: hp(1.6),
  },
  police: {
    position: 'absolute',
    width: 70,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policeText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(1.5),
  },
  door: {
    position: 'absolute',
    right: wp(6),
    bottom: hp(6),
    width: 58,
    height: 110,
    borderRadius: 16,
    backgroundColor: COLORS.newlightWhite,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  doorVisible: {
    opacity: 1,
  },
  doorText: {
    color: COLORS.surface,
    fontFamily: FONT.bold,
    fontSize: hp(2),
  },
  car: {
    position: 'absolute',
    width: CAR_SIZE.width,
    height: CAR_SIZE.height,
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(1.8),
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 12, 24, 0.66)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: wp(7),
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: hp(2.8),
    color: COLORS.surface,
    marginBottom: hp(1),
  },
  modalText: {
    fontFamily: FONT.regular,
    fontSize: hp(1.9),
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: hp(2.2),
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(8),
    borderRadius: 999,
  },
  modalButtonText: {
    fontFamily: FONT.bold,
    fontSize: hp(2),
    color: COLORS.white,
  },
});
