/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import logoMain from '../assets/logo-main.svg'
import skyline from '../assets/skyline.png'
import logo from '../assets/logo.png'
import mersad from '../assets/mersad.png'
import almusaed from '../assets/almusaed.png'
import taqyeem from '../assets/taqyeem.png'
import glasses from '../assets/glasses.png'


export default function LandingPage() {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Video playback failed:", error)
          setVideoError(true)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const services = [
    { name: 'Mersad', arabicName: 'مرصاد', icon: mersad, link: '/login' },
    { name: 'Al Musaed', arabicName: 'المساعد', icon: almusaed, link: 'https://almersad.fujmun.gov.ae/Video/Video1.mp4', openInNew: true },
    { name: 'Taqyeem', arabicName: 'تقييم', icon: taqyeem, link: "https://app.ricohprojects.com/projects", openInNew: true },
    { name: 'Smart Glasses Operations', arabicName: 'عمليات النظارات الذكية', icon: glasses, link: 'https://almersad.fujmun.gov.ae/Video/Video2.mp4', openInNew: true },
  ]

  const handleServiceClick = useCallback((service: {
    openInNew?: boolean;
    link: string;
  }) => {
    if (service.openInNew) {
      window.open(service.link, '_blank', 'noopener,noreferrer')
    } else {
      navigate(service.link)
    }
  }, [navigate])

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-indigo-900">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 to-indigo-700" />

      {/* Video Background with Overlay */}
      {!videoError && (
        <div className="absolute inset-0 z-10">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
            onError={() => setVideoError(true)}
          >
            <source src="/data/test.mp4" type="video/mp4" /> {/* Updated video source */}
            <source src="/data/video.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen">
        <nav className="flex items-center justify-center pt-2 pb-2 pl-4 pr-4 text-white bg-indigo-700">
          <div className="flex flex-row items-center gap-4">
            <img src={logoMain} alt="Fujairah Municipality" className="w-80" />
          </div>
        </nav>

        <main className="flex flex-col items-center justify-center flex-grow px-4">
          <div className="mb-8">
            <img src={logo} alt="Fujairah AI" className="h-auto w-72" />
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4"> 
            {services.map((service, index) => (
              <div 
                key={index} 
                onClick={() => handleServiceClick(service)}
                className="max-w-md p-px transition duration-300 ease-in-out transform rounded-3xl bg-gradient-to-b min-h-80 from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="flex flex-col items-center p-4 text-center transition-colors min-h-80 bg-indigo-800 rounded-[calc(1.5rem-1px)] hover:bg-indigo-700 active:bg-indigo-900">
                  <div className="h-48 mb-2">
                    <img src={service.icon} alt={service.name} className="object-contain w-full h-full" />
                  </div>
                  <h2 className="text-lg font-bold font-cairo">{service.arabicName}</h2>
                  <h2 className="text-lg font-bold">{service.name}</h2>
                </div>
              </div>
            ))}
          </div>
          

        </main>

        {/* City Skylines */}
        <div className="absolute bottom-0 left-0 h-32 w-3/3">
          <img src={skyline} alt="Left Skyline" className="object-contain w-full h-full" />
        </div>
        <div className="absolute bottom-0 right-0 h-32 w-3/3">
          <img src={skyline} alt="Right Skyline" className="object-contain w-full h-full" />
        </div>
      </div>
    </div>
  )
}
