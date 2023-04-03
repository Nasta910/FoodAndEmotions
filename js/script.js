let emotionsData;
let cocktail1Data = [];
let cocktail2Data = [];
let cocktail3Data = [];
let averageCocktail1;
let averageCocktail2;
let averageCocktail3;
async function fetchData(){
    emotionsData = await d3.csv("/data/Casus_foodEmotions_data.csv");
}

function putDataPerCocktail(){
    for (var i = 0; i < emotionsData.length; i++) {
        if (emotionsData[i].Disgusted != "FIT_FAILED" && emotionsData[i].Disgusted != "FIND_FAILED"){
            if(emotionsData[i].Event_Marker.includes("1")){
                cocktail1Data.push(emotionsData[i]);
            }
            else if(emotionsData[i].Event_Marker.includes("2")){
                cocktail2Data.push(emotionsData[i]);
            }
            else{
                cocktail3Data.push(emotionsData[i]);
            }
        }
    }
}

async function storeData(){
    await fetchData();
    putDataPerCocktail();
    console.log(cocktail1Data);
    console.log(cocktail2Data);
    console.log(cocktail3Data);
    averageCocktail1 = getAverage(cocktail1Data);
    averageCocktail2 = getAverage(cocktail2Data);
    averageCocktail3 = getAverage(cocktail3Data);
    console.log (averageCocktail1)
    console.log (averageCocktail2)
    console.log (averageCocktail3)

    d3.selectAll('[id="faceCocktail1"]').attr("class", averageCocktail1)
    d3.selectAll('[id="faceCocktail2"]').attr("class", averageCocktail2)
    d3.selectAll('[id="faceCocktail3"]').attr("class", averageCocktail3)
    
    emptyCocktail("#Cocktail1Content");
    emptyCocktail("#Cocktail2Content");
    emptyCocktail("#Cocktail3Content");

    setTimeout(() => {  fillCocktail("#Cocktail3Content");}, 5000);
    
}

function getAverage(cocktailData){
    var Moods = {Neutral: 0, Happy: 0, Sad: 0, Angry: 0, Surprised: 0, Scared: 0, Disgusted: 0}
    for (var i = 0; i < cocktailData.length; i++) {       
        var moodsOfEntry = {Neutral: 0, Happy: 0, Sad: 0, Angry: 0, Surprised: 0, Scared: 0, Disgusted: 0}
        moodsOfEntry.Neutral = Number(cocktailData[i].Neutral);
        moodsOfEntry.Happy = Number(cocktailData[i].Happy);
        moodsOfEntry.Sad = Number(cocktailData[i].Sad);
        moodsOfEntry.Angry =  Number(cocktailData[i].Angry);
        moodsOfEntry.Surprised = Number(cocktailData[i].Surprised);
        moodsOfEntry.Scared = Number(cocktailData[i].Scared);
        moodsOfEntry.Disgusted = Number(cocktailData[i].Disgusted);

        let highestMoodValue = Math.max(moodsOfEntry.Neutral, moodsOfEntry.Happy, moodsOfEntry.Sad, moodsOfEntry.Angry, moodsOfEntry.Surprised, moodsOfEntry.Scared, moodsOfEntry.Disgusted)
        let highestMood = Object.keys(moodsOfEntry).find(key => moodsOfEntry[key] === highestMoodValue);
        
        if(highestMood == "Neutral"){
            Moods.Neutral = Moods.Neutral + highestMoodValue; 
        }
        else if(highestMood == "Happy"){
            Moods.Happy = Moods.Happy + highestMoodValue; 
        }
        else if(highestMood == "Sad"){
            Moods.Sad = Moods.Sad + highestMoodValue; 
        }
        else if(highestMood == "Angry"){
            Moods.Angry = Moods.Angry + highestMoodValue; 
        }
        else if(highestMood == "Surprised"){
            Moods.Surprised = Moods.Surprised + highestMoodValue; 
        }
        else if(highestMood == "Scared"){
            Moods.Scared = Moods.Scared + highestMoodValue; 
        }
        else {
            Moods.Disgusted = Moods.Disgusted + highestMoodValue; 
        }
        // Moods.highestMood = Moods.highestMood + highestMoodValue;
    }
    
    console.log("Neutral: "+ Moods.Neutral)
    console.log("Happy: "+ Moods.Happy)
    console.log("Sad: "+ Moods.Sad)
    console.log("Angry: "+ Moods.Angry)
    console.log("Surprised: "+ Moods.Surprised)
    console.log("Scared: "+ Moods.Scared)
    console.log("Disgusted: "+ Moods.Disgusted)
    let highestMoodValue = Math.max(Moods.Happy, Moods.Sad, Moods.Angry, Moods.Surprised, Moods.Scared, Moods.Disgusted)
    let highestMood = Object.keys(Moods).find(key => Moods[key] === highestMoodValue);
    return(highestMood)
}

function emptyCocktail(cocktailID){
    d3.select(cocktailID).selectAll("path")
    .transition() // fade to green in 3 seconds
    .duration(5000)
    .style("opacity", "0");
}

function fillCocktail(cocktailID){
    d3.select(cocktailID).selectAll("path")
    .transition() 
    .style("opacity", "1");
}

// 5000.001219589 ZOEKEN

storeData();
