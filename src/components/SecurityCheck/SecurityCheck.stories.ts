import type { Meta, StoryObj } from "@storybook/react";
import { SecurityCheck } from ".";

const meta: Meta<typeof SecurityCheck> = {
  title: "Components/SecurityCheck",
  component: SecurityCheck,
};

export default meta;

type Story = StoryObj<typeof SecurityCheck>;

export const Default: Story = {
  args: {},
};
