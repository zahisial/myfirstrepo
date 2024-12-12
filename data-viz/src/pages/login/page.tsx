'use client'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo';
import { useAuth } from '../../authContext/AuthContext';
import Loading from '../../components/Loading';
import fallbackImage from '../../assets/fallback-image.png'; // Replace with your actual image path
import { useTranslation } from 'react-i18next';


export default function LoginPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'default' | 'destructive'>('default');
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();


  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      setAlertMessage('Login successful!');
      setAlertType('default');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error);
      setAlertMessage('Invalid username or password.');
      setAlertType('destructive');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <>
    <div className="relative w-full min-h-screen">
      {/* Full-screen background image */}
      <img 
        src={fallbackImage} 
        alt="Login Background" 
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />
      
      {/* Centered content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-indigo-700 rounded-lg shadow-lg bg-opacity-90">
          <div className="flex flex-col mb-6 text-center">
            <h1 className="text-2xl font-medium">{t('Fujairah Municipality')}</h1>
            <div className="flex items-center justify-center mx-auto w-52">
              <Logo />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">{t('Login')}</h1>
          {showAlert && (
            <Alert variant={alertType}>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="rememberMe">{t('rememberMe')}</Label>
            </div>
            <Button type="submit" className="w-full">
              {t('Login')}
            </Button>
          </form>
          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>
      </div>
      
    </div>
   
    </>
  );
}