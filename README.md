# Covid-19 Tracker Canada - Widget for iOS using Scriptable
This project was made using Scriptable: https://scriptable.app/.

The Covid-19 Tracker Widget pulls data from https://api.covid19tracker.ca, a Laravel-powered API source for the [COVID-19 Tracker Canada](https://covid19tracker.ca/) project.

## Getting Started
Before using the Covid-19 Tracker Widget, you must download Scriptable from the App Store: https://apps.apple.com/us/app/scriptable/id1405459188?uo=4.

### Instructions
1) Copy the Covid-19 Tracker Widget script, and paste it into a new untitled script file in Scriptable. Press Done, and exit to home screen.
2) Add a 2x1 Scriptable Widget to your home screen.
3) Press and hold the newly added widget to get menu options. Press "Edit Widget".
4) Under "Script", select the copy of the Covid-19 Tracker script. Under "When Interacting", choose "Run Script". Under "Parameter", type in the 2-digit code for the province you would like to track (e.g. "ON" for Ontario or "NB" for New Brunswick).

![tracker setup_resize](https://user-images.githubusercontent.com/69438386/153018309-eb6da5b7-3a7a-4aaf-a285-533d6e33a82a.png)

5) Tap outside the wigdet to save settings.

## Preview
The Covid-19 Tracker Widget has two built-in themes (light and dark) that are automatically configured to your device's theme.

![tracker main_resize](https://user-images.githubusercontent.com/69438386/153018361-1239cf5e-3c6e-4c01-976e-7017890b6faa.png)

## Time Zones
To convey when the data was pulled from the API, the Covid-19 Tracker Widget compares the current date to the date stamp of the most recent data. By default, the current date is measured in UTC, and must be adjusted manually.      

Note: The Covid-19 Tracker Widget is currently set to EST and requires no adjustment for this time zone.

```javascript
let dateEST = Date.parse(new Date()) - 18000000;
let currentDate = new Date(dateEST).toISOString().substring(0,10);
```

To adjust the current date for other times zones, use the corresponding millesecond values:
- NST (UTC -3:30) = 12600000 
- AST (UTC -4:00) = 14400000 
- EST (UTC -5:00) = 18000000 
- CST (UTC -6:00) = 21600000 
- MST (UTC -7:00) = 25200000 
- PST (UTC -8:00) = 28800000

Example:

```javascript
// Set time zone as Mountain Standard Time
let dateMST = Date.parse(new Date()) - 25200000;
let currentDate = new Date(dateMST).toISOString().substring(0,10);
```

## Acknowledgements
- [COVID-19 Tracker Canada Acknowledgements](https://covid19tracker.ca/acknowledgements.html) - the authors and developers of the dataset and API
- [COVID-19 Tracking API GitHub](https://github.com/andrewthong/covid19tracker-api) - API source for tracking COVID-19 cases
