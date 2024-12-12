"use client"

import React from 'react'
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from '../authContext/AuthContext'

export function UserAvatar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="flex items-center space-x-2 text-white rounded-md cursor-pointer hover:bg-gray-700"
    >
      <LogOut className="w-4 h-4" />
      <span>Log out</span>
    </Button>
  );
}
