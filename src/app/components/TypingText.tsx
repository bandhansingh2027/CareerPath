import { useEffect, useState } from 'react';

interface TypingTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function TypingText({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1800,
}: TypingTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: number;
    const currentFullWord = words[currentWordIndex];

    if (isDeleting) {
      // Deleting mode
      timer = window.setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      // Typing mode
      timer = window.setTimeout(() => {
        setCurrentText((prev) => currentFullWord.slice(0, prev.length + 1));
      }, typingSpeed + Math.random() * 40); // Add variance for natural look
    }

    // State transitions
    if (!isDeleting && currentText === currentFullWord) {
      // Word fully typed, wait and switch to deleting
      timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenWords);
    } else if (isDeleting && currentText === '') {
      // Word fully deleted, move to next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span className="hero-typing-accent">{currentText}</span>
      <span className="hero-typing-cursor">|</span>
    </span>
  );
}
