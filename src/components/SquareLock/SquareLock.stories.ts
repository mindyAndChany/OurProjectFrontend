import type { Meta, StoryObj } from "@storybook/react";
import { SquareLock } from ".";

const meta: Meta<typeof SquareLock> = {
  title: "Components/SquareLock",
  component: SquareLock,
};

export default meta;

type Story = StoryObj<typeof SquareLock>;

export const Default: Story = {
  args: {},
};
