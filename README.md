
![](wpd_logo.png)


## About this repo

This is a repository that compiles the different components developed for the [Waterproofing Data project](https://www.ubdc.ac.uk/research/research-projects/urban-sustainability-participation/waterproofing-data/).
It includes the different elements working together to make

## Getting the project

Clone the repository locally:

```sh
git clone https://github.com/urbanbigdatacentre/waterproofingdataplatform.git
```

## Development setup

To set up the development environment you would follow the instructions given for every component folder. 
The following sections will explain each of those components and is correspondent folder structure.

`Note: Always refer to the module's README.md files for the most accurate instructions for setting up your development.`


## 1. WPD Documentation
Access ---> [WPD-Docs](WPD-Docs)

This the main documentation repository of the project. 
It contains the technical documentation from the Mobile App, Authentication Module and Query API components.
The resources were created using [read-the-docs](https://readthedocs.org/) services, [sphinx](https://www.sphinx-doc.org/en/master/index.html) compiler and [reStructuredText](https://docutils.sourceforge.io/rst.html) markup language.
To deploy this component, you need to install `sphinx` compiler and the documentation theme to your local machine, preferably using python package manager. 

## 2. WPD Mobile App

Access ---> [WPD-MoobileApp](WPD-MobileApp)

This is the module for the mobile application [Water]. This application allows citizens to register self-made rainfall gauges, collect their rainfall measures and report rain and flood events.
The module contains the components developed for a mobile app using [React Native](https://reactnative.dev/) and [Expo](https://docs.expo.io/). For running unit tests, you can use [Jest](https://docs.expo.io/guides/testing-with-jest).


## Further help
For any bugs, queries or feature improvements contact <diego.pajaritograjales@glasgow.ac.uk>.