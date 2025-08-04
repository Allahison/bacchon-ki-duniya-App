// data/numbers.js

const numbers = Array.from({ length: 100 }, (_, i) => {
  const number = i + 1;
  return {
    number: number.toString(),         // Example: '1', '2', ...
    sound: ` ${number}`, // Example: "This is number 1"
  };
});

export default numbers;
