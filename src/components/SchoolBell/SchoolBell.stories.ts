import type { Meta, StoryObj } from "@storybook/react";
import { SchoolBell } from ".";

const meta: Meta<typeof SchoolBell> = {
  title: "Components/SchoolBell",
  component: SchoolBell,
};

export default meta;

type Story = StoryObj<typeof SchoolBell>;

export const Default: Story = {
  args: {},
};
