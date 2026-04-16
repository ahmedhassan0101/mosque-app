import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function NavbarSearch() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      aria-label="بحث"
    >
      <Search className="h-4 w-4" />
    </Button>
  );
}
