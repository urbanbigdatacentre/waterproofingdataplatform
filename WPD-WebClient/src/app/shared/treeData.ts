/**
 * Data with nested structure.
 * Each node has a name and an optiona list of children.
 */
export interface LayerNode {
  id: number;
  name: string;
  title: string;
  state: boolean;
  layerName?: string;
  style?: string;
  children?: LayerNode[];
  buttons?: Object[];
  tags?: Array<{name: string, description: string, color: string}>,
  extent?: Array<number>,
  description?: string,
  source?: string,
  available_times?: Array<string>
}

export const TREE_DATA: LayerNode[] = [
  {
    id: 1,
    name: 'Flood Memories',
    title: 'HEADER.FLOOD_MEMORIES',
    state: false,
    tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}],
    buttons: [{method:'toggleShowAllFM', title: 'LEFT_SIDEBAR.SHOW_ALL_FM_BUTTON.TITLE', description: 'LEFT_SIDEBAR.SHOW_ALL_FM_BUTTON.DESCRIPTION'}],
  },
  {
    id: 21,
    name: 'Rio Branco',
    title: 'MAP.RIOBRANCO',
    buttons: [{method:'zoomToLayerExtent', title: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
    extent: [-67.905610, -10.059029, -67.759001, -9.911740],
    state: false,
    children: [{
      id: 2111,
      name: 'Rio Branco',
      title: 'MAP.PERCEPTIONLAYER',
      buttons: [{method:'zoomToLayerExtent', title: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      extent: [-67.860156, -9.952970, -67.789122, -10.015480],
      state: false,
      children: [
        {id: 211, name: 'RB_Overflow', title: 'MAP.OVERFLOW_LAYER.NAME', state: false, layerName: 'wpd:Overflow_rioBranco_2015', style: 'Overflow_Flood',
        buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
        tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
        ,description: 'MAP.OVERFLOW_LAYER.DESCRIPTION'
        ,source:'wms'
      },
        {id: 212, name: 'RB_NormalFlood', title: 'MAP.NORMAL_LAYER.NAME', state: false, layerName: 'wpd:Normal_rioBranco_2015', style: 'Normal_Flood',
        buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
        tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
        ,description: 'MAP.NORMAL_LAYER.DESCRIPTION'
        ,source:'wms'
      },
        {id: 213, name: 'RB_ElementAtRisk', title: 'MAP.ATRISK_LAYER.NAME', state: false, layerName: 'wpd:AtRisk_rioBranco_2015', style: 'AtRisk_Flood',
        buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
        tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
        ,description: 'MAP.ATRISK_LAYER.DESCRIPTION'
        ,source:'wms'
      },
        {id: 214, name: 'RB_RiskPerceptionInGeneral', title: 'MAP.RISK_GENERAL_LAYER.NAME', state: false, layerName: 'wpd:General_rioBranco_2015', style: 'General_Flood',
        buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
        tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
        ,description: 'MAP.RISK_GENERAL_LAYER.DESCRIPTION'
        ,source:'wms'
      }
    ]},
      // official
    /*   {id: 311, name: 'RioB_Flooding', title: 'MAP.OFFICIAL.FLOODING_LAYER.NAME', state: false, layerName: 'wpd:flood_susceptibility_RioBranco', style: 'sensitivity_flooding',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.FLOODING_LAYER.DESCRIPTION'
      ,source:'wms'
    },
      {id: 312, name: 'RioB_Rainfall', title: 'MAP.OFFICIAL.RAINFALL_LAYER.NAME', state: false,
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.RAINFALL_LAYER.DESCRIPTION'
      ,source:'wms'
    }, */
      {id: 313, name: 'RioB_Massmovement', title: 'MAP.OFFICIAL.MASSMOVEMENT.NAME', state: false, layerName: 'wpd:mass_movement_susceptibility_RioBranco', style: 'sensitivity_landslides',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.MASSMOVEMENT.DESCRIPTION'
      ,source:'wms'
    },
      {id: 313, name: 'RioB_FloodDepth', title: 'MAP.OFFICIAL.FLOODDEPT.NAME', state: false, layerName: 'wpd:flood_depth_2015', style: 'flood_deepth',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.FLOODDEPT.DESCRIPTION'
      ,source:'wms'
    }
    ]
  },
  {
    id: 22,
    name: 'Sao Paulo',
    title: 'MAP.SAOPAULO',
    buttons: [{method:'zoomToLayerExtent', title: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
    extent: [-46.817365, -24.007774, -46.345085, -23.336452],
    state: false,
    children: [{
      id: 2211,
      name: 'Perception Layers',
      title: 'MAP.PERCEPTIONLAYER',
      buttons: [{method:'zoomToLayerExtent', title: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      extent: [-46.775926, -23.686111, -46.703214, -23.671186],
      state: false,
      children: [
        {
          id: 221, name: 'SP_FloodRisk', title: 'MAP.FLOODRISK.NAME', state: false, layerName: 'wpd:count_duplicates_red', style: 'count_duplicates_red', 
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
          ,description: 'MAP.FLOODRISK.DESCRIPTION'
          ,source:'wms'
        },
        {
          id: 222, name: 'SP_FirstFlood', title: 'MAP.FIRSTFLOOD.NAME', state: false, layerName: 'wpd:count_duplicates_green', style: 'count_duplicates_green', 
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
          ,description: 'MAP.FIRSTFLOOD.DESCRIPTION'
          ,source:'wms'
        },
        {
          id: 223, name: 'SP_MaxFlood', title: 'MAP.MAXFLOOD.NAME', state: false, layerName: 'wpd:count_duplicates_blue', style: 'count_duplicates_blue',
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
          ,description: 'MAP.MAXFLOOD.DESCRIPTION'
          ,source:'wms'
        },
        {
          id: 224, name: 'SP_WaterLevel_Street', title: 'MAP.WATERLEVEL_STREET.NAME', state: false, layerName: 'wpd:waterlevel_street', style: 'waterlevel_street',
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
          ,description: 'MAP.WATERLEVEL_STREET.DESCRIPTION'
          ,source:'wms'
        },
        {
          id: 225, name: 'SP_WaterLevel_Home', title: 'MAP.WATERLEVEL_HOME.NAME', state: false, layerName: 'wpd:waterlevel_home', style: 'waterlevel_home',
          buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
          tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
          ,description: 'MAP.WATERLEVEL_HOME.DESCRIPTION'
          ,source:'wms'
        }
      ]},
      /* {id: 221, name: 'SP_Overflow', title: 'MAP.OVERFLOW_LAYER.NAME', state: false, layerName: 'wpd:Overflow_rioBranco_2015', style: 'Overflow_Flood', 
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
      ,description: 'MAP.OVERFLOW_LAYER.DESCRIPTION'
      ,source:'wms'
    },
      {id: 222, name: 'SP_NormalFlood', title: 'MAP.NORMAL_LAYER.NAME', state: false, layerName: 'wpd:Normal_rioBranco_2015', style: 'Normal_Flood', 
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
      ,description: 'MAP.NORMAL_LAYER.DESCRIPTION'
      ,source:'wms'
    },
      {id: 223, name: 'SP_ElementAtRisk', title: 'MAP.ATRISK_LAYER.NAME', state: false, layerName: 'wpd:AtRisk_rioBranco_2015', style: 'AtRisk_Flood',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
      ,description: 'MAP.ATRISK_LAYER.DESCRIPTION'
      ,source:'wms'
    },
      {id: 224, name: 'SP_RiskPerceptionInGeneral', title: 'MAP.RISK_GENERAL_LAYER.NAME', state: false, layerName: 'wpd:General_rioBranco_2015', style: 'General_Flood', 
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.CITIZEN.NAME', description: 'LEFT_SIDEBAR.CITIZEN.DESC', color: '#38A471'}]
      ,description: 'MAP.RISK_GENERAL_LAYER.DESCRIPTION'
      ,source:'wms'
    },
      // official
      {id: 321, name: 'SP_Flooding', title: 'MAP.OFFICIAL.FLOODING_LAYER.NAME', state: false, layerName: 'wpd:flood_susceptibility_SaoPaulo', style: 'sensitivity_flooding',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.FLOODDEPT.DESCRIPTION'
      ,source:'wms'
    },
      {id: 322, name: 'SP_Rainfall', title: 'MAP.OFFICIAL.RAINFALL_LAYER.NAME', state: false,
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.FLOODDEPT.DESCRIPTION'
      ,source:'wms'
    }, */
      {id: 323, name: 'SP_Massmovement', title: 'MAP.OFFICIAL.MASSMOVEMENT.NAME', state: false, layerName: 'wpd:mass_movement_susceptibility_SaoPaulo', style: 'sensitivity_landslides_saopaulo',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.INFO_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.MASSMOVEMENT.DESCRIPTION'
      ,source:'wms'
    } /* ,
      {id: 313, name: 'SP_FloodDepth', title: 'MAP.OFFICIAL.FLOODDEPT.NAME', state: false, layerName: 'wpd:flood_depth_2015', style: 'flood_deepth',
      buttons: [{method:'showLayerInfo', title: 'LEFT_SIDEBAR.INFO_BUTTON.TITLE', description: 'LEFT_SIDEBAR.ZOOM_TO_EXTENT_BUTTON.DESCRIPTION'}],
      tags: [{name: 'LEFT_SIDEBAR.OFFICIAL.NAME', description: 'LEFT_SIDEBAR.OFFICIAL.DESC', color: '#4396AC'}]
      ,description: 'MAP.OFFICIAL.FLOODDEPT.DESCRIPTION'
      ,source:'wms'
    } */
    ]
  }
];