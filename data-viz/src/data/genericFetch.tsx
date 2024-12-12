'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface GeoJSONFeature {
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

interface GeoJSONData {
  type: "FeatureCollection"
  name: string
  features: GeoJSONFeature[]
}

interface FetchComponentProps {
  url: string
  fetchOptions?: RequestInit
  children: (data: GeoJSONFeature[], loading: boolean) => React.ReactNode
  errorComponent?: (error: Error) => React.ReactNode
  filterFunction?: (feature: GeoJSONFeature) => boolean
}

export default function Component({
  url,
  fetchOptions,
  children,
  errorComponent = DefaultError,
  filterFunction = (feature) => feature.properties.Notification === 1,
}: FetchComponentProps) {
  const [data, setData] = useState<GeoJSONFeature[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, fetchOptions)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result: GeoJSONData = await response.json()
        const filteredData = result.features.filter(filterFunction)
        setData(filteredData)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, fetchOptions, filterFunction])

  if (error) return <>{errorComponent(error)}</>
  
  return <>{children(data, loading)}</>
}

export function DefaultLoading() {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

function DefaultError({ message }: Error) {
  return (
    <div className="p-4 text-center text-red-500">
      <p>Error: {message}</p>
    </div>
  )
}