
(function () {
    function userMedia() {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;

    }

    function getAgeFromImage(stream) {
        return new Promise(
            (resolve, reject) => {
                const speechApiUrl = [
                    'http://localhost:4430/age?',
                    //'https://faceage.herokuapp.com/age?',
                ].join('&');

                //console.log(stream);
                //var byteArray=atob(unescape(stream.split(',')[1]));
                //Uint8Array.from(atob(unescape(stream.split(',')[1])), byteArray => byteArray.charCodeAt(0))

                var xhr = new XMLHttpRequest();
                xhr.open('POST', speechApiUrl, true);
                xhr.setRequestHeader('content-type', 'multipart/form-data');

                var formData = new FormData();
                var blob = dataUriToBlob(stream);
                formData.append("file", blob);
                

                //xhr.setRequestHeader('Ocp-Apim-Subscription-Key', FACE_API_KEY);

                xhr.onreadystatechange = function () {//Call a function when the state changes.
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response).body.age);
                    } else {
                        resolve(xhr.status);
                    }
                }
                xhr.send(formData);
                // resolve(32);
            });



    }


    // Now we can use it
    if (userMedia()) {
        var videoPlaying = false;
        var constraints = {
            video: true,
            audio: false
        };
        var video = document.getElementById('v');

        var media = navigator.getUserMedia(constraints, function (stream) {

            // URL Object is different in WebKit
            var url = window.URL || window.webkitURL;

            // create the url and set the source of the video element
            video.src = url ? url.createObjectURL(stream) : stream;

            // Start the video
            video.play();
            videoPlaying = true;
        }, function (error) {
            console.log("ERROR");
            console.log(error);
        });


        // Listen for user click on the "take a photo" button
        document.getElementById('take').addEventListener('click', function () {
            if (videoPlaying) {
                var canvas = document.getElementById('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                var data = canvas.toDataURL('image/webp');
                //document.getElementById('photo').setAttribute('src', data);
                var age = document.getElementById('age');
                //age.age = getAge(data);
                //age.innerHTML = "2";
                //var age2 = document.getElementById("age2");
                //dataBind(age2,{age2: 2});
                var image = canvas.toDataURL('image/png');
                getAgeFromImage(image).then(imageAge => {
                    age.innerHTML = "Età rilevata: " + imageAge;
                })

            }
        }, false);



    } else {
        console.log("KO");
    }



    function dataUriToBlob(dataURI) {
        // serialize the base64/URLEncoded data
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        }
        else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // parse the mime type
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // construct a Blob of the image data
        var array = [];
        for(var i = 0; i < byteString.length; i++) {
            array.push(byteString.charCodeAt(i));
        }
        return new Blob(
            [new Uint8Array(array)],
            {type: mimeString}
        );
    }


})();