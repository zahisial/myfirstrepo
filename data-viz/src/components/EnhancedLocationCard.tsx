/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { SECTOR_KEYS } from '../data/sectorsKeys'
import { Button } from "./ui/button"; // Make sure to import Button

interface EnhancedLocationCardProps {
  properties: {
    NAME_EN: string;
    NAME_AR?: string;
    FID?: string;
    Population?: number;
    Notification?: number;
    Notification_Message?: string;
    SHAPE_STAr?: string | number;
    AreaId?: number;
  };
  onSectorSelect: (sector: { value: string; label: string }) => void;
  onNavigate: (sectorUrl: string, districtId: string) => void; // Add this prop
}

export default function EnhancedLocationCard({ 
  properties, 
  onSectorSelect,
  onNavigate 
}: EnhancedLocationCardProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const handleSectorClick = (sector: any) => {
    try {
      // Get the sector URL path
      const sectorUrl = sector.name === "All Sectors" ? "allsector" : 
        sector.api?.replace(/\//g, '') || 
        sector.name.toLowerCase().replace(/ /g, '-');

      // Get the current district ID from properties
      const districtId = properties.AreaId?.toString() || "-1";

      // Use the passed navigation function
      onNavigate(sectorUrl, districtId);

      // Call the original onSectorSelect function
      if (typeof onSectorSelect === 'function') {
        onSectorSelect({
          value: sector.name,
          label: t(sector.name)
        });
      }
    } catch (error) {
      console.error('Error in sector selection:', error);
    }
  };

  return (
    <Card className={`w-[300px] bg-indigo-700 text-white relative ${isRTL ? 'text-right' : 'text-left'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {isRTL ? properties.NAME_AR : properties.NAME_EN}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <p className="mb-4 text-sm text-gray-300">
          {t('cardDescription')}
        </p> */}
        <div className="mb-2 space-y-2">
          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-400">{t('Area Name')}</span>
            <span>{isRTL ? properties.NAME_AR : properties.NAME_EN}</span>
          </div>
          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-gray-400">{t('Area Code')}</span>
            <span>{properties.FID || t('notAvailable')}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-semibold">{t('Notification')}:</span> 
            <Badge variant={properties.Notification && properties.Notification > 0 ? "destructive" : "secondary"} className={isRTL ? 'ml-2' : 'mr-2'}>
              {properties.Notification || 0}
            </Badge>
          </div>
          {properties.Notification && properties.Notification > 0 && properties.Notification_Message && (
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <span className="font-semibold">{t('Message')}:</span> {properties.Notification_Message}
            </div>
          )}
        </div>
        <div className="pt-4 mt-4 border-t border-gray-600">
          <div className={`flex items-center flex-wrap gap-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            {Object.values(SECTOR_KEYS)
              .filter(sector => sector.name !== "All Sectors")
              .map((sector) => (
                <Button 
                  key={sector.name}
                  variant="outline" 
                  size="sm"
                  className="h-6 px-2 text-md cursor-pointer hover:bg-indigo-600 text-white border-white/20 bg-transparent transition-colors"
                  onClick={() => handleSectorClick(sector)}
                >
                  {t(sector.name)}
                </Button>
              ))}
          </div> 
        </div>
      </CardContent>
    </Card>
  )
}
