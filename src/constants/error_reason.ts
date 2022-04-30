export const ERROR_REASON = {
  NOT_SET_AWS_ENVIRONMENT_VARIABLES: 'Not set AWS environment variables',
} as const;

export type ErrorReason = typeof ERROR_REASON[keyof typeof ERROR_REASON];
