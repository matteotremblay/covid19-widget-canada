// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// Covid-19 Tracker for Canadian Provinces by Matteo Tremblay
let covidInfo = await getCovidData()
let widget = await createWidget()
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget() {
  // Define symbols 
  let upticker = SFSymbol.named("chevron.up");
  let downticker = SFSymbol.named("chevron.down");  
  let caseticker = SFSymbol.named("cross.case.fill");  
  let hospitalticker = SFSymbol.named("stethoscope.circle.fill");  
  let criticalticker = SFSymbol.named("waveform.path.ecg.rectangle.fill");  
  let deathticker = SFSymbol.named("heart.slash.fill");
 
  let widget = new ListWidget()
  widget.setPadding(20, 15, 10, 15)
 
  // Add background gradient for light and dark mode  
  let lightbgtop = new Color("f0f0f0");
  let lightbgbottom = new Color("f5f5f5");
  let darkbgtop = new Color("212121");
  let darkbgbottom = new Color("393939");
  let bgtopcolor = Color.dynamic(lightbgtop, darkbgtop);
  let bgbottomcolor = Color.dynamic(lightbgbottom, darkbgbottom);
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [bgtopcolor, bgbottomcolor]
  widget.backgroundGradient = gradient;
 
  // Add other theme colors  
  let lightaltcolor = new Color("ffffff");
  let darkaltcolor = new Color("000000");
  let lightindark = Color.dynamic(Color.black(), Color.white());
  let darkindark = Color.dynamic(Color.white(), Color.black());

  for(j=0; j<covidInfo.length; j++)
  {
   
    let currentProvince = covidInfo[j];
    let row1 = widget.addStack();  
    // Add widget title
    let widgettitle = row1.addText("Covid-19 Tracker");
    widgettitle.textColor = lightindark;
    widgettitle.font = new Font("Arial-BoldMT",13);
    row1.addSpacer();
    // Add status by matching current date to date of most recent data 
    // By default, current date is measured in UTC and must be adjusted manually (line below). The following adjustments can be used for each Canadian time zone: NST (UTC -3:30) = 12600000; AST (UTC -4:00) = 14400000; EST (UTC -5:00) = 18000000; CST (UTC -6:00) = 21600000; MST (UTC -7:00) = 25200000; PST (UTC -8:00) = 28800000.  
    let dateEST = Date.parse(new Date()) - 18000000;
    let currentDate = new Date(dateEST).toISOString().substring(0,10);
    let provDate = currentProvince.date.toString();
    let dataStatus;
    if(currentDate == provDate && currentProvince.changecases == 0 && currentProvince.changehospitalizations == 0 && currentProvince.changedeaths == 0) {
        dataStatus = row1.addText("NOT REPORTED");
        dataStatus.textColor = Color.yellow();
    } else if(currentDate == provDate) {
        dataStatus = row1.addText("UP TO DATE");
        dataStatus.textColor = Color.green();
    } else {
        dataStatus = row1.addText("OUT OF DATE");
        dataStatus.textColor = Color.red();
    }
    dataStatus.font = new Font("Arial-BoldMT",12);  
   
    
    widget.addSpacer(2)
    let row2= widget.addStack();
    // Add Province code
    let provSymbol = row2.addText("Province: " + currentProvince.province.toUpperCase());
    provSymbol.textColor = lightindark;
    provSymbol.textOpacity = 0.7;
    provSymbol.font = new Font("Arial-BoldMT",9);
    // Add date of most recent data
    row2.addSpacer();
    let lastupdated = row2.addText("Last Updated: " + currentProvince.date);
    lastupdated.textColor = lightindark;
    lastupdated.textOpacity = 0.7;
    lastupdated.font = new Font("Arial-BoldMT",9);   
    widget.addSpacer(10);
   
   
    // Add Case Data  
    addDataset(caseticker, "New Cases", currentProvince.changecases, "7-Day Avg. Cases", currentProvince.avgcases, widget) 
    widget.addSpacer(5);
 
    // Add Hospital Data  
    addDataset(hospitalticker, "New Hospitalizations", currentProvince.changehospitalizations, "Total Hospitalizations", currentProvince.totalhospitalizations, widget) 
    widget.addSpacer(5);
 
    // Add Death Data  
    addDataset(deathticker, "New Deaths", currentProvince.changedeaths, "Total Deaths", currentProvince.totaldeaths, widget) 
    widget.addSpacer();
   
    function addDataset(iconticker, rowtitle1, data1, rowtitle2, data2, widget) {
        // Add data stack
        let ds = widget.addStack();
        let ir = ds.addStack();
        // Add icon
        let icon = ir.addImage(iconticker.image);
        icon.tintColor = lightindark;
        icon.imageSize = new Size(18, 18);
        ds.addSpacer()
       
        let datarow1 = ds.addStack();
        datarow1.setPadding(2, 5, 2, 5);
        datarow1.backgroundColor = lightindark;
        datarow1.cornerRadius = 4;
        // Add top data row title
        let drtitle = datarow1.addText(rowtitle1);
        drtitle.textColor = darkindark;
        drtitle.font = new Font("Arial-BoldMT",12);
        datarow1.addSpacer();
        
        // Add top data. Add color if value is +/-
        let condition = datarow1.addText(data1);
        if (data1 < 0) {
        condition.textColor = Color.red();
        } else {
        condition.textColor = Color.green();
        }
        condition.font = new Font("Arial-BoldMT",12);
        datarow1.addSpacer(2);

        // Add ticker icon   
        let tick = null;
        if(data1 < 0) {
        tick = datarow1.addImage(downticker.image);
        tick.tintColor = Color.red();
        } else {
        tick = datarow1.addImage(upticker.image);
        tick.tintColor = Color.green();
        }
        tick.imageSize = new Size(11,11);
   
        widget.addSpacer(2);
        
        // Add bottom data row title
        let datarow2 = widget.addStack();
        datarow2.setPadding(0, 30, 0, 5);
        drtitle2 = datarow2.addText(rowtitle2);
        drtitle2.textColor = lightindark;
        drtitle2.textOpacity = 0.7;
        drtitle2.font = new Font("ArialMT",9);
        datarow2.addSpacer();

        // Add bottom data   
        let noncodition = datarow2.addText(data2);
        noncodition.textColor = lightindark;
        noncodition.font = new Font("ArialMT",9);     
     }      
  }
  return widget
}

async function getCovidData() {
  let provinces = null;
  // Read from WidgetParameter if present or use hardcoded values
  // Provide values in Widget Parameter as comma seperated list  
  if(args.widgetParameter == null) {
    provinces = ["ON"];
  } else {
    provinces = args.widgetParameter.split(",");
  }
 
  let provincesdata = [];
  for(i=0; i< provinces.length; i++)
  {
    let cvddata = await queryCovidData(provinces[i].trim());
    let prov = cvddata.province;
    // Extract data from most recent update
    let data = cvddata.data[cvddata.data.length -1];
    let dataKeys = Object.keys(data);
    // Extract data for 7-day average case count
    let previousdata = cvddata.data.map(({change_cases}) => change_cases);
    let sumweeklycases = previousdata.slice(-7).reduce((a, b) => a + b, 0);
 
    let covid = {};
    covid.province = prov;
    covid.date = data.date;
    covid.avgcases = Math.round(sumweeklycases / 7).toLocaleString();
    covid.changecases = data.change_cases.toLocaleString();
    covid.totalcases = data.total_cases.toLocaleString();
    covid.changehospitalizations = data.change_hospitalizations.toLocaleString();
    covid.totalhospitalizations = data.total_hospitalizations.toLocaleString();
    covid.changecriticals = data.change_criticals.toLocaleString();
    covid.totalcriticals = data.total_criticals.toLocaleString();  
    covid.changedeaths = data.change_fatalities.toLocaleString();  
    covid.totaldeaths = data.total_fatalities.toLocaleString();
    provincesdata.push(covid);   
  }
  return provincesdata;
}

async function queryCovidData(province) {
  let url = "https://api.covid19tracker.ca/reports/province/" + encodeURIComponent(province)
  let req = new Request(url)
  return await req.loadJSON()
}