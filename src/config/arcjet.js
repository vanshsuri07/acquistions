import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const isDev = process.env.NODE_ENV !== 'production';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: isDev ? 'DRY_RUN' : 'LIVE', // Log only in dev, block in production
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:PREVIEW',
        // Allow common testing tools
        ...(isDev ? ['POSTMAN', 'CURL', 'INSOMNIA'] : []),
      ],
    }),
    slidingWindow({
      mode: isDev ? 'DRY_RUN' : 'LIVE', // More lenient in dev
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;
