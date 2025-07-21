export const PLATFORM = {
  TWITTER: 'TWITTER',
  REDDIT: 'REDDIT',
  NEWS: 'NEWS'
} as const;

export type PLATFORM_TYPE = typeof PLATFORM[keyof typeof PLATFORM];