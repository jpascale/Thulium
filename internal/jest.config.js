module.exports = {
  clearMocks: true,
  globals: {
    NODE_ENV: 'test'
  },
  rootDir: "./",
  testEnvironment: "node",
  // The glob patterns Jest uses to detect test files
   testMatch: [
     "**/test/**/*_test.js?(x)"
   ],
   testPathIgnorePatterns: [
     "/node_modules/"
   ],
};
