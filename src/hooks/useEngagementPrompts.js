import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getNextEngagementPrompt,
  markRatePromptShown,
  markSharePromptShown,
} from '../services/engagement/EngagementPromptService';
import { rateApp, shareApp } from '../helpers';

const useEngagementPrompts = totalPoints => {
  const [promptType, setPromptType] = useState(null);
  const isEvaluatingRef = useRef(false);
  const isActionInFlightRef = useRef(false);
  const promptTypeRef = useRef(null);

  useEffect(() => {
    promptTypeRef.current = promptType;
  }, [promptType]);

  const evaluatePrompt = useCallback(async () => {
    if (isEvaluatingRef.current || promptTypeRef.current) {
      return;
    }

    isEvaluatingRef.current = true;

    try {
      const nextPrompt = await getNextEngagementPrompt(totalPoints);
      if (nextPrompt && !promptTypeRef.current) {
        setPromptType(nextPrompt);
      }
    } catch (error) {
      console.warn('Failed to evaluate engagement prompt:', error?.message || error);
    } finally {
      isEvaluatingRef.current = false;
    }
  }, [totalPoints]);

  useEffect(() => {
    evaluatePrompt();
  }, [evaluatePrompt]);

  const dismissPrompt = useCallback(async () => {
    const currentType = promptTypeRef.current;

    if (!currentType) {
      return;
    }

    setPromptType(null);
    promptTypeRef.current = null;

    if (currentType === 'rate') {
      await markRatePromptShown();
    } else if (currentType === 'share') {
      await markSharePromptShown();
    }

    setTimeout(() => {
      evaluatePrompt();
    }, 400);
  }, [evaluatePrompt]);

  const handlePrimaryPress = useCallback(async () => {
    if (isActionInFlightRef.current || !promptTypeRef.current) {
      return;
    }

    isActionInFlightRef.current = true;
    const currentType = promptTypeRef.current;

    try {
      if (currentType === 'rate') {
        await rateApp();
      } else if (currentType === 'share') {
        await shareApp();
      }
    } catch (error) {
      console.warn('Engagement primary action failed:', error?.message || error);
    } finally {
      isActionInFlightRef.current = false;
      await dismissPrompt();
    }
  }, [dismissPrompt]);

  const handleSecondaryPress = useCallback(async () => {
    await dismissPrompt();
  }, [dismissPrompt]);

  return {
    promptType,
    promptVisible: Boolean(promptType),
    handlePrimaryPress,
    handleSecondaryPress,
  };
};

export default useEngagementPrompts;
