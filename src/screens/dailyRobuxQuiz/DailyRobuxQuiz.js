import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { QUIZ_DATA } from '../../dummies';
import { POINT_REWARDS } from '../../enums';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';
import { en } from '../../languages';
import {
  preloadInterstitialAd,
  showInterstitialIfAvailable,
} from '../../services/ads';

const DailyRobuxQuiz = () => {
  const navigation = useNavigation();
  const { addPoints } = useTotalPoints();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const question = QUIZ_DATA[currentQuestion];
  const [quizFinished, setQuizFinished] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isShowingInterstitialRef = useRef(false);
  const nextQuestionTimeoutRef = useRef(null);
  const pointsAwardedRef = useRef(false);

  const clearPendingNextQuestion = () => {
    if (nextQuestionTimeoutRef.current) {
      clearTimeout(nextQuestionTimeoutRef.current);
      nextQuestionTimeoutRef.current = null;
    }
  };

  const scheduleNextQuestion = () => {
    clearPendingNextQuestion();

    nextQuestionTimeoutRef.current = setTimeout(() => {
      nextQuestionTimeoutRef.current = null;
      nextQuestion();
    }, 1500);
  };

  const continueAnswerFlow = answer => {
    isShowingInterstitialRef.current = false;
    setShowAnswer(true);

    if (answer === question.correctAnswer) {
      setScore(prev => prev + 10);
    }

    scheduleNextQuestion();
  };

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
    if (!quizFinished || pointsAwardedRef.current) {
      return;
    }

    pointsAwardedRef.current = true;
    addPoints(POINT_REWARDS.DAILY_QUIZ_COMPLETE).catch(error => {
      pointsAwardedRef.current = false;
      console.warn('Failed to save Daily Quiz reward:', error?.message || error);
    });
  }, [addPoints, quizFinished]);

  useEffect(() => {
    if (showAnswer || selectedAnswer) return;

    if (timer === 0) {
      // correct answer highlight karo
      setShowAnswer(true);
      scheduleNextQuestion();

      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showAnswer, selectedAnswer]);

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

  useEffect(() => {
    preloadInterstitialAd();

    return () => {
      clearPendingNextQuestion();
    };
  }, []);

  const handleAnswer = answer => {
    if (selectedAnswer || isShowingInterstitialRef.current) return;

    setSelectedAnswer(answer);
    isShowingInterstitialRef.current = true;

    let hasContinued = false;

    const continueOnce = () => {
      if (hasContinued) {
        return;
      }

      hasContinued = true;
      continueAnswerFlow(answer);
    };

    const shown = showInterstitialIfAvailable({
      onClosed: continueOnce,
      onError: continueOnce,
    });

    if (!shown) {
      continueOnce();
      preloadInterstitialAd();
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
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
                disabled={showAnswer || selectedAnswer !== null}
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
    </SafeAreaView>
  );
};

export default DailyRobuxQuiz;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(6),
    paddingVertical: isIOS() ? wp(1) : hp(2),
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
