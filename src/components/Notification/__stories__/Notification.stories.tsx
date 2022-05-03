import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Notification } from '../Notification';

export default {
  title: 'components/Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

function noop(): void {
  return;
}

const Template: ComponentStory<typeof Notification> = (args) => <Notification {...args} />;

export const NotificationIsShown = Template.bind({});
NotificationIsShown.args = {
  isShown: true,
  text: 'Lorem ipsum dolor sit amet',
  buttonText: 'OK',
  onClickCloseButton: noop,
};
