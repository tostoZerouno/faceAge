
const request = require('request'),
    fs = require('fs');

const FACE_API_KEY = "6e2715cbea564f4f95f9a097e935e8c7";

exports.getAgeFromImage = (blob) => {
    return new Promise(
        (resolve, reject) => {
            const speechApiUrl = [
                'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?',
                'returnFaceId=true',
                'returnFaceLandmarks=false',
                'returnFaceAttributes=age'
            ].join('&');

            //console.log(stream);


            const requestData = {
                url: speechApiUrl,
                headers: {
                    'content-type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': FACE_API_KEY
                },
                body: blob
            };


            /*       var out = fs.createWriteStream('logo.png');
                   stream.pipe(out).on('finish', function () {
                       console.log('Pipe finished!');
                   });*/


            request.post(requestData, (error, response, body) => {

                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(body);
                } else {
                    console.log(JSON.parse(body)[0].faceId);
                    resolve(JSON.parse(body)[0].faceAttributes.age);
                }



            });



        }

    )
};