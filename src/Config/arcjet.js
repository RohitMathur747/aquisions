let arcjetModule;

if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
  arcjetModule = {
    default: () => ({
      withRule: () => ({
        protect: async () => ({
          isDenied: () => false,
          reason: {
            isBot: () => false,
            isShield: () => false,
            isRateLimit: () => false,
          },
        }),
      }),
    }),
    shield: () => ({}),
    detectBot: () => ({}),
    slidingWindow: () => ({}),
  };
} else {
  arcjetModule = await import('@arcjet/node');
}

const { default: arcjet, shield, detectBot, slidingWindow } = arcjetModule;

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode: 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});

export { shield, detectBot, slidingWindow };
export default aj;
