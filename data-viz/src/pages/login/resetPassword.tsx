'use client';

import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Link } from 'react-router-dom';;
/**
 * PasswordResetPage component
 *
 * This component handles password reset functionality, including form validation and submission.
 *
 * @example
 * ```jsx
 * <PasswordResetPage />
 * ```
 */
const PasswordResetPage: React.FC = () => {
    /**
     * State variables for new password, confirm password, and alert messages
     */
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'default' | 'destructive'>('default');
  
    /**
     * Validate passwords function
     *
     * Checks if new password is at least 8 characters long and matches confirm password.
     * If validation fails, sets alert message and type.
     *
     * @returns {boolean} true if passwords are valid, false otherwise
     */
    const validatePasswords = (): boolean => {
      if (newPassword.length < 8) {
        setAlertMessage('Password must be at least 8 characters long.');
        setAlertType('destructive');
        return false;
      }
      if (newPassword !== confirmPassword) {
        setAlertMessage('Passwords do not match.');
        setAlertType('destructive');
        return false;
      }
      return true;
    };
  
    /**
     * Handle form submission function
     *
     * Validates passwords, saves new password to local storage, simulates sending an email,
     * and shows success message.
     *
     * @param {React.FormEvent} e - form submission event
     */
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validatePasswords()) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
        return;
      }
  
      // Save new password to local storage
      localStorage.setItem('userPassword', newPassword);
  
      // Simulate sending an email
      const userEmail = localStorage.getItem('forgotPasswordEmail') || 'user@example.com';
      console.log(`Simulating email sent to ${userEmail} for password reset activity.`);
  
      // Show success message
      setAlertMessage('Password reset successful! An email confirmation has been sent.');
      setAlertType('default');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        // In a real app, you might redirect to the login page here
      }, 3000);
  
      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-indigo-800 shadow-md rounded-xl">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          {showAlert && (
            <Alert variant={alertType}>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
              />
            </div>
            <Button type="submit" className="w-full">Reset Password</Button>
          </form>
          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default PasswordResetPage;