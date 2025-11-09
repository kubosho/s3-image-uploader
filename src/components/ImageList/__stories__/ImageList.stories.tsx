import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ImageList } from '../ImageList';

export default {
  title: 'components/ImageList',
  component: ImageList,
} as ComponentMeta<typeof ImageList>;

const Template: ComponentStory<typeof ImageList> = (args) => <ImageList {...args} />;

export const ImageListWithOpen = Template.bind({});
ImageListWithOpen.args = {
  imageUrls: [
    'https://placekitten.com/600/300',
    'https://placekitten.com/500/300',
    'https://placekitten.com/400/300',
    'https://placekitten.com/300/600',
    'https://placekitten.com/300/500',
    'https://placekitten.com/300/400',
  ],
};
