import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageEdit } from '../ImageEdit';

export default {
  title: 'components/ImageEdit',
  component: ImageEdit,
} as ComponentMeta<typeof ImageEdit>;

const Template: ComponentStory<typeof ImageEdit> = (args) => <ImageEdit {...args} />;

export const ImageEditWithOpen = Template.bind({});
ImageEditWithOpen.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
};

export const ImageEditWithClose = Template.bind({});
ImageEditWithClose.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
};
