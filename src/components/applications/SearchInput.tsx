import { Input } from "@/components/ui/Field";

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <Input
      type="search"
      name="search"
      placeholder="Search company or role…"
      defaultValue={defaultValue ?? ""}
      aria-label="Search applications"
    />
  );
}
