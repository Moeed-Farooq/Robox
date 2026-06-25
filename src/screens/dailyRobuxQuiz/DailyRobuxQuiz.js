import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  SectionList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { QUIZ_DATA, SETTINGS_SECTIONS } from '../../dummies';
import { SettingsItem } from '../../components';
import Button from '../../common/Button';
import { useNavigation } from '@react-navigation/native';

const DailyRobuxQuiz = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const question = QUIZ_DATA[currentQuestion];
  const [quizFinished, setQuizFinished] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const nextQuestion = () => {
    if (currentQuestion === QUIZ_DATA.length - 1) {
      setQuizFinished(true);

      return;
    }

    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimer(30);
  };

  useEffect(() => {
    if (showAnswer) return;

    if (timer === 0) {
      // correct answer highlight karo
      setShowAnswer(true);

      setTimeout(() => {
        nextQuestion();
      }, 1500);

      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showAnswer]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
  if (timer <= 10) {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [timer]);

  const handleAnswer = answer => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    if (answer === question.correctAnswer) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.HeaderRow}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(4)} width={hp(4)} />
        </TouchableOpacity>
        <View>
          <Label style={styles.dailyRobuxText}>{en.dailyRobux}</Label>
          <Label style={styles.eliteChallengeText}>{en.eliteChallenge}</Label>
        </View>
        <View style={styles.controller}>
          <SvgIcon
            icon={SVG.gameControllerWhite}
            width={hp(3)}
            height={hp(3)}
          />
        </View>
      </View>
      {/* eeweww */}

      <View style={styles.statsRow}>
        <Label style={styles.questionCountText}>
          Question {currentQuestion + 1}/{QUIZ_DATA.length}
        </Label>
        <Label style={styles.scoreCountText}>Score : {score}</Label>
        <View style={styles.timerRow}>
          <SvgIcon icon={SVG.stopWatch} width={hp(2.4)} height={hp(2.4)} />
          <Animated.Text
            style={[
              styles.timeText,
              {
                color: timer <= 10 ? COLORS.red : COLORS.lightYellow,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {timer}
          </Animated.Text>
        </View>
      </View>

      {/* ewfwwwwf */}

      {!quizFinished ? (
        <View style={styles.questionCard}>
          <Label style={styles.questionText}>{question.question}</Label>

          {question.options.map((item, index) => {
            let backgroundColor = COLORS.splashBg;

            if (showAnswer) {
              if (item === question.correctAnswer) {
                backgroundColor = COLORS.darkGreen;
              } else if (
                item === selectedAnswer &&
                item !== question.correctAnswer
              ) {
                backgroundColor = COLORS.darkRed;
              }
            }

            return (
              <TouchableOpacity
                key={index}
                disabled={showAnswer}
                onPress={() => handleAnswer(item)}
                style={[
                  styles.optionContainer,
                  {
                    backgroundColor,
                  },
                ]}
              >
                <Label style={styles.optionText}>{item}</Label>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.resultCard}>
          <Label style={styles.finishText}>{en.quizCompleted}🎉</Label>

          <Label style={styles.scoreText}>{en.totalScore}</Label>

          <Label style={styles.totalScore}>
            {score}/{QUIZ_DATA.length * 10}
          </Label>
        </View>
      )}
    </View>
  );
};

export default DailyRobuxQuiz;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(6),
    paddingVertical: wp(10),
  },

  HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    gap: wp(1),
    justifyContent: 'center',
    width: hp(7),
    // alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: COLORS.lightYellow,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    borderRadius: hp(4),
  },

  dailyRobuxText: {
    color: COLORS.lightYellow,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },

  eliteChallengeText: {
    color: COLORS.lightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },

  controller: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.3),
    borderRadius: hp(2),
  },
  statsRow: {
    marginTop: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCountText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
  scoreCountText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
  timeText: {
    color: COLORS.red,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },

  questionCard: {
    marginTop: hp(5),
    backgroundColor: COLORS.lightYellow,
    borderRadius: hp(3),
    padding: hp(3),
  },

  questionText: {
    color: COLORS.black,
    fontSize: hp(3),
    textAlign: 'center',
    fontFamily: FONT.bold,
    marginBottom: hp(4),
  },

  optionContainer: {
    height: hp(8),
    borderRadius: hp(2),
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },

  optionText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: hp(8),
    backgroundColor: '#2a2a2a',
    borderRadius: hp(3),
    paddingVertical: hp(6),
    alignItems: 'center',
  },

  finishText: {
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },

  scoreText: {
    color: COLORS.lightWhite,
    fontSize: hp(2.3),
    marginTop: hp(3),
    fontFamily: FONT.semiBold,
  },

  totalScore: {
    color: COLORS.lightYellow,
    fontSize: hp(4),
    fontFamily: FONT.bold,
    // marginTop: hp(2),
  },
});
