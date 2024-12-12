'use client'

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Link } from 'react-router-dom';

/**
 * Forgot Password Page component
 *
 * This component handles the forgot password functionality, including
 * validating the email address, saving the email to local storage, and
 * displaying a success or error message.
 *
 * @example
 * ```jsx
 * <ForgotPasswordPage />
 * ```
 */
export default function ForgotPasswordPage() {
    /**
     * State variables
     */
    const [email, setEmail] = useState('') // Email address input value
    const [showAlert, setShowAlert] = useState(false) // Whether to show the alert message
    const [alertMessage, setAlertMessage] = useState('') // Alert message text
  
    /**
     * Effect to retrieve saved email from local storage
     */
    useEffect(() => {
      const savedEmail = localStorage.getItem('forgotPasswordEmail')
      if (savedEmail) {
        setEmail(savedEmail)
      }
    }, [])
  
    /**
     * Email validation function
     *
     * @param {string} email - Email address to validate
     * @returns {boolean} Whether the email address is valid
     *
     * @example
     * const isValid = validateEmail('example@example.com') // true
     * const isInvalid = validateEmail('invalid email') // false
     */
    const validateEmail = (email: string) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Email regex pattern
      return re.test(String(email).toLowerCase())
    }
  
    /**
     * Handle form submission
     *
     * @param {React.FormEvent} e - Form event
     */
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
  
      if (!validateEmail(email)) {
        setAlertMessage('Please enter a valid email address.')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000) // Hide alert after 3 seconds
        return
      }
  
      // Save email to local storage
      localStorage.setItem('forgotPasswordEmail', email)
  
      // Here you would typically send a request to your backend to handle the password reset
      // For this example, we'll just show a success message
      setAlertMessage('Password reset link sent to your email!')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000) // Hide alert after 3 seconds
    }
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-900 ">
        <div className="w-full max-w-md p-8 space-y-6 bg-indigo-800 shadow-md rounded-xl">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
          {showAlert && (
            <Alert variant={alertMessage.includes('sent') ? 'default' : 'destructive'}>
              <AlertDescription>
                {alertMessage}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
          <div className="text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div> <div className="text-center">
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    )
  }