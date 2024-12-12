export const dashboardData = {
  'All Sectors': {
    'All Districts': {
      total_lands_available: {
        value:"143k", // 143 sq mik,
        change: 37.8,
        period: 'month',
        trend: [1700, 3500, 15000, 7500, 12000, 5000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 180000 },
            { name: 'Week 2', value: 190000 },
            { name: 'Week 3', value: 200000 },
            { name: 'Week 4', value: 210000 },
            { name: 'Week 5', value: 220000 },
            { name: 'Week 6', value: 224000 },
          ],
          monthly: [
            { name: 'Jan', value: 170000 },
            { name: 'Feb', value: 300000 },
            { name: 'Mar', value: 200000 },
            { name: 'Apr', value: 215000 },
            { name: 'May', value: 224000 },
          ],
        },
        mapData: null
      },
      total_building_projects: {
        value: "143k",
        change: -37.8,
        period: 'month',
        trend: [65000, 68000, 71000, 74000, 77000, 79000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 65000 },
            { name: 'Week 2', value: 68000 },
            { name: 'Week 3', value: 71000 },
            { name: 'Week 4', value: 74000 },
            { name: 'Week 5', value: 77000 },
            { name: 'Week 6', value: 79000 },
          ],
          monthly: [
            { name: 'Jan', value: 60000 },
            { name: 'Feb', value: 65000 },
            { name: 'Mar', value: 70000 },
            { name: 'Apr', value: 75000 },
            { name: 'May', value: 79000 },
          ],
        },
        mapData: null
      },
      total_business_licenses : {
        value: "164k",
        change: 37.8,
        period: 'month',
        trend: [120000, 125000, 130000, 135000, 140000, 143000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 135000 },
            { name: 'Week 2', value: 137000 },
            { name: 'Week 3', value: 139000 },
            { name: 'Week 4', value: 141000 },
            { name: 'Week 5', value: 142000 },
            { name: 'Week 6', value: 143000 },
          ],
          monthly: [
            { name: 'Jan', value: 120000 },
            { name: 'Feb', value: 125000 },
            { name: 'Mar', value: 130000 },
            { name: 'Apr', value: 135000 },
            { name: 'May', value: 143000 },
          ],
        },
        mapData: null
      },
      total_hospitals_clinics : {
        value: "40",
        change: -37.8,
        period: 'month',
        trend: [280, 285, 290, 295, 300, 302],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 280 },
            { name: 'Week 2', value: 285 },
            { name: 'Week 3', value: 290 },
            { name: 'Week 4', value: 295 },
            { name: 'Week 5', value: 300 },
            { name: 'Week 6', value: 302 },
          ],
          monthly: [
            { name: 'Jan', value: 270 },
            { name: 'Feb', value: 280 },
            { name: 'Mar', value: 290 },
            { name: 'Apr', value: 295 },
            { name: 'May', value: 302 },
          ],
        },
        mapData: null
      },
      total_number_of_parks : {
        value: "132",
        change: -37.8,
        period: 'month',
        trend: [100000, 105000, 110000, 115000, 118000, 120000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 100000 },
            { name: 'Week 2', value: 105000 },
            { name: 'Week 3', value: 110000 },
            { name: 'Week 4', value: 115000 },
            { name: 'Week 5', value: 118000 },
            { name: 'Week 6', value: 120000 },
          ],
          monthly: [
            { name: 'Jan', value: 95000 },
            { name: 'Feb', value: 100000 },
            { name: 'Mar', value: 110000 },
            { name: 'Apr', value: 115000 },
            { name: 'May', value: 120000 },
          ],
        },
        mapData: null
      },
      total_commercial: {
        value: 224000,
        change: -37.8,
        period: 'week',
        trend: [180000, 190000, 200000, 210000, 220000, 224000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 180000 },
            { name: 'Week 2', value: 190000 },
            { name: 'Week 3', value: 200000 },
            { name: 'Week 4', value: 210000 },
            { name: 'Week 5', value: 220000 },
            { name: 'Week 6', value: 224000 },
          ],
          monthly: [
            { name: 'Jan', value: 170000 },
            { name: 'Feb', value: 185000 },
            { name: 'Mar', value: 200000 },
            { name: 'Apr', value: 215000 },
            { name: 'May', value: 224000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Commercial Area 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Commercial Area 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
            { type: "Feature", properties: { Name: "Commercial Area 3" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
          ]
        }
      },
      total_bins: {
        value: 79000,
        change: 37.8,
        period: 'week',
        trend: [65000, 68000, 71000, 74000, 77000, 79000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 65000 },
            { name: 'Week 2', value: 68000 },
            { name: 'Week 3', value: 71000 },
            { name: 'Week 4', value: 74000 },
            { name: 'Week 5', value: 77000 },
            { name: 'Week 6', value: 79000 },
          ],
          monthly: [
            { name: 'Jan', value: 60000 },
            { name: 'Feb', value: 65000 },
            { name: 'Mar', value: 70000 },
            { name: 'Apr', value: 75000 },
            { name: 'May', value: 79000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 143000,
        change: 37.8,
        period: 'month',
        trend: [120000, 125000, 130000, 135000, 140000, 143000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 135000 },
            { name: 'Week 2', value: 137000 },
            { name: 'Week 3', value: 139000 },
            { name: 'Week 4', value: 141000 },
            { name: 'Week 5', value: 142000 },
            { name: 'Week 6', value: 143000 },
          ],
          monthly: [
            { name: 'Jan', value: 120000 },
            { name: 'Feb', value: 125000 },
            { name: 'Mar', value: 130000 },
            { name: 'Apr', value: 135000 },
            { name: 'May', value: 143000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
            { type: "Feature", properties: { Name: "Sheep Hut 3" }, geometry: { type: "Point", coordinates: [56.333831166088203, 25.126241500418001] } },
          ]
        }
      },
      total_lands: {
        value: 302,
        change: -37.8,
        period: 'week',
        trend: [280, 285, 290, 295, 300, 302],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 280 },
            { name: 'Week 2', value: 285 },
            { name: 'Week 3', value: 290 },
            { name: 'Week 4', value: 295 },
            { name: 'Week 5', value: 300 },
            { name: 'Week 6', value: 302 },
          ],
          monthly: [
            { name: 'Jan', value: 270 },
            { name: 'Feb', value: 280 },
            { name: 'Mar', value: 290 },
            { name: 'Apr', value: 295 },
            { name: 'May', value: 302 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 120000,
        change: 37.8,
        period: 'week',
        trend: [100000, 105000, 110000, 115000, 118000, 120000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 100000 },
            { name: 'Week 2', value: 105000 },
            { name: 'Week 3', value: 110000 },
            { name: 'Week 4', value: 115000 },
            { name: 'Week 5', value: 118000 },
            { name: 'Week 6', value: 120000 },
          ],
          monthly: [
            { name: 'Jan', value: 95000 },
            { name: 'Feb', value: 100000 },
            { name: 'Mar', value: 110000 },
            { name: 'Apr', value: 115000 },
            { name: 'May', value: 120000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Rental Property 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Rental Property 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
            { type: "Feature", properties: { Name: "Rental Property 3" }, geometry: { type: "Point", coordinates: [56.333375545270997, 25.126326698833299] } },
          ]
        }
      },
    },
    'Al Ittihad': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
    'Al Faseel': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
    'Afarah': {
      // Similar structure as 'Al Ittihad', but with different values
    },
    'Al Abadilah': {
      // Similar structure as 'Al Ittihad', but with different values
    },
    'Adgat': {
      // Similar structure as 'Al Ittihad', but with different values
    },
    'Akamiya': {
      // Similar structure as 'Al Ittihad', but with different values
    },
  },
  'Real Estate': {
   'All Districts': {
      total_commercial: {
        value: 224000,
        change: -37.8,
        period: 'week',
        trend: [180000, 190000, 200000, 210000, 220000, 224000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 180000 },
            { name: 'Week 2', value: 190000 },
            { name: 'Week 3', value: 200000 },
            { name: 'Week 4', value: 210000 },
            { name: 'Week 5', value: 220000 },
            { name: 'Week 6', value: 224000 },
          ],
          monthly: [
            { name: 'Jan', value: 170000 },
            { name: 'Feb', value: 185000 },
            { name: 'Mar', value: 200000 },
            { name: 'Apr', value: 215000 },
            { name: 'May', value: 224000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Commercial Area 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Commercial Area 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
            { type: "Feature", properties: { Name: "Commercial Area 3" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
          ]
        }
      },
      total_bins: {
        value: 79000,
        change: 37.8,
        period: 'week',
        trend: [65000, 68000, 71000, 74000, 77000, 79000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 65000 },
            { name: 'Week 2', value: 68000 },
            { name: 'Week 3', value: 71000 },
            { name: 'Week 4', value: 74000 },
            { name: 'Week 5', value: 77000 },
            { name: 'Week 6', value: 79000 },
          ],
          monthly: [
            { name: 'Jan', value: 60000 },
            { name: 'Feb', value: 65000 },
            { name: 'Mar', value: 70000 },
            { name: 'Apr', value: 75000 },
            { name: 'May', value: 79000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 143000,
        change: 37.8,
        period: 'month',
        trend: [120000, 125000, 130000, 135000, 140000, 143000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 135000 },
            { name: 'Week 2', value: 137000 },
            { name: 'Week 3', value: 139000 },
            { name: 'Week 4', value: 141000 },
            { name: 'Week 5', value: 142000 },
            { name: 'Week 6', value: 143000 },
          ],
          monthly: [
            { name: 'Jan', value: 120000 },
            { name: 'Feb', value: 125000 },
            { name: 'Mar', value: 130000 },
            { name: 'Apr', value: 135000 },
            { name: 'May', value: 143000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
            { type: "Feature", properties: { Name: "Sheep Hut 3" }, geometry: { type: "Point", coordinates: [56.333831166088203, 25.126241500418001] } },
          ]
        }
      },
      total_lands: {
        value: 302,
        change: -37.8,
        period: 'week',
        trend: [280, 285, 290, 295, 300, 302],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 280 },
            { name: 'Week 2', value: 285 },
            { name: 'Week 3', value: 290 },
            { name: 'Week 4', value: 295 },
            { name: 'Week 5', value: 300 },
            { name: 'Week 6', value: 302 },
          ],
          monthly: [
            { name: 'Jan', value: 270 },
            { name: 'Feb', value: 280 },
            { name: 'Mar', value: 290 },
            { name: 'Apr', value: 295 },
            { name: 'May', value: 302 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 120000,
        change: 37.8,
        period: 'week',
        trend: [100000, 105000, 110000, 115000, 118000, 120000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 100000 },
            { name: 'Week 2', value: 105000 },
            { name: 'Week 3', value: 110000 },
            { name: 'Week 4', value: 115000 },
            { name: 'Week 5', value: 118000 },
            { name: 'Week 6', value: 120000 },
          ],
          monthly: [
            { name: 'Jan', value: 95000 },
            { name: 'Feb', value: 100000 },
            { name: 'Mar', value: 110000 },
            { name: 'Apr', value: 115000 },
            { name: 'May', value: 120000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Rental Property 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Rental Property 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
            { type: "Feature", properties: { Name: "Rental Property 3" }, geometry: { type: "Point", coordinates: [56.333375545270997, 25.126326698833299] } },
          ]
        }
      },
    },
    'Al Ittihad': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
    'Al Faseel': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
  },
  'Construction': {
    'All Districts': {
      total_commercial: {
        value: 224000,
        change: -37.8,
        period: 'week',
        trend: [180000, 190000, 200000, 210000, 220000, 224000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 180000 },
            { name: 'Week 2', value: 190000 },
            { name: 'Week 3', value: 200000 },
            { name: 'Week 4', value: 210000 },
            { name: 'Week 5', value: 220000 },
            { name: 'Week 6', value: 224000 },
          ],
          monthly: [
            { name: 'Jan', value: 170000 },
            { name: 'Feb', value: 185000 },
            { name: 'Mar', value: 200000 },
            { name: 'Apr', value: 215000 },
            { name: 'May', value: 224000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Commercial Area 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Commercial Area 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
            { type: "Feature", properties: { Name: "Commercial Area 3" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
          ]
        }
      },
      total_bins: {
        value: 79000,
        change: 37.8,
        period: 'week',
        trend: [65000, 68000, 71000, 74000, 77000, 79000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 65000 },
            { name: 'Week 2', value: 68000 },
            { name: 'Week 3', value: 71000 },
            { name: 'Week 4', value: 74000 },
            { name: 'Week 5', value: 77000 },
            { name: 'Week 6', value: 79000 },
          ],
          monthly: [
            { name: 'Jan', value: 60000 },
            { name: 'Feb', value: 65000 },
            { name: 'Mar', value: 70000 },
            { name: 'Apr', value: 75000 },
            { name: 'May', value: 79000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 143000,
        change: 37.8,
        period: 'month',
        trend: [120000, 125000, 130000, 135000, 140000, 143000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 135000 },
            { name: 'Week 2', value: 137000 },
            { name: 'Week 3', value: 139000 },
            { name: 'Week 4', value: 141000 },
            { name: 'Week 5', value: 142000 },
            { name: 'Week 6', value: 143000 },
          ],
          monthly: [
            { name: 'Jan', value: 120000 },
            { name: 'Feb', value: 125000 },
            { name: 'Mar', value: 130000 },
            { name: 'Apr', value: 135000 },
            { name: 'May', value: 143000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
            { type: "Feature", properties: { Name: "Sheep Hut 3" }, geometry: { type: "Point", coordinates: [56.333831166088203, 25.126241500418001] } },
          ]
        }
      },
      total_lands: {
        value: 302,
        change: -37.8,
        period: 'week',
        trend: [280, 285, 290, 295, 300, 302],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 280 },
            { name: 'Week 2', value: 285 },
            { name: 'Week 3', value: 290 },
            { name: 'Week 4', value: 295 },
            { name: 'Week 5', value: 300 },
            { name: 'Week 6', value: 302 },
          ],
          monthly: [
            { name: 'Jan', value: 270 },
            { name: 'Feb', value: 280 },
            { name: 'Mar', value: 290 },
            { name: 'Apr', value: 295 },
            { name: 'May', value: 302 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 120000,
        change: 37.8,
        period: 'week',
        trend: [100000, 105000, 110000, 115000, 118000, 120000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 100000 },
            { name: 'Week 2', value: 105000 },
            { name: 'Week 3', value: 110000 },
            { name: 'Week 4', value: 115000 },
            { name: 'Week 5', value: 118000 },
            { name: 'Week 6', value: 120000 },
          ],
          monthly: [
            { name: 'Jan', value: 95000 },
            { name: 'Feb', value: 100000 },
            { name: 'Mar', value: 110000 },
            { name: 'Apr', value: 115000 },
            { name: 'May', value: 120000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Rental Property 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Rental Property 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
            { type: "Feature", properties: { Name: "Rental Property 3" }, geometry: { type: "Point", coordinates: [56.333375545270997, 25.126326698833299] } },
          ]
        }
      },
    },
    'Al Ittihad': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
    'Al Faseel': {
      total_commercial: {
        value: 45000,
        change: 5.2,
        period: 'week',
        trend: [40000, 41000, 42000, 43000, 44000, 45000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 40000 },
            { name: 'Week 2', value: 41000 },
            { name: 'Week 3', value: 42000 },
            { name: 'Week 4', value: 43000 },
            { name: 'Week 5', value: 44000 },
            { name: 'Week 6', value: 45000 },
          ],
          monthly: [
            { name: 'Jan', value: 38000 },
            { name: 'Feb', value: 40000 },
            { name: 'Mar', value: 42000 },
            { name: 'Apr', value: 44000 },
            { name: 'May', value: 45000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_commercial_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 1" }, geometry: { type: "Point", coordinates: [56.3335863133399, 25.126048016404901] } },
            { type: "Feature", properties: { Name: "Al Ittihad Commercial 2" }, geometry: { type: "Point", coordinates: [56.333602024294699, 25.126187475421599] } },
          ]
        }
      },
      total_bins: {
        value: 15000,
        change: 3.4,
        period: 'week',
        trend: [14000, 14200, 14400, 14600, 14800, 15000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 14000 },
            { name: 'Week 2', value: 14200 },
            { name: 'Week 3', value: 14400 },
            { name: 'Week 4', value: 14600 },
            { name: 'Week 5', value: 14800 },
            { name: 'Week 6', value: 15000 },
          ],
          monthly: [
            { name: 'Jan', value: 13500 },
            { name: 'Feb', value: 14000 },
            { name: 'Mar', value: 14500 },
            { name: 'Apr', value: 14800 },
            { name: 'May', value: 15000 },
          ],
        },
        mapData: null
      },
      total_sheep_huts: {
        value: 28000,
        change: 2.1,
        period: 'month',
        trend: [26000, 26500, 27000, 27500, 28000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 27000 },
            { name: 'Week 2', value: 27200 },
            { name: 'Week 3', value: 27400 },
            { name: 'Week 4', value: 27600 },
            { name: 'Week 5', value: 27800 },
            { name: 'Week 6', value: 28000 },
          ],
          monthly: [
            { name: 'Jan', value: 26000 },
            { name: 'Feb', value: 26500 },
            { name: 'Mar', value: 27000 },
            { name: 'Apr', value: 27500 },
            { name: 'May', value: 28000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_sheep_huts_al_ittihad",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 1" }, geometry: { type: "Point", coordinates: [56.333427848346801, 25.1262019761141] } },
            { type: "Feature", properties: { Name: "Al Ittihad Sheep Hut 2" }, geometry: { type: "Point", coordinates: [56.3339398988116, 25.126304025785199] } },
          ]
        }
      },
      total_lands: {
        value: 60,
        change: -1.6,
        period: 'week',
        trend: [62, 61, 60, 60, 60, 60],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 62 },
            { name: 'Week 2', value: 61 },
            { name: 'Week 3', value: 60 },
            { name: 'Week 4', value: 60 },
            { name: 'Week 5', value: 60 },
            { name: 'Week 6', value: 60 },
          ],
          monthly: [
            { name: 'Jan', value: 63 },
            { name: 'Feb', value: 62 },
            { name: 'Mar', value: 61 },
            { name: 'Apr', value: 60 },
            { name: 'May', value: 60 },
          ],
        },
        mapData: null
      },
      total_rental: {
        value: 25000,
        change: 4.2,
        period: 'week',
        trend: [22000, 23000, 24000, 24500, 24800, 25000],
        graphs: {
          weekly: [
            { name: 'Week 1', value: 22000 },
            { name: 'Week 2', value: 23000 },
            { name: 'Week 3', value: 24000 },
            { name: 'Week 4', value: 24500 },
            { name: 'Week 5', value: 24800 },
            { name: 'Week 6', value: 25000 },
          ],
          monthly: [
            { name: 'Jan', value: 21000 },
            { name: 'Feb', value: 22000 },
            { name: 'Mar', value: 23000 },
            { name: 'Apr', value: 24000 },
            { name: 'May', value: 25000 },
          ],
        },
        mapData: {
          type: "FeatureCollection",
          name: "total_rental_al_ittihad",
          crs: { type: "name", properties: {name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features: [
            { type: "Feature", properties: { Name: "Al Ittihad Rental 1" }, geometry: { type: "Point", coordinates: [56.333210673235698, 25.126315341354498] } },
            { type: "Feature", properties: { Name: "Al Ittihad Rental 2" }, geometry: { type: "Point", coordinates: [56.333425249956903, 25.126327746571199] } },
          ]
        }
      },
    },
  },
  'Economy': {
    'All Districts': {
      // Similar structure as 'All Sectors' > 'All Districts', but with focus on economy metrics
    },
    'Al Ittihad': {
      // Similar structure as 'All Sectors' > 'Al Ittihad', but with focus on economy metrics
    },
    // ... other districts
  },
  'Health & Hygiene': {
    'All Districts': {
      // Similar structure as 'All Sectors' > 'All Districts', but with focus on health and hygiene metrics
    },
    'Al Ittihad': {
      // Similar structure as 'All Sectors' > 'Al Ittihad', but with focus on health and hygiene metrics
    },
    // ... other districts
  },
  'Community & Engagement': {
    'All Districts': {
      // Similar structure as 'All Sectors' > 'All Districts', but with focus on community and engagement metrics
    },
    'Al Ittihad': {
      // Similar structure as 'All Sectors' > 'Al Ittihad', but with focus on community and engagement metrics
    },
    // ... other districts
  },
}