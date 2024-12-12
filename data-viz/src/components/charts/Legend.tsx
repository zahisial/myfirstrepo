/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { SubData } from '../../types/types';
import { TFunction } from 'i18next';

interface LegendProps {
  data: SubData[];
  colors: string[];
  unitTypeChart?: string;
  formatValue?: (value: number, unitTypeChart?: string) => string;
  //@ts-ignore
  translate: TFunction;
}

const Legend: React.FC<LegendProps> = ({ data, colors, unitTypeChart, formatValue, translate }) => {
  const formatDisplayValue = (value: number) => {
    if (formatValue) {
      return formatValue(value, unitTypeChart);
    }
    return value.toFixed(2);
  };

  return (
    <div className="flex flex-wrap gap-4 legend">
      {data.map((item, index) => (
        <div key={index} className="mt-1 legend-item">
          {item && item.name && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 color-box"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span>
                {translate(item.name.charAt(0).toUpperCase() + item.name.slice(1))}:{" "}
                {formatDisplayValue(item.value)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Legend;
