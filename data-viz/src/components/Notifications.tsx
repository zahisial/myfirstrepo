'use client'


import { Bell,  Mountain, Circle } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Badge } from "../components/ui/badge"
import GenericFetch from '../data/genericFetch'
import { SheepIcon } from './Icons'
import { useState } from 'react';

export interface GeoJSONFeature {
  type: "Feature"
  properties: {
    Notification: number
    Notification_Message: string
    Name: string
  }
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <GenericFetch
      url="/data/distric.json"
      filterFunction={(feature) => feature.properties.Notification === 1}
    >
      {(notifications, loading) => (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-indigo-900 rounded-full">
              <Bell className="w-4 h-4" />
              {!loading && notifications.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80">
            <Card className="text-white bg-indigo-800 border-none shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <Bell className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-auto">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start p-4 space-x-4 border-t border-gray-600 first:border-t-0">
                        <div className="flex-shrink-0 mt-1">
                          {index === 0 && <SheepIcon className="w-6 h-6 text-white"/>}
                          {index === 1 && <Mountain className="w-6 h-6 text-white" />}
                          {index > 1 && <Circle className="w-6 h-6" style={{fill: ['#4CAF50', '#9E9E9E', '#9C27B0'][index - 2] || '#9E9E9E'}} />}
                        </div>
                        <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.properties.Name}</p>
                          <p className="text-base font-medium">
                          {index < 2 ? notification.properties.Notification_Message.toString( ): 'Notification Type Unread'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {index === 0 && '2 min ago'}
                            {index === 1 && '5 min ago'}
                            {index === 2 && 'an hour ago'}
                            {index === 3 && '9:30 am'}
                            {index === 4 && 'Yesterday, 9:40am'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-4 text-center text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      )}
    </GenericFetch>
  )
}