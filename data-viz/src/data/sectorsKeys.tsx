

export const BASE_URL = import.meta.env.VITE_API_BASE_URL






export interface MetricKey {
  key: string;
  title: string;
  visualType:
    | "number"
    | "happiness"
    | "packedBubbleChart"
    | "radialBarChart"
    | "subLevel"
    | "landChart"
    | "stackedBarChart"
    | "divergingBarChart"
    | "groupedBarChart2"
    | "barComparisonChart"
    | "simpleBarChart"
    | "none";
  subDataArray?: boolean;
  sumType?: "sum" | "sumAverage";
  cardVisible?: boolean;
  showYears?: boolean;
  forceCalcTitle?: boolean;
  foreceSubDataSeries?: boolean;
  nonFilter?: boolean;
  hideTitle?: boolean;
  unitType?: string;
  unitTypeChart?: string;
  showGrowth?: boolean;
}

export interface SectorData {
  id: number;
  name: string;
  api: string;
  metricKeys: MetricKey[];
}

export const SECTOR_KEYS: Record<number, SectorData> = {
  0: {
    id: 0,
    name: "All Sectors",
    api: "",
    metricKeys: [],
  },
  1: {
    id: 1,
    name: "Real Estate",
    api: `/real-estate/`,
    metricKeys: [
      // { key: 'total_lands_available', title: 'Total Lands Available', visualType: 'number', sumType: 'sum', cardVisible: false},
      {
        key: "total_lands_by_type",
        title: "Total Lands Available",
        subDataArray: true,
        visualType: "landChart",
        sumType: "sum",
        
        
      },
      // { key: 'total_lands_by_subtype', title: 'Total Lands Available by land subtype', subDataArray: true, visualType: 'packedBubbleChart', sumType: 'sum' },
      {
        key: "avg_license_per_commercial_land",
        title: "Average license Per Commercial Land",
        visualType: "simpleBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        unitTypeChart: "%",
      },
      {
        key: "avg_license_per_industrial_land",
        title: "Average license Per Industrial Land",
        visualType: "simpleBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        unitTypeChart: "%",
      },
      {
        key: "avg_license_per_residential_land",
        title: "Average license Per Residential Land",
        visualType: "simpleBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        unitTypeChart: "%",
      },
      {
        key: "total_agriculture_lands",
        title: "Agriculture lands",
        visualType: "groupedBarChart2",
        sumType: "sum",
        subDataArray: true,
      },
      {
        key: "total_sheep_huts",
        title: "Sheep huts",
        visualType: "simpleBarChart",
        sumType: "sum",
        subDataArray: true,
      },
      {
        key: "total_local_houses",
        title: "Local houses",
        visualType: "groupedBarChart2",
        sumType: "sum",
        subDataArray: true,
      },
      {
        key: "total_rental_units_available",
        title: "Total Rental Units Available",
        visualType: "simpleBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "total_rental_units_by_type",
        title: "Total Rental Units Available categorized by type",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sum",
        nonFilter: true,
      },
      {
        key: "vacant_vs_occupied_general",
        title: "Vacant VS Occupied General",
        visualType: "groupedBarChart2",
        subDataArray: true,
        sumType: "sum"
      },
      {
        key: "vacant_vs_occupied_by_type",
        title: "Vacant VS Occupied by Unit Type",
        subDataArray: true,
        visualType: "stackedBarChart",
        sumType: "sum",
        hideTitle: true,
       
      },
      {
        key: "occupancy_rate",
        title: "Occupancy Rate",
        visualType: "simpleBarChart",
        sumType: "sumAverage",
        showYears: true,
        subDataArray: true,
        foreceSubDataSeries: true,
        nonFilter: false,
        unitTypeChart: "%",
      },
      {
        key: "average_rental_amount_by_usage",
        title: "Average Rental amount by Unit Usage",
        visualType: "groupedBarChart2",
        subDataArray: true,
        sumType: "sumAverage",
        nonFilter: false,
        hideTitle: true,
      },
      {
        key: "average_rental_amount_by_type",
        title: "Average Rental amount by Unit Type",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sumAverage",
        nonFilter: false,
        hideTitle: true,
      },

      // @navidurrahman below card need to merage for chart with hierarchy
      {
        key: "cancellations_of_rental_units",
        title: "Cancellations of Rental Units",
        visualType: "simpleBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "cancellations_by_use_type",
        title: "Cancellations of Rental Units by use type",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sum",
        nonFilter: false,
      },
      {
        key: "cancellations_by_unit_type",
        title: "Cancellations of Rental Units by unit type",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sum",
        nonFilter: false,
      },

      {
        key: "cancellations_of_rental_units_by_reason",
        title: "Cancellations of Rental Units by Reason",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sum",
        nonFilter: false,
      },
      {
        key: "average_rental_increase",
        title: "Average Rental Increase",
        visualType: "simpleBarChart",
        unitTypeChart: "%",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
        nonFilter: false,
        showGrowth: true
      },
      // here
      {
        key: "average_rental_increase_by_usage",
        title: "Average Rental Increase based on Unit Usage",
        visualType: "divergingBarChart",
        sumType: "sumAverage",
        subDataArray: true,
        nonFilter: false,
        hideTitle: true,
        showGrowth: true
      },
      {
        key: "average_rental_increase_by_type",
        title: "Average Rental Increase based on Unit Type",
        subDataArray: false,
        visualType: "groupedBarChart2",
        sumType: "sumAverage",
        nonFilter: false,
        hideTitle: true
      },

      {
        key: "short_term_vs_long_term_rentals",
        title: "Short Term VS Long Term Rentals",
        subDataArray: true,
        visualType: "groupedBarChart2",
        sumType: "sum",
        nonFilter: false,
      },
    ],
  },
  2: {
    id: 2,
    name: "Construction",
    api: `/construction/`,
    metricKeys: [
      {
        key: "total_completed",
        title: "Total Building Projects completed",
        visualType: "radialBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
        
      },
      // here
      {
        key: "total_completed_by_building_type",
        title: "Total Building Projects completed by Building Type",
        visualType: "groupedBarChart2",
        subDataArray: true,
        sumType: "sum",
        // hideTitle: true,
      },
      {
        key: "total_in_progress",
        title: "Total Building Projects under progress",

        visualType: "radialBarChart",

        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "total_in_progress_by_building_type",
        title: "Total Building Projects under progress by building type",

        visualType: "groupedBarChart2",

        subDataArray: true,
        sumType: "sum",
      },
      {
        key: "total_completed_by_land_type",
        title: "Total Building Projects completed by land Type",
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: true,
      },
      {
        key: "most_activities_in_permitting",
        title: "Most activities in permitting at the time of year",

        visualType: "groupedBarChart2",
        sumType: "sum",

        showYears: true,
        foreceSubDataSeries: true,
        hideTitle: true,
      },
      {
        key: "total_in_progress_by_land_type",
        title: "Total Building Projects under progress by land type",
        visualType: "groupedBarChart2",
        subDataArray: true,
        sumType: "sum",
      },
      {
        key: "avg_building_project_duration",
        title: "Average Building permit request duration",
        visualType: "radialBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        unitType: "days",
        unitTypeChart: "days"
      },
      {
        key: "avg_building_project_cost",
        title: "Average Building Projects Cost",
        visualType: "groupedBarChart2",
        sumType: "sumAverage",
        foreceSubDataSeries: true,
        showYears: true,
        unitType: "AED",
        unitTypeChart: "AED" 
      },
      {
        key: "avg_building_project_cost_by_type",
        title: "Average Building Project Cost based on Building Type",
        visualType: "packedBubbleChart",
        sumType: "sumAverage",
        subDataArray: true,
        unitType: "AED",
        unitTypeChart: "AED" 
      },
      {
        key: "avg_inspections_per_project",
        title: "Average Inspections per Projects",
        visualType: "radialBarChart",
        subDataArray: true,
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "avg_violations_per_project",
        title: "Average violations reported per Project",
        visualType: "radialBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "most_inspections_by_time",
        title: "Most inspections at the time of year",
        visualType: "groupedBarChart2",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        hideTitle: true,
      },

      {
        key: "total_tests",
        title: "Total Building Material Tests",
        visualType: "groupedBarChart2",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "avg_tests_per_project",
        title: "Total Building Material Tests per project",

        visualType: "groupedBarChart2",

        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "total_tests_by_test_type",
        title: "Average Building Material Tests by type",
        visualType: "groupedBarChart2",
        subDataArray: true,
        sumType: "sumAverage",
        hideTitle: true,
      },
    ],
  },
  3: {
    id: 3,
    name: "Economy",
    api: `/economy/`,
    metricKeys: [
      {
        key: "total_commercial_licenses_issued",
        title: "Total Commercial Licenses Issued",
        visualType: "radialBarChart",
        sumType: "sum",
        foreceSubDataSeries: true,
        subDataArray: true,
        // unitTypeChart: "%",
      },
      {
        key: "total_active_business_licenses",
        title: "Total active Business Licenses",
        visualType: "radialBarChart",
        sumType: "sum",
        foreceSubDataSeries: true,
        subDataArray: true,
        showYears: true,

      },
      {
        key: "total_professional_licenses_issued",
        title: "Total Professional Licenses Issued",
        visualType: "radialBarChart",
        sumType: "sum",
        foreceSubDataSeries: true,
        subDataArray: false,
        showYears: true,

      },
      {
        key: "total_active_professional_licenses",
        title: "Total active Professional Licenses",
        visualType: "radialBarChart",
        sumType: "sum",

        foreceSubDataSeries: true,

        subDataArray: true,

      },
      {
        key: "total_handcrafts_licenses_issued",
        title: "Total Handcrafts Licenses Issued",
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: false,
        showYears: true,
        foreceSubDataSeries: true,
        // unitTypeChart: "%",
      },
      {
        key: "total_active_handcrafts_licenses",
        title: "Total active Handcrafts Licenses",
        visualType: "radialBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "total_industrial_licenses_issued",
        title: "Total Industrial Licenses Issued",
        visualType: "radialBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "total_active_industrial_licenses",
        title: "Total active Industrial Licenses",
        foreceSubDataSeries: true,
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: false,
        showYears: true,
      },
      {
        key: "top_activities_by_month_year",
        title: "Top business activities",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
        
        hideTitle: true,
      },
      {
        key: "top_nationalities",
        title: "Top nationalities owning businesses",
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: true,
        hideTitle: true,
      },
      {
        key: "total_license_cancellations",
        title: "Total License Cancellations",
        visualType: "radialBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
      },
      {
        key: "total_license_cancellations_by_type",
        title: "Total License Cancellations by Type",
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: true,
        // unitTypeChart: "%",
      },
      // { key: 'issued_licenses_vs_commercial_rental_properties', title: 'Issued Licenses VS Commercial Rental Properties', visualType: 'radialStackedBarChart', sumType: 'sum' },
      {
        key: "avg_time_to_issue_license",
        title: "Average Time to Issue License",
        visualType: "radialBarChart",
        sumType: "sumAverage",
        showYears: true,
        foreceSubDataSeries: true,
        subDataArray: true,
        unitTypeChart: "days",
        unitType: "days"
      },
    ],
  },
  4: {
    id: 4,
    name: "Health & Hygiene",
    api: `/health-hygiene/`,
    metricKeys: [
      // { key: 'total_waste_bins', title: 'Total waste bins', visualType: 'radialStackedBarChart', sumType: 'sum' },
      {
        key: "total_waste_bins_by_type",
        title: "Total waste bins",
        visualType: "radialBarChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "total_rw",
        title: "Total Recyclables collected (ThinkGreen)",
        visualType: "radialBarChart",
        sumType: "sum",
        showYears: true,
        foreceSubDataSeries: true,
        unitType: "Tons",
        unitTypeChart: "%",
      },
      // { key: 'notified_infectious_disease_by_type_nationality', title: 'Notified Infectious Disease by type & Nationality (Including Dibba)', visualType: 'radialStackedBarChart' },
      {
        key: "slaughtered_by_type",
        title: "Animals Heads Slaughtered",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
      },
      {
        key: "meat_chopping_by_type",
        title: "Meat Chopping",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
      },
      // { key: 'condemnation_liver', title: 'Condemnation of Liver', visualType: 'radialStackedBarChart', sumType: 'sum' },
      {
        key: "condemnation_liver_by_type",
        title: "Total Condemnation of Liver",
        sumType: "sum",
        subDataArray: true,
        visualType: "subLevel",
        nonFilter : true
      },
      // { key: 'total_carcass_condemnation', title: 'Complete Carcass Condemnations', visualType: 'radialStackedBarChart', sumType: 'sum' },
      {
        key: "carcass_condemnation_by_type",
        title: "Complete Carcass Condemnations",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
        nonFilter : true
      },
      {
        key: "condemnation_by_type",
        title: "Condemnation All",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
        nonFilter : true,
      },
      {
        key: "passed_skin_by_type",
        title: "Total Pass Skin Condition",
        visualType: "subLevel",
        sumType: "sum",
        subDataArray: true,
        nonFilter : true,
      },
      // { key: 'total_damaged_skin', title: 'Damaged Skin Condition', visualType: 'radialStackedBarChart' },
      {
        key: "total_healthcard_issued",
        title: "Total Health Cards issued",
        visualType: "radialBarChart",
        sumType: "sum",
        foreceSubDataSeries: true,
        showYears: true,
        unitTypeChart: "%",
      },
    ],
  },

  // sector done with api and keys two missing in api
  5: {
    id: 5,
    name: "Community & Engagement",
    api: `/community-engagement/`,
    metricKeys: [
      {
        key: "eservice_survey_result",
        title: "Total Eservice Survey Result",
        visualType: "happiness",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "website_survey",
        title: "Total Website Survey Result",
        visualType: "happiness",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "employee_portal_survey",
        title: "Total Employee Portal Survey Result",
        visualType: "happiness",
        sumType: "sumAverage",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "instant_customer_happiness",
        title: "Total Instant customer happiness",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_happiness_shared_services",
        title:
          "Total Customer happiness rate regarding shared/government/digital services",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_happiness_communication_website",
        title:
          "Total Customer happiness rate regarding the available communication channels (website)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_happiness_call_center",
        title:
          "Total Forgetting customer happiness about the available communication channels (call center)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_happiness_social_media",
        title:
          "Total Customer happiness rate regarding available communication channels (social media)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_confidence_digital_services",
        title:
          "Level of customer confidence in electronic/digital government services",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "transparency_integrity_customers",
        title:
          "Results of transparency and integrity in the standards of dealing with customers",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "customer_satisfaction_government_communication",
        title:
          "Customer satisfaction rate with the effectiveness of government communication",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      // { key: 'forgetting_customer_satisfaction_with_the_positive_image_of_the_entity', title: 'Forgetting customer satisfaction with the positive image of the entity', visualType: 'radialStackedBarChart' },
      {
        key: "customer_happiness",
        title: "Customer happiness rate",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "job_happiness",
        title: "Job happiness",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "human_resources_happiness",
        title:
          "Human resources happiness and the level of confidence in internal electronic services and systems",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "positive_results_at_work",
        title: "Positive results at work",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "job_loyalty",
        title: "Job loyalty",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "transparency_integrity_hr",
        title:
          "Transparency, integrity and equal opportunities in standards for dealing with human resources",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "employee_satisfaction_government_communication",
        title:
          "Employee satisfaction rate with the effectiveness of government communication",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "employee_satisfaction_positive_image",
        title:
          "Percentage of employees satisfaction with the positive image of the entity",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "functional_harmony",
        title: "Functional harmony",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "community_happiness_website",
        title:
          "Community happiness rate regarding available communication channels (website)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "community_happiness_call_center",
        title:
          "Community happiness about the available communication and communication channels (call center)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "community_happiness_social_media",
        title:
          "Community happiness about the available communication and communication channels (social media)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "community_satisfaction_government_communication",
        title:
          "Community satisfaction rate with the effectiveness of government communication",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "community_satisfaction_positive_image",
        title:
          "Percentage of community satisfaction with the positive image of the entity",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "average_community_satisfaction",
        title: "Average percentage of community satisfaction",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "partners_happiness_rate",
        title: "Overall impression/partners happiness rate",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "partners_commitment",
        title:
          "Commitment to the terms and conditions of the partnership and the extent of benefiting from them",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "effectiveness_of_cooperation",
        title: "Effectiveness of cooperation",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "transparency_in_dealing",
        title: "Transparency in dealing",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      // { key: 'social_media_channels_effectiveness', title: 'Social Media Channels Effectiveness', visualType: 'lines' , sumType: 'sum'},
      {
        key: "ease_of_providing_info",
        title: "Ease of providing and exchanging information",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "partner_happiness_rate_web",
        title:
          "Partners happiness rate regarding the available communication channels (website)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "partner_happiness_rate_call",
        title:
          "Partners happiness rate regarding the available communication and communication channels (call center)",
        visualType: "barComparisonChart",
        sumType: "sum",
        subDataArray: true,
        unitTypeChart: "%",
      },
      {
        key: "partner_happiness_rate_social",
        title:
          "Partners happiness rate regarding available communication channels (social media)",
        visualType: "barComparisonChart",
        sumType: "sumAverage",
        subDataArray: true,
        unitTypeChart: "%",
      },
    ],
  },
};

export function createSectorDataFetcher<T>(sectorId: number) {
  const sector = SECTOR_KEYS[sectorId];
  if (!sector) {
    throw new Error(`Invalid sector ID: ${sectorId}`);
  }
  return async (options: RequestInit = {}): Promise<T> => {
    const response = await fetch(sector.api, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };
}
