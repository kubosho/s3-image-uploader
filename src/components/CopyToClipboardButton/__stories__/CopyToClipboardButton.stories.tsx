import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CopyToClipboardButton } from '../CopyToClipboardButton';

export default {
  title: 'components/CopyToClipboardButton',
  component: CopyToClipboardButton,
} as ComponentMeta<typeof CopyToClipboardButton>;

const Template: ComponentStory<typeof CopyToClipboardButton> = (args) => <CopyToClipboardButton {...args} />;

export const CopyToClipboardButtonComponent = Template.bind({});
CopyToClipboardButtonComponent.args = {
  text: 'Link text',
  url: 'https://example.com/',
};
