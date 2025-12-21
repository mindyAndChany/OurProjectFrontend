import type { Meta, StoryObj } from "@storybook/react";
import { LicenseDraft } from ".";

const meta: Meta<typeof LicenseDraft> = {
  title: "Components/LicenseDraft",
  component: LicenseDraft,
};

export default meta;

type Story = StoryObj<typeof LicenseDraft>;

export const Default: Story = {
  args: {
    className: {},
    licenseDraft: "/img/license-draft-2.png",
  },
};
