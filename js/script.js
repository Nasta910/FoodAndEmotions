let emotionsData;
let cocktail1Data = [];
let cocktail2Data = [];
let cocktail3Data = [];
let averageCocktail1;
let averageCocktail2;
let averageCocktail3;
let cocktail1MoodsPerParticipants = {};
let cocktail2MoodsPerParticipants = {};
let cocktail3MoodsPerParticipants = {};
let cocktail1Moods = [];
let cocktail2Moods = [];
let cocktail3Moods = [];
let participantsList = [];
let TestArray = [];
let cocktail1MoodsDuring = []
let cocktail2MoodsDuring = []
let cocktail3MoodsDuring = []
async function fetchData(){
    emotionsData = await d3.csv("data/Casus_foodEmotions_data.csv");
}

function putDataPerCocktail(minAge, maxAge, gender, operator){
    cocktail1Data = [];
    cocktail2Data = [];
    cocktail3Data = [];
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

async function createPage(){
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
    emptyCocktail("#Cocktail1Content")
    getParticipants(emotionsData)
    
    getMoodsDuringCocktail(cocktail1Data, participantsList)
    getMoodsDuringCocktail(cocktail2Data, participantsList)
    getMoodsDuringCocktail(cocktail3Data, participantsList)
    
    showMoodChanges(cocktail1MoodsDuring, "faceCocktail1", 0)
    showMoodChanges(cocktail2MoodsDuring, "faceCocktail2", 0)
    showMoodChanges(cocktail3MoodsDuring, "faceCocktail3", 0)
}

function getParticipants(data){
    data.forEach(element => {
        if (!participantsList.includes(element.Participant)){
            participantsList.push(element.Participant);
        }
    });
}

function getMoodsDuringCocktail(cocktail, participants){
    let cocktailNumber;
    for (let index = 0; index < participants.length; index++) {
        let highestMood;
        let participantID = participants[index];
        var moodsPerParticipant = [] 
        let moodNumber = 1;
        for (var i = 0; i < cocktail.length; i++) {
            if(cocktail[i].Participant == participantID){
            var moodsOfEntry = {Neutral: 0, Happy: 0, Sad: 0, Angry: 0, Surprised: 0, Scared: 0, Disgusted: 0}
            moodsOfEntry.Neutral = Number(cocktail[i].Neutral);
            moodsOfEntry.Happy = Number(cocktail[i].Happy);
            moodsOfEntry.Sad = Number(cocktail[i].Sad);
            moodsOfEntry.Angry =  Number(cocktail[i].Angry);
            moodsOfEntry.Surprised = Number(cocktail[i].Surprised);
            moodsOfEntry.Scared = Number(cocktail[i].Scared);
            moodsOfEntry.Disgusted = Number(cocktail[i].Disgusted);
            if (moodsOfEntry.Neutral > 0.8){
                highestMood = "Neutral"
            }
            else{
                let highestMoodValue = Math.max(moodsOfEntry.Happy, moodsOfEntry.Sad, moodsOfEntry.Angry, moodsOfEntry.Surprised, moodsOfEntry.Scared, moodsOfEntry.Disgusted)
                highestMood = Object.keys(moodsOfEntry).find(key => moodsOfEntry[key] === highestMoodValue);
            }
            
            moodsPerParticipant.push(highestMood);
            
            
            moodNumber++;
            }
            
        }
        
        if (Object.keys(moodsPerParticipant).length != 0){
            if (cocktail[0].Event_Marker.includes("1")) {
                cocktailNumber = 1;
                cocktail1MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
            else if (cocktail[0].Event_Marker.includes("2")) {
                cocktailNumber = 2;
                cocktail2MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
            else{
                cocktailNumber = 3;
                cocktail3MoodsPerParticipants["participant"+participantID] = moodsPerParticipant;
            }
        }
        
    }
    switch(cocktailNumber) {
        case 1:
            cocktail1MoodsDuring = generalizeDataDuring(cocktail1MoodsPerParticipants)
            console.log("moods cocktail 1 "+ cocktail1MoodsDuring)
            break;
        case 2:
            cocktail2MoodsDuring = generalizeDataDuring(cocktail2MoodsPerParticipants)
            console.log("moods cocktail 2 "+ cocktail2MoodsDuring)
            break;
        default:
            cocktail3MoodsDuring = generalizeDataDuring(cocktail3MoodsPerParticipants);
            console.log("moods cocktail 3 "+ cocktail3MoodsDuring)
    }
}

function generalizeDataDuring(data){
    let dataToUse = data;
    let fullDataExtracted = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
    let moodsToReturn = []
    let numberOfMoods = 15;
    for (let index = 0; index < Object.entries(dataToUse).length; index++) {
        let slicedArray = []
        const moods = Object.entries(dataToUse)[index][1];
        let divider = Math.ceil(moods.length / numberOfMoods)
        for (let i = 0; i < numberOfMoods; i++) {
            slicedArray = moods.splice(0, divider);
            //
            var mf = 1;
            var m = 0;
            var item;
            for (var ic=0; ic<slicedArray.length; ic++)
            {
                    for (var j=ic; j<slicedArray.length; j++)
                    {
                            if (slicedArray[ic] == slicedArray[j])
                             m++;
                            if (mf<m)
                            {
                              mf=m; 
                              item = slicedArray[ic];
                            }
                    }
                    m=0;
            }
            //
            fullDataExtracted[i].push(item)
        }
    }
    
    for (let i = 0; i < numberOfMoods; i++) {  
        var mf = 1;
    var m = 0;
    var item;
        for (var ic=0; ic<fullDataExtracted[i].length; ic++)
        {
                for (var j=ic; j<fullDataExtracted[i].length; j++)
                {
                        if (fullDataExtracted[i][ic] == fullDataExtracted[i][j])
                        m++;
                        if (mf<m)
                        {
                        mf=m; 
                        item = fullDataExtracted[i][ic];
                        }
                }
                m=0;
        }
        moodsToReturn.push(item)
    }
    return moodsToReturn
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

        switch(highestMood) {
            case "Happy":
                Moods.Happy = Moods.Happy + highestMoodValue; 
              break;
            case "Sad":
                Moods.Sad = Moods.Sad + highestMoodValue;
              break;
            case "Angry":
                Moods.Angry = Moods.Angry + highestMoodValue; 
              break;
            case "Surprised":
                Moods.Surprised = Moods.Surprised + highestMoodValue; 
              break;
              case "Scared":
                Moods.Scared = Moods.Scared + highestMoodValue; 
              break;
            case "Disgusted":
              Moods.Disgusted = Moods.Disgusted + highestMoodValue; 
              break;
            default:
                Moods.Neutral = Moods.Neutral + highestMoodValue; 
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

function showMoodChanges(moodSet, tableNumber, counter){
      setTimeout(function() {   //  call a 3s setTimeout when the loop is called
        d3.selectAll('[id="'+tableNumber+'"]')
            .attr("class", moodSet[counter])   //  your code here
            console.log(counter, moodSet[counter]);
        counter++;                  //  increment the counter
        if (counter < moodSet.length) {           //  if the counter < 10, call the loop function)
            showMoodChanges(moodSet, tableNumber, counter);             //  ..  again which will trigger another 
        }                       //  ..  setTimeout()
      }, 2000)
}

createPage();
