import { Result, Word } from "./types";

export const WORDS = [
  "fan",
  "moon",
  "microphone",
  "calculator",
  "van",
  "spider",
  "parrot",
  "piano",
  "scorpion",
  "broccoli",
] as const;

export const getRandomWord = (results: Result[]) => {
  let word: Word;

  do word = WORDS[Math.floor(Math.random() * WORDS.length)];
  while (results.some(result => result.word === word));

  return word;
};
