import type { Meta, StoryObj } from "@storybook/react";
import { NoteEdit } from ".";

const meta: Meta<typeof NoteEdit> = {
  title: "Components/NoteEdit",
  component: NoteEdit,
};

export default meta;

type Story = StoryObj<typeof NoteEdit>;

export const Default: Story = {
  args: {},
};
