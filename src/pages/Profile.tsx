import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useProfile } from '../contexts/ProfileContext';

export default function Profile() {
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    geminiApiKey: profile.geminiApiKey || '',
    profilePicture: profile.profilePicture || ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(formData.profilePicture || null);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      geminiApiKey: profile.geminiApiKey || '',
      profilePicture: profile.profilePicture || ''
    });
    setPreviewImage(profile.profilePicture || null);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">General</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile photo
                </label>
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/png,image/jpeg,image/gif"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={triggerFileInput}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Upload new picture
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We support PNGs, JPEGs and GIFs under 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  />
                  <Button 
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="No phone number"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  />
                  <Button 
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Add phone number
                  </Button>
                </div>
              </div>

              {/* Gemini API Key Field */}
              <div className="space-y-2">
                <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gemini API Key
                </label>
                <Input
                  id="geminiApiKey"
                  name="geminiApiKey"
                  type="password"
                  value={formData.geminiApiKey}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Update
                </Button>
              </div>

              {/* Deactivate Account Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Deactivate account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This will remove you from all workspaces
                </p>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Deactivate account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 