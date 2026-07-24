import React from 'react';
import EngagementPromptModal from '../engagementPromptModal';
import useEngagementPrompts from '../../hooks/useEngagementPrompts';
import useTotalPoints from '../../hooks/useTotalPoints';

const EngagementPromptsHost = () => {
  const { totalPoints } = useTotalPoints();
  const {
    promptType,
    promptVisible,
    handlePrimaryPress,
    handleSecondaryPress,
  } = useEngagementPrompts(totalPoints);

  return (
    <EngagementPromptModal
      visible={promptVisible}
      type={promptType}
      onPrimaryPress={handlePrimaryPress}
      onSecondaryPress={handleSecondaryPress}
    />
  );
};

export default EngagementPromptsHost;
