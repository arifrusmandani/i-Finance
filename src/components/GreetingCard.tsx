import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const GreetingCard = () => {
  return (
    <div className="bg-blue-500 text-white rounded-2xl p-6 flex items-center justify-between shadow-md">
      <div className="text-2xl font-semibold">
        Hello, Demmy!
      </div>
      <Avatar className="w-14 h-14 rounded-full border-2 border-white shadow-lg">
        <AvatarImage src="avatar.png" alt="User Avatar" />
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default GreetingCard;
