"use client";

import { useState, useRef, useEffect } from "react";
import Canvas from "./Canvas";
import RoundInfo from "./RoundInfo";
import { isGuessResponse, Word } from "../types";
import SketchInfo from "./SketchInfo";

type Props = {
  round: number;
  endRound: () => void;
  word: Word;
  guess: Word | null;
  changeGuess: (newGuess: Word) => void;
};

const Sketch: React.FC<Props> = ({
  round,
  endRound,
  word,
  guess,
  changeGuess,
}) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const guessTimer = setInterval(guessSketch, 5000);
    const roundTimer = setInterval(updateTime, 1000);

    function updateTime() {
      setTimeLeft(prevTime => {
        if (prevTime === 0) {
          clearInterval(roundTimer);
          clearInterval(guessTimer);
          return 0;
        }

        return prevTime - 1;
      });
    }

    async function guessSketch() {
      if (!canvas.current) return;

      canvas.current.toBlob(async blob => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "drawing.png");

        const response = await fetch("http://127.0.0.1:8000/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!isGuessResponse(data)) return;

        changeGuess(data.guess);
        if (data.guess == word) {
          clearInterval(roundTimer);
          clearInterval(guessTimer);
          endRound();
        }
      }, "image/jpg");
    }

    return () => {
      clearInterval(roundTimer);
      clearInterval(guessTimer);
    };
  }, [changeGuess, endRound, word]);

  useEffect(() => {
    if (timeLeft === 0) {
      endRound();
    }
  }, [timeLeft, endRound]);

  return (
    <>
      <SketchInfo word={word} guess={guess} />
      <Canvas canvas={canvas} />
      <RoundInfo round={round} timeLeft={timeLeft} />
    </>
  );
};

export default Sketch;
