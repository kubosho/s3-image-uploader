import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SiteHeader } from '../SiteHeader';

export default {
  title: 'components/SiteHeader',
  component: SiteHeader,
} as ComponentMeta<typeof SiteHeader>;

const Template: ComponentStory<typeof SiteHeader> = (args) => <SiteHeader {...args} />;

export const SiteHeaderComponent = Template.bind({});
SiteHeaderComponent.args = {
  siteTitle: 'Web site',
};
