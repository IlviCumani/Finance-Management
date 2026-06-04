import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../ui/emoji-picker"
import { PropsWithChildren } from "react"

type EmojiPopoverProps = {
  onChange: (emoji: string) => void
}

export function EmojiPopover({
  onChange,
  children,
}: PropsWithChildren<EmojiPopoverProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <EmojiPicker
          className="h-84 overflow-auto"
          onEmojiSelect={(emoji) => {
            onChange(emoji.emoji)
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  )
}
