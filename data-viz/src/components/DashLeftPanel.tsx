/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { AreaIcon, EconomyIcon, PopulationIcon } from './Icons'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

interface DashLeftPanelProps {
  selectedDistrict: string;
  selectedSector: string;
}

// Remove the DashboardDataType interface as it's no longer needed

interface CardData {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  totalLands?: {
    total: number;
    available: number;
  };
}

function DashCard({ title, value, subValue, icon: Icon, borderColor }: CardData) {
  const { t } = useTranslation();

  console.log('Translating title:', title);
  console.log('Translating value:', value);
  if (subValue) {
    console.log('Translating subValue:', subValue);
  }

  return (
    <Card 
      className={`bg-black border-0 transition-all bg-transparent border-s-4 ${borderColor} mb-4 rounded-none p-3`}
    >
      <CardHeader className="flex flex-row items-center justify-start gap-2 p-3 pt-0 pb-0 ">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <CardTitle className="text-sm font-medium text-white uppercase">{t(title)}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-0">
        <div dir={i18n.dir()} className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : t(value)}
        </div>
        {subValue && <p className="text-xs text-white">{t(subValue)}</p>}
      </CardContent>
    </Card>
  )
}

export default function DashLeftPanel({ selectedDistrict, selectedSector }: DashLeftPanelProps) {
  // Remove the data variable and console.log
  const { t } = useTranslation();

  const cardData: CardData[] = [
    {
      id: "area",
      title: "Area",
      value: "1,260 Sq.KM",
      subValue: "",
      icon: AreaIcon,
      borderColor: "border-yellow-500"
    },
    {
      id: "population",
      title: "Population",
      value: "221,543",
      subValue: "Source: Fujairah Statistics Center 2023",
      icon: PopulationIcon,
      borderColor: "border-blue-500"
    },
    // {
    //   id: "economy",
    //   title: "Economy",
    //   value: "----",
    //   subValue: "AED",
    //   icon: EconomyIcon,
    //   borderColor: "border-green-500"
    // }
  ]

  return (
    <div className="flex flex-col relative xl:top-0 md:top-[25svh] gap-28">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">{t("Welcome to")}</h1>
        <h2 className="text-2xl text-white">{t("Fujairah")}</h2>
      </div>
      <div>
        {cardData.map((card) => (
          <DashCard
            key={card.id}
            {...card}
          />
        ))}
      </div>
    </div>
  )
}
