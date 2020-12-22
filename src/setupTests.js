// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: arr => arr.map(() => Math.ceil(Math.random() * 2000) + 1)
    },
  });
