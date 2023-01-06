document.getElementById('info').style.display = 'none';
weatherLocation();


async function weatherData(latitude, longitude){
  let apiKey = config.openWeatherKEY;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  const dataStream = await fetch(url);
  const data = await dataStream.json();

  console.log(data.main.temp);
  
  let aiInfo = await aiData(data.main.temp);

  let info = `Based on your location (${latitude}, ${longitude}) and area temperature (${data.main.temp} C), the following recommendations are made:\n\n${aiInfo}`;

  document.getElementById('info').innerHTML = info;
  document.getElementById('loader').style.display = 'none';
  document.getElementById('info').style.display = 'block';

}

async function aiData(temp){
  let _apiKey = config.openaiKey;
  let _url = "https://api.openai.com/v1/completions";

  const _dataStream = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${_apiKey}`
    },
    
    body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `input:The temperature is ${temp} degrees celsius, what are some fasionable pieces of clothing to wear? Output:`,
        'temperature': 0.5,
        'max_tokens': 100,
        "n": 1,
        "stream": false,
        "logprobs": null,
        "stop": ["\n"]
        
    })
});

  const _data = await _dataStream.json();
  console.log(_data);
  console.log(_data['choices'][0]['text']);

  let rec = _data['choices'][0]['text'];

  return rec;
  
}

function weatherLocation (){
  navigator.geolocation.getCurrentPosition(success);
}

function success(position){
  const coordinate = position.coords;
  weatherData(coordinate.latitude, coordinate.longitude);
}




