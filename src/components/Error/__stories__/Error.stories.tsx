import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ERROR_REASON } from '../../../constants/error_reason';
import { Error } from '../Error';

export default {
  title: 'components/Error',
  component: Error,
} as ComponentMeta<typeof Error>;

const Template: ComponentStory<typeof Error> = (args) => <Error {...args} />;

export const ErrorWithNotSetAwsEnvironmentVariables = Template.bind({});
ErrorWithNotSetAwsEnvironmentVariables.args = {
  errorReason: ERROR_REASON.NOT_SET_AWS_ENVIRONMENT_VARIABLES,
};

export const ErrorWithGeneralError = Template.bind({});
ErrorWithGeneralError.args = {
  errorReason: ERROR_REASON.GENERAL_ERROR,
};
