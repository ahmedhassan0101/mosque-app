import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfileImage({
  photo,
  name,
}: {
  photo?: string;
  name: string;
}) {
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={photo} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
        {name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
