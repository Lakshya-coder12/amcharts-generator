export const chartExamples = [
  // 1. Basic Line Chart
  {
    query: "Create a simple line chart with 5 data points showing sales over 5 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "value": 1000},
          {"date": 1704153600000, "value": 1500},
          {"date": 1704240000000, "value": 2000},
          {"date": 1704326400000, "value": 1800},
          {"date": 1704412800000, "value": 2500}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "value"
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 2. Temperature Chart (20 days)
  {
    query: "Create a line chart showing temperature data over 20 days from May 1-20, 2022. The temperature values range from 81 to 100 degrees Fahrenheit",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1652425200000, "value": 92},
          {"date": 1652511600000, "value": 95},
          {"date": 1652598000000, "value": 100},
          {"date": 1652684400000, "value": 100},
          {"date": 1652770800000, "value": 96},
          {"date": 1652857200000, "value": 97},
          {"date": 1652943600000, "value": 94},
          {"date": 1653030000000, "value": 89},
          {"date": 1653116400000, "value": 89},
          {"date": 1653202800000, "value": 87},
          {"date": 1653289200000, "value": 84},
          {"date": 1653375600000, "value": 81},
          {"date": 1653462000000, "value": 85},
          {"date": 1653548400000, "value": 89},
          {"date": 1653634800000, "value": 86},
          {"date": 1653721200000, "value": 90},
          {"date": 1653807600000, "value": 93},
          {"date": 1653894000000, "value": 94},
          {"date": 1653980400000, "value": 94},
          {"date": 1654066800000, "value": 96}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Temperature",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "value",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}°F"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 3. Column Chart - 3 Months
  {
    query: "Create a column chart comparing sales for 3 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"month": "January", "sales": 5000},
          {"month": "February", "sales": 7000},
          {"month": "March", "sales": 6500}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Sales",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "sales",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 4. Stock Price Chart
  {
    query: "Create a line chart for stock prices over 5 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "price": 100},
          {"date": 1704153600000, "price": 115},
          {"date": 1704240000000, "price": 125},
          {"date": 1704326400000, "price": 120},
          {"date": 1704412800000, "price": 150}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "cursor": {"type": "XYCursor", "settings": {"behavior": "zoomX"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Stock Price",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "price",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 5. Multi-Region Sales
  {
    query: "Create a column chart comparing sales for North, South, East, West regions across 3 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"month": "January", "north": 25000, "south": 30000, "east": 20000, "west": 28000},
          {"month": "February", "north": 30000, "south": 35000, "east": 25000, "west": 32000},
          {"month": "March", "north": 35000, "south": 40000, "east": 30000, "west": 37000}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "North",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "north",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          },
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "South",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "south",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          },
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "East",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "east",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          },
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "West",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "west",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 6. User Growth Area Chart
  {
    query: "Create an area chart showing user growth over 12 months starting from 1000 users to 50000 users",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "users": 1000},
          {"date": 1706745600000, "users": 5000},
          {"date": 1709424000000, "users": 10000},
          {"date": 1712016000000, "users": 15000},
          {"date": 1714694400000, "users": 20000},
          {"date": 1717286400000, "users": 25000},
          {"date": 1719964800000, "users": 30000},
          {"date": 1722643200000, "users": 35000},
          {"date": 1725235200000, "users": 40000},
          {"date": 1727913600000, "users": 43000},
          {"date": 1730592000000, "users": 47000},
          {"date": 1733184000000, "users": 50000}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "month", "count": 1},
            "maxDeviation": 0.3,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "AreaSeries",
            "settings": {
              "name": "User Growth",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "users",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY} users"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 7. Website Traffic - Weekly
  {
    query: "Create a line chart showing website traffic over 8 weeks",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "visitors": 5000},
          {"date": 1704672000000, "visitors": 6200},
          {"date": 1705276800000, "visitors": 7500},
          {"date": 1705881600000, "visitors": 8900},
          {"date": 1706486400000, "visitors": 9500},
          {"date": 1707091200000, "visitors": 11000},
          {"date": 1707696000000, "visitors": 12500},
          {"date": 1708300800000, "visitors": 14000}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "week", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Visitors",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "visitors",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY} visitors"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 8. Quarterly Revenue
  {
    query: "Create a column chart showing quarterly revenue for 2024",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"quarter": "Q1 2024", "revenue": 100000},
          {"quarter": "Q2 2024", "revenue": 150000},
          {"quarter": "Q3 2024", "revenue": 180000},
          {"quarter": "Q4 2024", "revenue": 220000}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Revenue",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "quarter",
              "valueYField": "revenue",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 9. Product Sales Comparison
  {
    query: "Create a chart comparing sales of Product A and Product B over 6 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"month": "Jan", "productA": 10000, "productB": 8000},
          {"month": "Feb", "productA": 12000, "productB": 9500},
          {"month": "Mar", "productA": 15000, "productB": 11000},
          {"month": "Apr", "productA": 18000, "productB": 13500},
          {"month": "May", "productA": 20000, "productB": 16000},
          {"month": "Jun", "productA": 22000, "productB": 18500}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Product A",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "productA",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX} - A: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          },
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Product B",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "productB",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX} - B: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 10. Daily Active Users
  {
    query: "Create a line chart tracking daily active users over 10 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "activeUsers": 5000},
          {"date": 1704153600000, "activeUsers": 5500},
          {"date": 1704240000000, "activeUsers": 6200},
          {"date": 1704326400000, "activeUsers": 6800},
          {"date": 1704412800000, "activeUsers": 7200},
          {"date": 1704499200000, "activeUsers": 7500},
          {"date": 1704585600000, "activeUsers": 8000},
          {"date": 1704672000000, "activeUsers": 8500},
          {"date": 1704758400000, "activeUsers": 8800},
          {"date": 1704844800000, "activeUsers": 9200}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "cursor": {"type": "XYCursor", "settings": {"behavior": "zoomX"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Active Users",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "activeUsers",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY} users"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 11. Conversion Rate
  {
    query: "Create a line chart showing conversion rate trends over 7 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "rate": 2.5},
          {"date": 1704153600000, "rate": 2.8},
          {"date": 1704240000000, "rate": 3.2},
          {"date": 1704326400000, "rate": 3.1},
          {"date": 1704412800000, "rate": 3.5},
          {"date": 1704499200000, "rate": 3.8},
          {"date": 1704585600000, "rate": 4.1}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Conversion Rate",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "rate",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 12. Customer Retention
  {
    query: "Create a column chart showing customer retention percentage by month",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"month": "January", "retention": 85},
          {"month": "February", "retention": 87},
          {"month": "March", "retention": 89},
          {"month": "April", "retention": 88},
          {"month": "May", "retention": 91}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Retention",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "month",
              "valueYField": "retention",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 13. App Downloads
  {
    query: "Create an area chart showing app downloads over 6 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "downloads": 10000},
          {"date": 1706745600000, "downloads": 25000},
          {"date": 1709424000000, "downloads": 45000},
          {"date": 1712016000000, "downloads": 70000},
          {"date": 1714694400000, "downloads": 100000},
          {"date": 1717286400000, "downloads": 135000}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "month", "count": 1},
            "maxDeviation": 0.3,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "AreaSeries",
            "settings": {
              "name": "Downloads",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "downloads",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY} downloads"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 14. Error Rate Monitoring
  {
    query: "Create a line chart monitoring error rate over 15 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "errors": 0.5},
          {"date": 1704153600000, "errors": 0.6},
          {"date": 1704240000000, "errors": 0.4},
          {"date": 1704326400000, "errors": 0.7},
          {"date": 1704412800000, "errors": 0.3},
          {"date": 1704499200000, "errors": 0.5},
          {"date": 1704585600000, "errors": 0.2},
          {"date": 1704672000000, "errors": 0.4},
          {"date": 1704758400000, "errors": 0.1},
          {"date": 1704844800000, "errors": 0.3},
          {"date": 1704931200000, "errors": 0.2},
          {"date": 1705017600000, "errors": 0.5},
          {"date": 1705104000000, "errors": 0.4},
          {"date": 1705190400000, "errors": 0.3},
          {"date": 1705276800000, "errors": 0.2}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Error Rate",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "errors",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 15. Response Time
  {
    query: "Create a line chart showing API response time over 7 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "responseTime": 150},
          {"date": 1704153600000, "responseTime": 140},
          {"date": 1704240000000, "responseTime": 160},
          {"date": 1704326400000, "responseTime": 145},
          {"date": 1704412800000, "responseTime": 155},
          {"date": 1704499200000, "responseTime": 135},
          {"date": 1704585600000, "responseTime": 150}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Response Time",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "responseTime",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}ms"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 16. Page Load Times
  {
    query: "Create a column chart comparing page load times across different pages",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"page": "Homepage", "loadTime": 1.2},
          {"page": "Products", "loadTime": 1.8},
          {"page": "Checkout", "loadTime": 2.1},
          {"page": "Confirmation", "loadTime": 0.9}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Load Time",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "page",
              "valueYField": "loadTime",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}s"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 17. Monthly Revenue Trend
  {
    query: "Create a line chart showing revenue trend over 12 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "revenue": 50000},
          {"date": 1706745600000, "revenue": 55000},
          {"date": 1709424000000, "revenue": 62000},
          {"date": 1712016000000, "revenue": 71000},
          {"date": 1714694400000, "revenue": 75000},
          {"date": 1717286400000, "revenue": 82000},
          {"date": 1719964800000, "revenue": 88000},
          {"date": 1722643200000, "revenue": 95000},
          {"date": 1725235200000, "revenue": 102000},
          {"date": 1727913600000, "revenue": 108000},
          {"date": 1730592000000, "revenue": 115000},
          {"date": 1733184000000, "revenue": 120000}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "month", "count": 1},
            "maxDeviation": 0.3,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Revenue",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "revenue",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 18. Customer Acquisition Cost
  {
    query: "Create a column chart showing customer acquisition cost by channel",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"channel": "Organic", "cost": 15},
          {"channel": "Paid Search", "cost": 45},
          {"channel": "Social Media", "cost": 35},
          {"channel": "Referral", "cost": 10},
          {"channel": "Email", "cost": 8}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "CAC",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "channel",
              "valueYField": "cost",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: ${valueY}"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 19. Server Uptime
  {
    query: "Create a line chart tracking server uptime percentage over 30 days",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "uptime": 99.9},
          {"date": 1704153600000, "uptime": 99.8},
          {"date": 1704240000000, "uptime": 99.95},
          {"date": 1704326400000, "uptime": 99.7},
          {"date": 1704412800000, "uptime": 99.85},
          {"date": 1704499200000, "uptime": 99.9},
          {"date": 1704585600000, "uptime": 99.92},
          {"date": 1704672000000, "uptime": 99.88},
          {"date": 1704758400000, "uptime": 99.95},
          {"date": 1704844800000, "uptime": 99.9}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 3},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 0.5,
            "min": 99.5,
            "max": 100,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Uptime",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "uptime",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 20. Market Share Comparison
  {
    query: "Create a column chart comparing market share of competitors",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"company": "Company A", "share": 28},
          {"company": "Company B", "share": 25},
          {"company": "Company C", "share": 22},
          {"company": "Company D", "share": 15},
          {"company": "Others", "share": 10}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Market Share",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "company",
              "valueYField": "share",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 21. Support Tickets
  {
    query: "Create a line chart showing daily support ticket volume over 2 weeks",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "tickets": 45},
          {"date": 1704153600000, "tickets": 52},
          {"date": 1704240000000, "tickets": 38},
          {"date": 1704326400000, "tickets": 61},
          {"date": 1704412800000, "tickets": 55},
          {"date": 1704499200000, "tickets": 42},
          {"date": 1704585600000, "tickets": 48},
          {"date": 1704672000000, "tickets": 65},
          {"date": 1704758400000, "tickets": 50},
          {"date": 1704844800000, "tickets": 40},
          {"date": 1704931200000, "tickets": 35},
          {"date": 1705017600000, "tickets": 43},
          {"date": 1705104000000, "tickets": 58},
          {"date": 1705190400000, "tickets": 52}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "day", "count": 1},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "Tickets",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "tickets",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY} tickets"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 22. Email Campaign Performance
  {
    query: "Create a column chart showing email campaign metrics",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"campaign": "Campaign 1", "openRate": 22, "clickRate": 3.5, "conversionRate": 1.2},
          {"campaign": "Campaign 2", "openRate": 28, "clickRate": 4.2, "conversionRate": 1.8},
          {"campaign": "Campaign 3", "openRate": 25, "clickRate": 3.8, "conversionRate": 1.5},
          {"campaign": "Campaign 4", "openRate": 31, "clickRate": 5.1, "conversionRate": 2.1}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Open Rate",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "campaign",
              "valueYField": "openRate",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          },
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Click Rate",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "campaign",
              "valueYField": "clickRate",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 23. CPU Usage Monitoring
  {
    query: "Create a line chart monitoring CPU usage over 24 hours",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "cpu": 15},
          {"date": 1704110400000, "cpu": 18},
          {"date": 1704153600000, "cpu": 22},
          {"date": 1704196800000, "cpu": 35},
          {"date": 1704240000000, "cpu": 45},
          {"date": 1704283200000, "cpu": 58},
          {"date": 1704326400000, "cpu": 65},
          {"date": 1704369600000, "cpu": 72},
          {"date": 1704412800000, "cpu": 68},
          {"date": 1704456000000, "cpu": 55},
          {"date": 1704499200000, "cpu": 42},
          {"date": 1704542400000, "cpu": 28},
          {"date": 1704585600000, "cpu": 20},
          {"date": 1704628800000, "cpu": 16}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "hour", "count": 2},
            "maxDeviation": 0.5,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "max": 100,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX",
        "scrollbarX": {"type": "Scrollbar", "settings": {"orientation": "horizontal"}}
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "LineSeries",
            "settings": {
              "name": "CPU Usage",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "cpu",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}%"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 24. Memory Allocation
  {
    query: "Create a column chart showing memory usage by process",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"process": "Chrome", "memory": 450},
          {"process": "Node.js", "memory": 280},
          {"process": "Docker", "memory": 320},
          {"process": "VS Code", "memory": 180},
          {"process": "Others", "memory": 270}
        ],
        "xAxis": {
          "type": "CategoryAxis",
          "settings": {"renderer": {"type": "AxisRendererX"}}
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 1,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomY"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "ColumnSeries",
            "settings": {
              "name": "Memory",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "categoryXField": "process",
              "valueYField": "memory",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{categoryX}: {valueY}MB"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  },

  // 25. Customer Satisfaction Score
  {
    query: "Create an area chart showing customer satisfaction score trend over 6 months",
    config: {
      "type": "XYChart",
      "refs": {
        "data": [
          {"date": 1704067200000, "score": 7.2},
          {"date": 1706745600000, "score": 7.5},
          {"date": 1709424000000, "score": 7.8},
          {"date": 1712016000000, "score": 8.1},
          {"date": 1714694400000, "score": 8.3},
          {"date": 1717286400000, "score": 8.6}
        ],
        "xAxis": {
          "type": "DateAxis",
          "settings": {
            "baseInterval": {"timeUnit": "month", "count": 1},
            "maxDeviation": 0.3,
            "renderer": {"type": "AxisRendererX"}
          }
        },
        "yAxis": {
          "type": "ValueAxis",
          "settings": {
            "maxDeviation": 0.5,
            "min": 6,
            "max": 10,
            "renderer": {"type": "AxisRendererY"}
          }
        }
      },
      "settings": {
        "panX": false,
        "panY": false,
        "wheelY": "zoomX"
      },
      "properties": {
        "xAxes": ["#xAxis"],
        "yAxes": ["#yAxis"],
        "series": [
          {
            "type": "AreaSeries",
            "settings": {
              "name": "CSAT Score",
              "xAxis": "#xAxis",
              "yAxis": "#yAxis",
              "valueXField": "date",
              "valueYField": "score",
              "tooltip": {"type": "Tooltip", "settings": {"labelText": "{valueX}: {valueY}/10"}}
            },
            "properties": {"data": "#data"}
          }
        ]
      }
    }
  }
];
