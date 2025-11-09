import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AltTextEdit } from '../AltTextEdit';

export default {
  title: 'components/AltTextEdit',
  component: AltTextEdit,
} as ComponentMeta<typeof AltTextEdit>;

function noop(): void {
  return;
}

const Template: ComponentStory<typeof AltTextEdit> = (args) => <AltTextEdit {...args} />;

export const AltTextEditComponent = Template.bind({});
AltTextEditComponent.args = {
  onClickSubmit: noop,
};

export const AltTextEditWithInitialText = Template.bind({});
AltTextEditWithInitialText.args = {
  initialText: 'Test initial text',
  onClickSubmit: noop,
};
