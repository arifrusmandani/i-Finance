import { Card, CardContent } from './ui/card';
import { useEffect, useState } from 'react';

interface UserData {
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
  user_type: string;
}

export default function GreetingCard() {
  const [username, setUsername] = useState<string>('User');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUserData: UserData = JSON.parse(userData);
        setUsername(parsedUserData.name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white overflow-hidden">
      <CardContent className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Hello, {username}!
          </h2>
          <span className="text-2xl">👋</span>
        </div>
        <div className="hidden sm:block">
          <img 
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`} 
            alt="Avatar" 
            className="w-16 h-16"
          />
        </div>
      </CardContent>
    </Card>
  );
}
