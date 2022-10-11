# WPD-DataLake
This project contains the components that handle data ingestion and pre-processing for the [Waterproofing Data project](https://www.ubdc.ac.uk/research/research-projects/urban-sustainability-participation/waterproofing-data/).
The components rely on an Azure [Data Lake Storage Gen2](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction) subscription and a series of [Azure Function](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) written in Python.

## About this repo

This is a repository that compiles the different components developed to manage the project's data lake. 
The functions's source code is already implemented and feed the API used by the mobile app [Waterproofing Data](https://play.google.com/store/apps/details?id=com.dadosaprovadagua.wpdmobileapp) to ingest data.

## Getting the project

Clone the repository locally:

```sh
git clone https://github.com/urbanbigdatacentre/WPD-DataLake.git
```

## Development setup

To set up the development environment you would follow the instructions by microsogt learn to enable an Azure Function's dev enviroment. 
Also, you would need a  [Data Lake Storage Gen2](https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction).
Feel free to contact us for further help with the Azure configuration or directly contact <diego.pajaritograjales@glasgow.ac.uk> for any relevant question.



## Data Lake structure

To handle the raw data, a basic folder structure was implemented in the datalake storage gen2 subscription. 
The structure below was transitory and used to store data prior to preparing it to the final storage in the metadata oriented database.
The reference to files below describe the naming patters used across the data lake storage.


```
.

└── wpd                                     # Root Path for the Datalake container
    ├── Landing                                     
    │   ├── MobileApp                       # Landing Path for data ingested from the app
    │   │  ├── ingested_yyyy-mm-ddThh-MM-ssZ.json
    │   │  ├── Edits                        # Files ingested for edits
    │   │  ├── Errors                       # Raw files that failed ingestion
    │   │  ├── images                       # Path for image storage from the mobile app
    │   ├── Official                        # Landing Path official data ingested
    │   │  ├── rainfall                     # Raw files ingested from CEMADEN's stations API
    │   │  ├── cemaden_station_meteo_yyyy-mm-ddThh-MM-ssZ.json 

```


## Query Endpoints

There are two types of endpoints supported by the data lake. A first group of functions are public and used by the mobile app to ingest data from citizens. 
The second group of functions were designed to ingest official data through public or private API's, these functions do not have a public endpoint. 

### Azure Functions with a public endpoint

- **wpdAppIngestion**: This function handles ingestion of the different data types captured through the mobile app (e.g., register a rainfall gauge, report a flood or rain event). Endpoint: https://spdappingestion.azurewebsites.net
- **wpdIngestRainMeasures**: This function enables the mobile app to record a daily rainfall measure. Endpoint: https://wpdingestrainmeasures.azurewebsites.net
- **wpdAppEditRecord**: This function handles individual edits coming from the mobile app to data previously ingested. For instance, editing the location of a self-mage rainfall gauge.Endpoint: https://wpdappeditrecord.azurewebsites.net


### Azure Functions without a public endpoint 

- **wpdIngestStations**: This function manages the interaction with CEMADEN's API to ingest data from official rainfall stations. 


# Technology Stack

- [Azure Functions Core Tools V3](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)
- [Python Pandas](https://pandas.pydata.org)
- [Python 3](https://www.python.org/download/releases/3.0/)



## Further help
For any bugs, queries or feature improvements contact <diego.pajaritograjales@glasgow.ac.uk>.