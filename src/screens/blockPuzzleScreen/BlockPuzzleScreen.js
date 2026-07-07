import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  StatusBar,
} from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedRef,
  runOnJS,
} from 'react-native-reanimated';
import { BLOCK_SHAPES, SHAPE_COLORS } from '../../dummies';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';
import {
  AppBannerAd,
  preloadInterstitialAd,
  showInterstitialIfAvailable,
  showRewardedAdForAction,
} from '../../services/ads';

const BlockPuzzleScreen = () => {
  const BOARD_SIZE = 8;
  const CELL_SIZE = wp(8.5) + 4;
  const navigation = useNavigation();

  const createBoard = () =>
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

  const [placedBoard, setPlacedBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [currentShapes, setCurrentShapes] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const pointsAwardedRef = useRef(false);
  const [isRestartAdInProgress, setIsRestartAdInProgress] = useState(false);
  const { addPoints } = useTotalPoints();
  const successfulPlacementsCountRef = useRef(0);
  const isShowingInterstitialRef = useRef(false);

  const boardRef = useAnimatedRef();
  const boardPosition = useRef({ x: 0, y: 0 });

  const getRandomShapes = () => {
    return Array.from({ length: 3 }, () => {
      const index = Math.floor(Math.random() * BLOCK_SHAPES.length);
      const randomColor = SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)];
      return {
        matrix: BLOCK_SHAPES[index],
        color: randomColor,
      };
    });
  };

  const generateNewShapes = (boardToUse) => {
    const nextShapes = getRandomShapes();
    setCurrentShapes(nextShapes);
    checkGameOver(boardToUse, nextShapes);
  };

  useEffect(() => {
    const initialBoard = createBoard();
    const initialShapes = getRandomShapes();
    setPlacedBoard(initialBoard);
    setCurrentShapes(initialShapes);
    preloadInterstitialAd();
    setTimeout(() => {
      checkGameOver(initialBoard, initialShapes);
    }, 150);
  }, []);

  const trackSuccessfulPlacement = () => {
    successfulPlacementsCountRef.current += 1;

    if (
      successfulPlacementsCountRef.current < 3 ||
      isShowingInterstitialRef.current
    ) {
      return;
    }

    successfulPlacementsCountRef.current = 0;
    isShowingInterstitialRef.current = true;

    const resetInterstitialGuard = () => {
      isShowingInterstitialRef.current = false;
    };

    const shown = showInterstitialIfAvailable({
      onClosed: resetInterstitialGuard,
      onError: resetInterstitialGuard,
    });

    if (!shown) {
      resetInterstitialGuard();
      preloadInterstitialAd();
    }
  };

  // Strict Async-Safe Game Over Checker
  const checkGameOver = (currentBoardState, shapesArray) => {
    const activeShapes = shapesArray.filter(Boolean);
    
    if (activeShapes.length === 0) return;

    let atLeastOneShapeCanFit = false;

    for (let shapeData of activeShapes) {
      const shape = shapeData.matrix;
      const shapeRows = shape.length;
      const shapeCols = shape[0].length;

      // Pure board par iteration
      for (let r = 0; r <= BOARD_SIZE - shapeRows; r++) {
        for (let c = 0; c <= BOARD_SIZE - shapeCols; c++) {
          let canFitAtThisSpot = true;

          for (let sr = 0; sr < shapeRows; sr++) {
            for (let sc = 0; sc < shapeCols; sc++) {
              if (shape[sr][sc] === 1) {
                if (currentBoardState[r + sr][c + sc] !== 0) {
                  canFitAtThisSpot = false;
                  break;
                }
              }
            }
            if (!canFitAtThisSpot) break;
          }

          if (canFitAtThisSpot) {
            atLeastOneShapeCanFit = true;
            break;
          }
        }
        if (atLeastOneShapeCanFit) break;
      }
    }

    if (!atLeastOneShapeCanFit) {
      setIsGameOver(true);
    }
  };

  const checkAndClearLines = currentBoard => {
    let rowsToClear = [];
    let colsToClear = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      if (currentBoard[r].every(cell => cell !== 0)) {
        rowsToClear.push(r);
      }
    }

    for (let c = 0; c < BOARD_SIZE; c++) {
      let isColFull = true;
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (currentBoard[r][c] === 0) {
          isColFull = false;
          break;
        }
      }
      if (isColFull) colsToClear.push(c);
    }

    let nextBoard = currentBoard;
    if (rowsToClear.length > 0 || colsToClear.length > 0) {
      nextBoard = currentBoard.map((row, r) =>
        row.map((cell, c) => {
          if (rowsToClear.includes(r) || colsToClear.includes(c)) {
            return 0;
          }
          return cell;
        }),
      );

      const clearedLines = rowsToClear.length + colsToClear.length;
      setScore(prev => prev + clearedLines * 10);
    }

    return nextBoard;
  };

  const handleGestureEnd = (index, absoluteX, absoluteY, touchX, touchY) => {
    const shapeData = currentShapes[index];
    if (!shapeData || !shapeData.matrix) return;

    const shape = shapeData.matrix;
    const shapeTopLeftX = absoluteX - touchX;
    const shapeTopLeftY = absoluteY - touchY;

    const dropX = shapeTopLeftX - boardPosition.current.x;
    const dropY = shapeTopLeftY - boardPosition.current.y;

    const col = Math.round(dropX / CELL_SIZE);
    const row = Math.round(dropY / CELL_SIZE);

    let canPlace = true;

    shape.forEach((shapeRow, r) => {
      shapeRow.forEach((cell, c) => {
        if (!cell) return;
        const targetRow = row + r;
        const targetCol = col + c;

        if (
          targetRow < 0 ||
          targetRow >= BOARD_SIZE ||
          targetCol < 0 ||
          targetCol >= BOARD_SIZE ||
          placedBoard[targetRow][targetCol] !== 0
        ) {
          canPlace = false;
          return;
        }
      });
    });

    if (canPlace) {
      const newBoard = placedBoard.map(r => [...r]);
      shape.forEach((shapeRow, r) => {
        shapeRow.forEach((cell, c) => {
          if (!cell) return;
          newBoard[row + r][col + c] = shapeData.color; 
        });
      });

      const boardAfterClear = checkAndClearLines(newBoard);
      setPlacedBoard(boardAfterClear);
      setScore(prev => prev + 10);

      // Cloned array for direct reference passing
      const updatedShapes = [...currentShapes];
      updatedShapes[index] = null;
      setCurrentShapes(updatedShapes);
      trackSuccessfulPlacement();

      const remaining = updatedShapes.filter(Boolean);
      if (remaining.length === 0) {
        setTimeout(() => {
          generateNewShapes(boardAfterClear);
        }, 250);
      } else {
        checkGameOver(boardAfterClear, updatedShapes);
      }
    }
  };

  const restartGame = () => {
    pointsAwardedRef.current = false;
    successfulPlacementsCountRef.current = 0;
    isShowingInterstitialRef.current = false;
    const freshBoard = createBoard();
    setPlacedBoard(freshBoard);
    setScore(0);
    setIsGameOver(false);
    generateNewShapes(freshBoard);
  };

  const handleRestart = async () => {
    if (isRestartAdInProgress) {
      return;
    }

    setIsRestartAdInProgress(true);

    try {
      await showRewardedAdForAction(() => {
        restartGame();
      });
    } finally {
      setIsRestartAdInProgress(false);
    }
  };

  useEffect(() => {
    if (!isGameOver || pointsAwardedRef.current || score <= 0) {
      return;
    }

    pointsAwardedRef.current = true;

    addPoints(score).catch(error => {
      // Allow retry if write fails.
      pointsAwardedRef.current = false;
      console.warn('Failed to save Block Puzzle score:', error?.message || error);
    });
  }, [addPoints, isGameOver, score]);

  const DraggableShape = ({ shapeData, index }) => {
    if (!shapeData || !shapeData.matrix) return null;

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const startTouchX = useSharedValue(0);
    const startTouchY = useSharedValue(0);

    const gesture = Gesture.Pan()
      .onBegin(e => {
        runOnJS(setDraggingIndex)(index);
        startTouchX.value = e.x;
        startTouchY.value = e.y;
        scale.value = withSpring(1.1);
      })
      .onUpdate(e => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      })
      .onEnd(e => {
        runOnJS(handleGestureEnd)(
          index,
          e.absoluteX,
          e.absoluteY,
          startTouchX.value,
          startTouchY.value,
        );
        runOnJS(setDraggingIndex)(null);

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        zIndex: draggingIndex === index ? 999 : 1,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value },
        ],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            animatedStyle,
            {
              alignItems: 'center',
              padding: 5,
              backgroundColor: 'transparent',
            },
          ]}
        >
          {shapeData.matrix.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row' }}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.smallBlock,
                    {
                      opacity: cell ? 1 : 0,
                      backgroundColor: shapeData.color,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(2.5)} width={hp(2.5)} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={handleRestart}
          disabled={isRestartAdInProgress}
        >
          <SvgIcon icon={SVG.restart} height={hp(2.8)} width={hp(2.8)} />
        </TouchableOpacity>
      </View>

      <Label style={styles.title}>
        {en.block}
        <Label style={styles.titlePurple}> {en.puzzle}</Label>
      </Label>
      <Label style={styles.subTitle}>{en.eliteChallenge}</Label>

      <View style={styles.scoreRow}>
        <View style={styles.scoreCard}>
          <Label style={styles.scoreHeading}>{en.score}</Label>
          <Label style={styles.scoreValue}>{score}</Label>
        </View>

        <View style={styles.scoreCard}>
          <Label style={styles.scoreHeading}>{en.level}</Label>
          <Label style={[styles.scoreValue, { color: COLORS.lightestBlue }]}>
            1
          </Label>
        </View>
      </View>

      <View
        ref={boardRef}
        style={styles.board}
        onLayout={e => {
          e.target.measure((fx, fy, width, height, px, py) => {
            boardPosition.current = { x: px, y: py };
          });
        }}
      >
        {placedBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.boardRow}>
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.boardCell,
                  cell !== 0 && { backgroundColor: cell },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.bottomShapes}>
        {currentShapes.map((shapeData, index) => {
          if (!shapeData) return <View key={index} style={{ width: wp(18) }} />;
          return (
            <DraggableShape key={index} index={index} shapeData={shapeData} />
          );
        })}
      </View>

      <View style={styles.bannerContainer}>
        <AppBannerAd />
      </View>

      <Modal visible={isGameOver} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <StatusBar
            backgroundColor={COLORS.lightBlack}
            barStyle={'light-content'}
          />
          <View style={styles.popupContainer}>
            <Label style={styles.popupTitle}>{en.gameOver}</Label>
            <Label style={styles.noSpaceText}>{en.noSpace}</Label>

            <View style={styles.popupScoreBox}>
              <Label style={styles.popupScoreLabel}>{en.finalScore}</Label>
              <Label style={styles.popupScoreValue}>{score}</Label>
            </View>

            <TouchableOpacity style={styles.popupBtn} onPress={restartGame}>
              <Label style={styles.popupBtnText}>{en.playAgain}</Label>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BlockPuzzleScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: isIOS() ? wp(1) : hp(2),
  },
  board: {
    alignSelf: 'center',
    marginTop: hp(3),
  },
  boardRow: {
    flexDirection: 'row',
  },
  boardCell: {
    width: wp(8.5),
    height: wp(8.5),
    margin: wp(0.6),
    borderRadius: wp(2),
    backgroundColor: COLORS.darkPurple,
  },
  bottomShapes: {
    marginTop: hp(4),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: hp(12),
  },
  smallBlock: {
    width: wp(8.5),
    height: wp(8.5),
    margin: 2,
    borderRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: hp(1),
    textAlign: 'center',
    color: COLORS.white,
    fontSize: hp(4),
    fontFamily: FONT.bold,
  },
  titlePurple: {
    color: COLORS.lightYellow,
  },
  subTitle: {
    marginTop: hp(-1),
    textAlign: 'center',
    color: COLORS.lightWhite,
    letterSpacing: 4,
    fontSize: hp(1.4),
  },
  scoreRow: {
    marginTop: hp(4),
  },
  scoreCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: hp(4),
    paddingHorizontal: hp(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: wp(1),
  },
  scoreHeading: {
    color: COLORS.white,
    fontFamily: FONT.medium,
    fontSize: hp(2),
  },
  scoreValue: {
    marginTop: hp(0.5),
    color: COLORS.yellow,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.black + HEX_OPACITY[22],
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(80),
    backgroundColor: '#332540',
    borderRadius: 24,
    padding: wp(6),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#574368',
  },
  popupTitle: {
    color: COLORS.red,
    fontSize: hp(4),
    fontFamily: FONT.bold,
    letterSpacing: 1,
  },
  noSpaceText: {
    color: COLORS.lightWhite,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
    marginBottom: hp(2),
    letterSpacing: 1,
  },
  popupScoreBox: {
    backgroundColor: '#261A30',
    width: '100%',
    borderRadius: 16,
    paddingVertical: hp(2),
    alignItems: 'center',
    marginBottom: hp(3),
  },
  popupScoreLabel: {
    color: COLORS.lightWhite,
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },
  popupScoreValue: {
    color: COLORS.yellow,
    fontSize: hp(4.5),
    fontFamily: FONT.bold,
    marginTop: hp(0.5),
  },
  popupBtn: {
    backgroundColor: COLORS.yellow,
    width: '100%',
    paddingVertical: hp(1.8),
    borderRadius: hp(4),
    alignItems: 'center',
  },
  popupBtnText: {
    color: COLORS.splashBg,
    fontFamily: FONT.bold,
    fontSize: hp(2),
  },
  bannerContainer: {
    marginTop: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});