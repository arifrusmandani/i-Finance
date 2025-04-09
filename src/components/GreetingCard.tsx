import { Card, CardContent } from './ui/card';

export default function GreetingCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white overflow-hidden">
      <CardContent className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Hello, Demmy!</h2>
          <span className="text-2xl">👋</span>
        </div>
        <div className="hidden sm:block">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=demmy" 
            alt="Avatar" 
            className="w-16 h-16"
          />
        </div>
      </CardContent>
    </Card>
  );
}
