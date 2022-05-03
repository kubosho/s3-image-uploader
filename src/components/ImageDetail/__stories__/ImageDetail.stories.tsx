import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageDetail } from '../ImageDetail';

export default {
  title: 'components/ImageDetail',
  component: ImageDetail,
} as ComponentMeta<typeof ImageDetail>;

const Template: ComponentStory<typeof ImageDetail> = (args) => <ImageDetail {...args} />;

export const ImageDetailWithOpen = Template.bind({});
ImageDetailWithOpen.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
};

export const ImageDetailWithClose = Template.bind({});
ImageDetailWithClose.args = {
  name: 'Image name',
  url: 'https://placekitten.com/600/300',
  alt: 'Image alt text',
};
