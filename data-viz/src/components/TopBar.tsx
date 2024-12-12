import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserAvatar } from "./UserAvatar"
import LogoSmall from '../assets/logoSmall'
import LanguageSwitch from './LanguageSwitcher'
import { Link } from 'react-router-dom'
import GenericSelector from './GenericSelector'
import { District } from '../types/District'
import { SECTOR_KEYS } from '../data/sectorsKeys';
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

// Update the interface
interface TopBarProps {
  selectedSector: string; // Change this to string
  selectedDistrict: string;
  onSectorChange: (sector: string) => void; // Change this to string
  onDistrictChange: (district: string) => void;
  availableSectors: string[]; // Change this to string[]
  districts: District[];
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
  DEFAULT_STYLE: string;
  SATELLITE_STYLE: string;
}


export default function TopBar({
  selectedSector,
  selectedDistrict,
  onSectorChange,
  onDistrictChange,
  availableSectors,
  districts,
  mapStyle,
  onMapStyleChange,
  DEFAULT_STYLE,
  SATELLITE_STYLE,
}: TopBarProps) {
  const { t, i18n } = useTranslation()
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string, label: string }>>([])

  const isRTL = i18n.language === 'ar'

  const sectorOptions = [
    { value: SECTOR_KEYS[0].name, label: t(SECTOR_KEYS[0].name) },
    ...availableSectors.map(sectorName => ({ 
      value: sectorName, 
      label: t(sectorName)
    }))
  ]

  useEffect(() => {
    const updatedDistrictOptions = districts.map(district => ({
      value: district.properties.AreaId.toString(),
      label: isRTL 
        ? (district.properties.AreaId === -1 
            ? "جميع المناطق" 
            : district.properties.NAME_AR || district.properties.NAME_EN)
        : district.properties.NAME_EN
    }))
    setDistrictOptions(updatedDistrictOptions)
  }, [districts, isRTL])

  return (
    <nav className="flex items-center justify-between pt-2 pb-2 pl-4 pr-4 text-white bg-indigo-700">
      <div className="flex items-center gap-4">
        <LanguageSwitch />
        <div className="flex items-center gap-2">
          <Switch
            id="style-switch"
            checked={mapStyle === SATELLITE_STYLE}
            onCheckedChange={(checked) => {
              const newStyle = checked ? SATELLITE_STYLE : DEFAULT_STYLE;
              onMapStyleChange(newStyle);
            }}
            className="bg-white data-[state=checked]:bg-green-500 rtl:order-last rtl:transform rtl:rotate-180"
          />
          <Label htmlFor="style-switch" className="text-white">
            {t("Satellite View")}
          </Label>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4">
        <GenericSelector
          options={sectorOptions}
          placeholder={t("Select Sector")}
          onChange={onSectorChange}
          value={selectedSector}
          searchable={true}
          searchPlaceholder={t("Search Sector")}
          isRTL={isRTL}
        />
      
        <Link to="/" className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
          <LogoSmall />
        </Link>
        
        <GenericSelector
          options={districtOptions}
          placeholder={t("Select District")}
          onChange={onDistrictChange}
          value={selectedDistrict}
          searchable={true}
          searchPlaceholder={t("Search District")}
          emptyMessage={t("no Districts Found")}
          isRTL={isRTL}
        />
      </div>

      <div className="flex flex-row items-center gap-8">
        <UserAvatar />
      </div>
    </nav>
  )
}
