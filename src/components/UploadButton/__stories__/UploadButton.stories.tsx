import { ComponentMeta, ComponentStory } from '@storybook/react';

import { UploadButton } from '../UploadButton';

export default {
  title: 'components/UploadButton',
  component: UploadButton,
} as ComponentMeta<typeof UploadButton>;

function noop(): void {
  return;
}

const Template: ComponentStory<typeof UploadButton> = (args) => <UploadButton {...args} />;

export const UploadButtonComponent = Template.bind({});
UploadButtonComponent.args = {
  onChange: noop,
  onClick: noop,
};
