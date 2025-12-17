import type { Meta, StoryObj } from "@storybook/react";
import { User } from ".";

const meta: Meta<typeof User> = {
  title: "Components/User",
  component: User,
};

export default meta;

type Story = StoryObj<typeof User>;

export const Default: Story = {
  args: {},
};
