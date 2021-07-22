/*const fetchData = async () => {
    const response = await fetch("http://norvig.com/big.txt");
    const data = await response.text();
    console.log(data);
  };
  
fetchData();*/

//created a new promise to pull the doc from local storage
//that on resolution returns the data of big.txt
//because setting the mode as no-chors is returning an empty response
//and if chors(default) is used, the api is throwing an error

async function getDoc() {
  return await fetch("./big.txt")
.then((successMessage) => {
    console.log("Extracted local document successfully");
    return successMessage.text();
})
.catch((failureMessage) => {
    console.log("Could not fetch document from local. Received error :");
    return failureMessage;
  })
};

getDoc().then(data => processData(data));
function processData (data) {
  const reg = /[^a-zA-Z]+/g
  const wordArray = data.replaceAll(reg," ").split(" ")
  //console.log(wordArray)
  taskExecutor(wordArray)
}

//calculate word frequency
function calcFreq(wordArray){
  let obj = {}
  wordArray.forEach(element => {
    element.toLowerCase()
    if (obj.hasOwnProperty(element)) {
      obj[element] = obj[element] + 1;
    }
    else{
      obj[element] = 1
    }
  })
  return obj
}

//sort the object based on values i.e freq of words
function sortObj (freq)
{
  //console.log(freq["this"])
  let itemsArray = Object.keys(freq).map((key) => {return [key, freq[key]]})
  itemsArray.sort((item1,item2) => {return item2[1] - item1[1]})
  //console.log(itemsArray[0])
  let topSearch = {}
  let i = 0
  while(i < 10)
  {
    element = itemsArray[i]
    if(element[0] in topSearch){
      i++
      continue
    }
    topSearch[element[0]] = element[1]
    i++
  }

  return topSearch
}

//driver function for assignment two 2
function taskExecutor (wordArray) 
{
  let freq = calcFreq(wordArray)
  let topSearch = sortObj (freq)
  let topWordsInfo = {}
  //let wordsLimit = 0
  for (const [key, value] of Object.entries(topSearch))
  {    
    apiResponse(key)
    .then((data) => {
       let parsedValue = parseSynonymPos(data.def,value)
       if(parsedValue){
        topWordsInfo[key] = parsedValue
       }
    })
    .catch((err) => {console.log(err)})
    
  }
  console.log(topWordsInfo)
}

//call the api for parts of speech and synonyms
async function apiResponse (word) {
  try{
    const url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-en&text="+word
    const rawData = await fetch(url);
    const jsonResponse = await rawData.json();
    return jsonResponse;
  }catch(err){
    console.log(err)
  }
  return {}
}

//parse the data recived about synonyms and parts of speech
function parseSynonymPos(data,value)
{
  if(!data){
    return null
  }
  let analyzer = data[0].tr
  let output = []
  analyzer.forEach(element=>{
    output.push(
      {
        'synonym' : element.text,
        'partsOfSpeech' : element.pos
      }
    )
  })
  return {
    'occurenceCount' : value,
    'meanings' : output
  }
}
