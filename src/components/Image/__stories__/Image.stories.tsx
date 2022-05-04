import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Image } from '../Image';

export default {
  title: 'components/Image',
  component: Image,
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />;

export const ImageComponent = Template.bind({});
ImageComponent.args = {
  imageName: 'image name',
  imageUrl: 'https://placekitten.com/600/300',
};
