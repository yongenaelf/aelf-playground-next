import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

export function InputOutputOptions({ options = [] }: { options?: string[] }) {
  return (
    <SelectContent>
      {options.length > 0 ? (
        <SelectGroup>
          <SelectLabel>Custom</SelectLabel>
          {options.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectGroup>
      ) : null}
      <SelectGroup>
        <SelectLabel>Google Protobuf</SelectLabel>
        {["empty", "timestamp"].map((i) => (
          <SelectItem key={i} value={i}>
            {i}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
}
