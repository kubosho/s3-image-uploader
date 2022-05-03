import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageDetail } from '../ImageDetail';

export default {
  title: 'components/ImageDetail',
  component: ImageDetail,
} as ComponentMeta<typeof ImageDetail>;

function noop(): void {
  return;
}

const Template: ComponentStory<typeof ImageDetail> = (args) => <ImageDetail {...args} />;

export const ImageDetailWithOpen = Template.bind({});
ImageDetailWithOpen.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
  open: true,
  onClickCloseButton: noop,
};

export const ImageDetailWithClose = Template.bind({});
ImageDetailWithClose.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
  open: false,
  onClickCloseButton: noop,
};
