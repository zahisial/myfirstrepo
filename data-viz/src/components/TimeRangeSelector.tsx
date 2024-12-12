import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "react-i18next";
import { TimeRanges } from '../types/types';

interface TimeRangeSelectorProps {
  value: TimeRanges;
  onChange: (value: TimeRanges) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Select value={value as string} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("Select time range")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3months">{t("Last 3 Months")}</SelectItem>
        <SelectItem value="6months">{t("Last 6 Months")}</SelectItem>
        <SelectItem value="12months">{t("Last 12 Months")}</SelectItem>
        <SelectItem value="24months">{t("Last 24 Months")}</SelectItem>
        <SelectItem value="all">{t("All Data")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
