export const hexToRgba = (hex, opacity = 1) => {
  const cleanHex = hex.replace('#', '');

  const bigint = parseInt(cleanHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};


const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const TOTAL_TIME = 120;
export const TOTAL_LETTERS = 20;

export const shuffleArray = array => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const generateLetters = answer => {
  const answerLetters = answer.toUpperCase().split('');

  const randomLetters = [];

  while (randomLetters.length < TOTAL_LETTERS - answerLetters.length) {
    randomLetters.push(ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)]);
  }

  return shuffleArray([...answerLetters, ...randomLetters]).map(
    (letter, index) => ({
      id: index.toString(),
      letter,
      selected: false,
    }),
  );
};

export const formatTime = seconds => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

