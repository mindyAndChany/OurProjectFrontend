import type { Meta, StoryObj } from "@storybook/react";
import { Edulink } from ".";

const meta: Meta<typeof Edulink> = {
  title: "Components/Edulink",
  component: Edulink,
};

export default meta;

type Story = StoryObj<typeof Edulink>;

export const Default: Story = {
  args: {
    className: {},
    EDULINKClassName: {},
    spanClassName: {},
  },
};
