import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
  Animated, // Animated import kiya
} from 'react-native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { generateGameCards } from '../../helpers';
import { useNavigation } from '@react-navigation/native';
import { FruitCard } from '../../components';
import { en } from '../../languages';
import useTotalPoints from '../../hooks/useTotalPoints';

const BloxFruitsGame = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isVictory, setIsVictory] = useState(false);
  const navigation = useNavigation();
  const { addPoints } = useTotalPoints();

  const timerRef = useRef(null);
  const pointsAwardedRef = useRef(false);
  
  // Animation value initialization
  const timerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setupGame();
    return () => clearInterval(timerRef.current);
  }, []);

  // Timer countdown aur animation trigger
  useEffect(() => {
    if (timeLeft > 0 && !isVictory) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // Pop-In Pop-Out Animation Sequence
        Animated.sequence([
          Animated.timing(timerScale, {
            toValue: 1.15, // Thora barha hoga (Pop-In)
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(timerScale, {
            toValue: 1, // Wapas normal (Pop-Out)
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();

      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isVictory]);

  const setupGame = () => {
    pointsAwardedRef.current = false;
    setCards(generateGameCards());
    setSelectedCards([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(120);
    setIsVictory(false);
    timerScale.setValue(1); // Scale reset
  };

  useEffect(() => {
    if (!isVictory || pointsAwardedRef.current || score <= 0) {
      return;
    }

    pointsAwardedRef.current = true;

    addPoints(score).catch(error => {
      // Allow retry if write fails.
      pointsAwardedRef.current = false;
      console.warn('Failed to save Blox Fruits score:', error?.message || error);
    });
  }, [addPoints, isVictory, score]);

  const handleCardTap = useCallback(
    index => {
      setCards(prevCards => {
        if (
          prevCards[index].isFlipped ||
          prevCards[index].isMatched ||
          selectedCards.length === 2
        ) {
          return prevCards;
        }

        const updatedCards = [...prevCards];
        updatedCards[index].isFlipped = true;

        setSelectedCards(prevSelected => {
          const newSelected = [...prevSelected, index];

          if (newSelected.length === 2) {
            setMoves(m => m + 1);
            const [firstIndex, secondIndex] = newSelected;

            if (updatedCards[firstIndex].id === updatedCards[secondIndex].id) {
              updatedCards[firstIndex].isMatched = true;
              updatedCards[secondIndex].isMatched = true;
              setScore(s => s + 10);

              if (updatedCards.every(card => card.isMatched)) {
                setIsVictory(true);
              }
              return [];
            } else {
              setTimeout(() => {
                setCards(latestCards => {
                  const resetCards = [...latestCards];
                  resetCards[firstIndex].isFlipped = false;
                  resetCards[secondIndex].isFlipped = false;
                  return resetCards;
                });
                setSelectedCards([]);
              }, 1000);
            }
          }
          return newSelected;
        });

        return updatedCards;
      });
    },
    [selectedCards],
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {/* Header Row */}
        <View style={styles.heroTopRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon icon={SVG.goBack} width={wp(5)} height={hp(2.5)} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Label style={styles.robuxText}>{en.bloxFruits}</Label>
            <Label style={styles.welcomeText}>{en.memoryChallenge}</Label>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={setupGame}>
            <SvgIcon icon={SVG.restart} width={wp(5)} height={hp(2.5)} />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.heroStatsRow}>
          <View style={styles.statPill}>
            <SvgIcon icon={SVG.stopWatch} width={wp(8)} height={hp(2.5)} />
            
            {/* Animated view wrap kiya timer text ko zoom effect dene ke liye */}
            <Animated.View style={{ transform: [{ scale: timerScale }] }}>
              <Label style={[styles.statValue, { color: COLORS.darkRed, marginTop: hp(0.5) }]}>
                {timeLeft}s
              </Label>
            </Animated.View>
          </View>
          <View style={styles.statPill}>
            <SvgIcon icon={SVG.target} width={wp(8)} height={hp(2.5)} />
            <Label style={styles.statValue}>{score}</Label>
          </View>
          <View style={styles.statPill}>
            <SvgIcon icon={SVG.moves} width={wp(8)} height={hp(3)} />
            <Label style={styles.statValue}>{moves}</Label>
          </View>
        </View>

        {/* 4x4 Grid Container */}
        <View style={styles.gameBoardContainer}>
          <FlatList
            data={cards}
            renderItem={({ item, index }) => (
              <FruitCard item={item} index={index} onPress={handleCardTap} />
            )}
            keyExtractor={item => item.uniqueId}
            numColumns={4}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* Victory Modal */}
      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <StatusBar
            backgroundColor={COLORS.black}
            barStyle={'light-content'}
          />
          <View style={styles.victoryCard}>
            <SvgIcon icon={SVG.trophy} width={hp(9)} height={hp(8)} />
            <Label style={styles.victoryTitle}>{en.victory}</Label>
            <Label style={styles.victorySub}>{en.foundAllFruits}</Label>

            <View style={styles.modalStatsRow}>
              <View style={styles.modalStatBox}>
                <Label style={styles.modalStatLabel}>{en.score}</Label>
                <Label
                  style={[styles.modalStatValue, { color: COLORS.lightYellow }]}
                >
                  {score}
                </Label>
              </View>
              <View style={styles.modalStatBox}>
                <Label style={styles.modalStatLabel}>{en.moves}</Label>
                <Label
                  style={[
                    styles.modalStatValue,
                    { color: COLORS.lightestBlue },
                  ]}
                >
                  {moves}
                </Label>
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.darkGreen }]}
                onPress={setupGame}
              >
                <Label style={styles.modalBtnText}>{en.playAgain}</Label>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.darkRed }]}
                onPress={() => navigation.goBack()}
              >
                <Label style={styles.modalBtnText}>{en.close}</Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BloxFruitsGame;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  contentContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
  iconButton: {
    backgroundColor: COLORS.yellow,
    padding: wp(3),
    borderRadius: wp(10),
  },
  welcomeText: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
  },
  robuxText: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.bold,
    letterSpacing: wp(0.5),
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  statPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: wp(4),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginHorizontal: wp(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
    marginTop: hp(0.5),
  },
  gameBoardContainer: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: wp(6),
    padding: wp(4),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  victoryCard: {
    width: wp(85),
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: wp(6),
    padding: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  victoryTitle: {
    fontSize: hp(3.5),
    fontFamily: FONT.semiBold,
    color: COLORS.lightYellow,
    letterSpacing: wp(0.5),
    marginTop: hp(4),
  },
  victorySub: {
    fontSize: hp(1.8),
    color: COLORS.grey,
    marginTop: hp(0.5),
    marginBottom: hp(3),
    textAlign: 'center',
    fontFamily: FONT.medium,
  },
  modalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp(4),
  },
  modalStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.09)',
    padding: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  modalStatLabel: {
    fontSize: hp(1.6),
    color: COLORS.white,
    fontFamily: FONT.bold,
  },
  modalStatValue: {
    fontSize: hp(2.5),
    fontFamily: FONT.semiBold,
    marginTop: hp(0.5),
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: hp(1.8),
    borderRadius: wp(4),
    alignItems: 'center',
    marginHorizontal: wp(2),
  },
  modalBtnText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },
});