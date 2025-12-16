import type { Meta, StoryObj } from "@storybook/react";
import { Task } from ".";

const meta: Meta<typeof Task> = {
  title: "Components/Task",
  component: Task,
};

export default meta;

type Story = StoryObj<typeof Task>;

export const Default: Story = {
  args: {},
};
