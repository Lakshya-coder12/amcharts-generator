/**
* amCharts v5 XYChart JSON Serialization Examples
 * Use these as reference configurations for LLM generation
 * Source: https://www.amcharts.com/docs/v5/concepts/serializing/
 */

// ============================================================================
// EXAMPLE 1: Basic XY Chart with Pan and Zoom Controls
// ============================================================================
export const EXAMPLE_BASIC_XYCHART = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomY",
    layout: "vertical"
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    }
  }
};

// ============================================================================
// EXAMPLE 2: XY Chart with Scrollbars
// ============================================================================
export const EXAMPLE_XYCHART_WITH_SCROLLBARS = {
  type: "XYChart",
  settings: {
    panX: true,
    panY: true,
    scrollbarX: "#scrollX",
    scrollbarY: "#scrollY"
  },
  refs: {
    scrollX: {
      type: "Scrollbar",
      settings: {
        orientation: "horizontal"
      }
    },
    scrollY: {
      type: "Scrollbar",
      settings: {
        orientation: "vertical"
      }
    },
    xAxis: {
      type: "DateAxis",
      settings: {
        renderer: "#xRenderer",
        baseInterval: {
          timeUnit: "day",
          count: 1
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer",
        min: 0
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    }
  }
};

// ============================================================================
// EXAMPLE 3: XY Chart with Line Series
// ============================================================================
export const EXAMPLE_XYCHART_LINE_SERIES = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    wheelX: "zoomX",
    wheelY: "zoomY"
  },
  refs: {
    xAxis: {
      type: "DateAxis",
      settings: {
        renderer: "#xRenderer",
        baseInterval: {
          timeUnit: "day",
          count: 1
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Sales",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date"
      }
    },
    data: [
      { date: 1652425200000, value: 92 },
      { date: 1652511600000, value: 95 },
      { date: 1652598000000, value: 100 },
      { date: 1652684400000, value: 100 }
    ]
  }
};

// ============================================================================
// EXAMPLE 4: XY Chart with Column Series
// ============================================================================
export const EXAMPLE_XYCHART_COLUMN_SERIES = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "CategoryAxis",
      settings: {
        renderer: "#xRenderer",
        tooltip: {
          type: "Tooltip"
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        min: 0,
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "ColumnSeries",
      settings: {
        name: "Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        categoryXField: "category"
      }
    }
  }
};

// ============================================================================
// EXAMPLE 5: XY Chart with Legend
// ============================================================================
export const EXAMPLE_XYCHART_WITH_LEGEND = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    legend: {
      type: "Legend",
      settings: {}
    }
  },
  children: [
    {
      type: "Legend",
      settings: {}
    }
  ]
};

// ============================================================================
// EXAMPLE 6: XY Chart with Custom Stroke and Fill on Series
// ============================================================================
export const EXAMPLE_XYCHART_CUSTOM_STYLING = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date"
      },
      properties: {
        strokes: {
          properties: {
            template: {
              settings: {
                strokeWidth: 2,
                strokeDasharray: [3]
              }
            }
          }
        },
        fills: {
          properties: {
            template: {
              settings: {
                fillOpacity: 0.5,
                fillGradient: {
                  type: "LinearGradient",
                  settings: {
                    stops: [
                      { opacity: 1 },
                      { opacity: 0.5 }
                    ],
                    rotation: 0
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// ============================================================================
// EXAMPLE 7: XY Chart with Tooltip
// ============================================================================
export const EXAMPLE_XYCHART_WITH_TOOLTIP = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    cursor: {
      type: "XYCursor"
    }
  },
  refs: {
    xAxis: {
      type: "DateAxis",
      settings: {
        renderer: "#xRenderer",
        baseInterval: {
          timeUnit: "day",
          count: 1
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date",
        tooltip: {
          type: "Tooltip",
          settings: {
            labelText: "{valueY}"
          }
        }
      }
    }
  }
};

// ============================================================================
// EXAMPLE 8: XY Chart with Multiple Series
// ============================================================================
export const EXAMPLE_XYCHART_MULTIPLE_SERIES = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    wheelX: "zoomX",
    wheelY: "zoomY"
  },
  refs: {
    xAxis: {
      type: "DateAxis",
      settings: {
        renderer: "#xRenderer",
        baseInterval: {
          timeUnit: "day",
          count: 1
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer",
        min: 0
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series1: {
      type: "LineSeries",
      settings: {
        name: "Series 1",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date"
      }
    },
    series2: {
      type: "LineSeries",
      settings: {
        name: "Series 2",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value2",
        valueXField: "date"
      }
    }
  }
};

// ============================================================================
// EXAMPLE 9: XY Chart with Bullets
// ============================================================================
export const EXAMPLE_XYCHART_WITH_BULLETS = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date"
      },
      properties: {
        bullets: {
          properties: {
            template: {
              type: "CircleBullet",
              settings: {
                radius: 5
              }
            }
          }
        }
      }
    }
  }
};

// ============================================================================
// EXAMPLE 10: XY Chart with Title and Child Elements
// ============================================================================
export const EXAMPLE_XYCHART_WITH_TITLE = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    }
  },
  children: [
    {
      index: 0,
      type: "Label",
      settings: {
        text: "Chart Title",
        fontSize: 20,
        fontWeight: "bold"
      }
    },
    {
      type: "Label",
      settings: {
        text: "Chart subtitle or description"
      }
    }
  ]
};

// ============================================================================
// EXAMPLE 11: XY Chart with Percent Values
// ============================================================================
export const EXAMPLE_XYCHART_PERCENT_VALUES = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    wheelX: "none",
    wheelY: "none"
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer",
        min: 0,
        max: 100
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer",
        min: 0,
        max: 100
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Percentage Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "category",
        strokeOpacity: 0.7
      }
    }
  }
};

// ============================================================================
// EXAMPLE 12: XY Chart with Category Axis
// ============================================================================
export const EXAMPLE_XYCHART_CATEGORY_AXIS = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false
  },
  refs: {
    xAxis: {
      type: "CategoryAxis",
      settings: {
        renderer: "#xRenderer",
        tooltip: {
          type: "Tooltip"
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer",
        min: 0
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "ColumnSeries",
      settings: {
        name: "Sales by Category",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        categoryXField: "category"
      }
    }
  }
};

// ============================================================================
// EXAMPLE 13: XY Chart with Range Scrollbar
// ============================================================================
export const EXAMPLE_XYCHART_RANGE_SCROLLBAR = {
  type: "XYChart",
  settings: {
    panX: true,
    panY: false,
    scrollbarX: "#scrollX"
  },
  refs: {
    scrollX: {
      type: "Scrollbar",
      settings: {
        orientation: "horizontal",
        behavior: "zoomX"
      }
    },
    xAxis: {
      type: "DateAxis",
      settings: {
        renderer: "#xRenderer",
        baseInterval: {
          timeUnit: "day",
          count: 1
        }
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    }
  }
};

// ============================================================================
// EXAMPLE 14: XY Chart with Color Settings
// ============================================================================
export const EXAMPLE_XYCHART_WITH_COLORS = {
  type: "XYChart",
  settings: {
    panX: false,
    panY: false,
    colors: {
      type: "ColorSet"
    }
  },
  refs: {
    xAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#xRenderer"
      }
    },
    xRenderer: {
      type: "AxisRendererX"
    },
    yAxis: {
      type: "ValueAxis",
      settings: {
        renderer: "#yRenderer"
      }
    },
    yRenderer: {
      type: "AxisRendererY"
    },
    series: {
      type: "LineSeries",
      settings: {
        name: "Series",
        xAxis: "#xAxis",
        yAxis: "#yAxis",
        valueYField: "value",
        valueXField: "date",
        stroke: {
          type: "Color",
          settings: {
            hex: "#1e90ff"
          }
        }
      }
    }
  }
};