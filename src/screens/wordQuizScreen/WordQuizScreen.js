import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { WORD_QUIZ_DATA } from '../../dummies';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { generateLetters, formatTime, TOTAL_TIME } from '../../helpers';

const WordQuizScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = WORD_QUIZ_DATA[currentIndex];
  const currentAnswer = currentQuestion.rightAnswer
    .replace(/\s/g, '')
    .toUpperCase();

  const resetCurrentQuestion = () => {
    setSelectedAnswer([]);
    setLetters(generateLetters(currentAnswer));
  };

  const goToNextQuestion = () => {
    if (currentIndex < WORD_QUIZ_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(TOTAL_TIME);
    } else {
      setTimeLeft(0);
      setShowResult(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setTimeLeft(TOTAL_TIME);
    setShowResult(false);
  };

  useEffect(() => {
    resetCurrentQuestion();
  }, [currentIndex]);

  const onPressLetter = item => {
    if (item.selected) return;

    const updatedLetters = letters.map(letter =>
      letter.id === item.id ? { ...letter, selected: true } : letter,
    );
    const updatedAnswer = [...selectedAnswer, item];

    setLetters(updatedLetters);
    setSelectedAnswer(updatedAnswer);

    const correctAnswer = currentAnswer;
    if (updatedAnswer.length === correctAnswer.length) {
      const userAnswer = updatedAnswer.map(i => i.letter).join('');
      setTimeout(() => {
        if (userAnswer === correctAnswer) {
          setScore(prev => prev + 10);
          goToNextQuestion();
        } else {
          loseLife();
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (showResult) return;

    if (lives === 0) return;

    if (timeLeft <= 0) {
      loseLife();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, lives, showResult]);

  const loseLife = () => {
    resetCurrentQuestion();
    if (lives <= 1) {
      setLives(0);
      setTimeLeft(0);
      return;
    }
    setLives(prev => prev - 1);
    setTimeLeft(TOTAL_TIME);
  };

  const handleCancelLetter = () => {
    if (selectedAnswer.length === 0) return;
    const lastLetter = selectedAnswer[selectedAnswer.length - 1];
    setSelectedAnswer(prev => prev.slice(0, -1));
    setLetters(prev =>
      prev.map(letter =>
        letter.id === lastLetter.id ? { ...letter, selected: false } : letter,
      ),
    );
  };

  const handleHint = () => {
    const correctAnswer = WORD_QUIZ_DATA[currentIndex].rightAnswer
      .replace(/\s/g, '')
      .toUpperCase();
    if (selectedAnswer.length >= correctAnswer.length) return;

    const nextLetter = correctAnswer[selectedAnswer.length];
    const targetLetter = letters.find(
      item => item.letter === nextLetter && !item.selected,
    );
    if (!targetLetter) return;

    const updatedLetters = letters.map(letter =>
      letter.id === targetLetter.id ? { ...letter, selected: true } : letter,
    );
    const updatedAnswer = [...selectedAnswer, targetLetter];

    setLetters(updatedLetters);
    setSelectedAnswer(updatedAnswer);

    if (updatedAnswer.length === correctAnswer.length) {
      const userAnswer = updatedAnswer.map(i => i.letter).join('');
      setTimeout(() => {
        if (userAnswer === correctAnswer) {
          setScore(prev => prev + 10);
          goToNextQuestion();
        } else {
          loseLife();
        }
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.infoCard}>
          <View style={styles.iconTextRow}>
            <SvgIcon icon={SVG.trophy} height={hp(2.2)} width={hp(2.2)} />
            <Label style={styles.infoTitle}>{en.score}</Label>
          </View>
          <Label style={styles.infoValue}>{score}</Label>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.iconTextRow}>
            <SvgIcon icon={SVG.stopWatch} height={hp(2.2)} width={hp(2.2)} />
            <Label style={styles.infoTitle}>{en.time}</Label>
          </View>
          <Label style={styles.infoValue}>{formatTime(timeLeft)}</Label>
        </View>
      </View>

      {/* Second Header */}
      <View style={styles.secondHeader}>
        <Label style={styles.questionCount}>
          Question {currentIndex + 1}/{WORD_QUIZ_DATA.length}
        </Label>

        <View style={styles.lifeRow}>
          {[1, 2, 3].map(item => (
            <View key={item} style={styles.lifeIconContainer}>
              <SvgIcon
                icon={item <= lives ? SVG.heart : SVG.heartBroken}
                height={hp(2.8)}
                width={hp(2.8)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Label style={styles.question}>{currentQuestion.question}</Label>
      </View>

      {/* Answer Boxes */}
      <View style={styles.answerContainer}>
        {Array.from({ length: currentAnswer.length }).map((_, index) => (
          <View key={index} style={styles.answerBox}>
            <Label style={styles.answerLetter}>
              {selectedAnswer[index]?.letter || ''}
            </Label>
          </View>
        ))}
      </View>

      {/* Keyboard */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={letters}
          keyExtractor={item => item.id}
          numColumns={5}
          contentContainerStyle={styles.keyboardContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              disabled={item.selected}
              onPress={() => onPressLetter(item)}
              style={[styles.letterBox, item.selected && styles.selectedLetter]}
            >
              <Label style={styles.letter}>{item.letter}</Label>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelBtn]}
          onPress={handleCancelLetter}
        >
          <SvgIcon icon={SVG.undo} height={hp(2.8)} width={hp(2.8)} />
          <Label style={styles.buttonText}>{en.undo}</Label>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.hintBtn]}
          onPress={handleHint}
        >
          <SvgIcon icon={SVG.bulb} height={hp(2.8)} width={hp(2.8)} />
          <Label style={styles.buttonText}>{en.hint}</Label>
        </TouchableOpacity>
      </View>
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Label style={styles.emoji}>🎉</Label>

            <Label style={styles.modalTitle}>{en.congratulations}!</Label>

            <Label style={styles.modalSubTitle}>{en.gameCompleted}</Label>

            <View style={styles.scoreCard}>
              <Label style={styles.scoreLabel}>{en.totalScore}</Label>
              <Label style={styles.scoreValue}>{score}</Label>
            </View>

            <Label style={styles.resultText}>
              {en.questions} : {WORD_QUIZ_DATA.length}
            </Label>

            <Label style={styles.resultText}>
              {en.livesLeft} : {lives}
            </Label>

            <TouchableOpacity style={styles.playAgainBtn} onPress={restartGame}>
              <Label style={styles.playAgainText}>{en.playAgain}</Label>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WordQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(5),
    paddingVertical: wp(5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[73],
    borderRadius: hp(2),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  infoTitle: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.bold,
    marginTop: hp(0.3),
  },
  secondHeader: {
    marginTop: hp(2.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCount: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(2),
  },
  lifeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifeIconContainer: {
    marginLeft: wp(1.5),
  },
  questionCard: {
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[73],
    borderRadius: 18,
    marginTop: hp(2.5),
    padding: hp(2.5),
  },
  question: {
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: hp(2.2),
    lineHeight: hp(3),
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: hp(3),
  },
  answerBox: {
    width: wp(11.5),
    height: wp(11.5),
    margin: wp(1),
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLetter: {
    fontSize: hp(2.5),
    fontFamily: FONT.bold,
    color: COLORS.black,
  },
  keyboardContainer: {
    marginTop: hp(3),
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  letterBox: {
    width: wp(14),
    height: wp(14),
    margin: wp(1.2),
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  selectedLetter: {
    backgroundColor: COLORS.lightGrey,
    opacity: 0.5,
  },
  letter: {
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
    color: COLORS.black,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  actionButton: {
    width: '47%',
    paddingVertical: hp(1.8),
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  cancelBtn: {
    backgroundColor: COLORS.darkRed,
  },
  hintBtn: {
    backgroundColor: COLORS.yellow,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(1.9),
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 25,
    padding: hp(3),
    alignItems: 'center',
  },

  emoji: {
    fontSize: hp(6),
  },

  modalTitle: {
    marginTop: hp(1),
    fontSize: hp(3),
    color: COLORS.white,
    fontFamily: FONT.bold,
  },

  modalSubTitle: {
    marginTop: hp(0.8),
    color: COLORS.newlightWhite,
    fontSize: hp(1.9),
    fontFamily: FONT.medium,
  },

  scoreCard: {
    width: '100%',
    marginVertical: hp(3),
    backgroundColor: COLORS.yellow,
    borderRadius: 18,
    paddingVertical: hp(2),
    alignItems: 'center',
  },

  scoreLabel: {
    color: COLORS.black,
    fontFamily: FONT.medium,
  },

  scoreValue: {
    color: COLORS.black,
    fontSize: hp(4),
    fontFamily: FONT.bold,
  },

  resultText: {
    color: COLORS.white,
    fontSize: hp(2),
    marginTop: hp(0.8),
    fontFamily: FONT.medium,
  },

  playAgainBtn: {
    marginTop: hp(3),
    width: '100%',
    backgroundColor: COLORS.darkRed,
    borderRadius: 15,
    paddingVertical: hp(1.8),
    alignItems: 'center',
  },

  playAgainText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(2),
  },
});
