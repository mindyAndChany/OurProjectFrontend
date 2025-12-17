import type { Meta, StoryObj } from "@storybook/react";
import { Crowdfunding } from ".";

const meta: Meta<typeof Crowdfunding> = {
  title: "Components/Crowdfunding",
  component: Crowdfunding,
};

export default meta;

type Story = StoryObj<typeof Crowdfunding>;

export const Default: Story = {
  args: {
    className: {},
    crowdfunding: "/img/crowdfunding-2.png",
  },
};
