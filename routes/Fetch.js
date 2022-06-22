const fetch = require('node-fetch');

const getTopics = {
    //async version of getOneRandomTopic
    async getOneRandomTopic() {
        try {
                //Request Quote Object List from database
                var response = await fetch(
                    "http://localhost:5000/dashboard",
                    {
                        method: "GET",
                        headers: {"Content-type": "application/json"},
                    }
                );
                if(response.ok) {
                    let jsonResponse = await response.json();
                    var randNum = Math.floor(Math.random() * jsonResponse.topics_list.length);
                    return jsonResponse.topics_list[randNum]
                }
                else {
                    return ""
                }
          }
          catch (err) {
            console.error(err.message);
          }
    },

    //async version of getAllTopics
    async getAllTopics() {
        try {
            //Request Quote Object List from database
            var response = await fetch(
                "http://localhost:5000/dashboard",
                {
                    method: "GET",
                    headers: {"Content-type": "application/json"},
                }
            );
            if(response.ok) {
              let jsonResponse = await response.json();
              //console.log(jsonResponse.topics_list);
              return jsonResponse.topics_list
            }
            else {
                return ""
            }
          }
          catch (err) {
            console.error(err.message);
          }
    },
    
    
    //promise version of getAllTopics
    getAllTopics() {
        return fetch(
            "http://localhost:5000/dashboard",
            {   method: "GET",
                headers: {"Content-type": "application/json"},
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if(jsonResponse) {
                    //console.log(jsonResponse);
                    return jsonResponse;
                }
            })
    },

    //promise version of getImages
    getImages(imageTopic) {
        return fetch(
            "https://api.pexels.com/v1/search?query=" + imageTopic + "&per_page=1",
            {
                method: "GET",
                headers: {
                    "Authorization": "563492ad6f91700001000001e0f967773c3c4b39bac3b35ac6b5496f",
                },
                maxRedirects: 20
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if(jsonResponse) {
                    return jsonResponse;
                }
            })
    },

    //promise version of get Image
    getImage(imageIndex, imageTopic) {
        return fetch(
            "https://api.pexels.com/v1/search?page=" + imageIndex + "&query=" + imageTopic + "&per_page=1",
            {
                method: "GET",
                headers: {
                    "Authorization": "563492ad6f91700001000001e0f967773c3c4b39bac3b35ac6b5496f",
                },
                maxRedirects: 20
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if(jsonResponse) {
                    return jsonResponse;
                }
            })
    },

    //promise version of get Quote
    getQuote() {
        return fetch(
            "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json&jsonp=?"
           )
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if(jsonResponse) {
                    return jsonResponse;
                }
            })
    }
}

module.exports.getTopics = getTopics;

