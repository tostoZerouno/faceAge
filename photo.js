
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
                    //'http://localhost:4430/age?',
                    'https://faceage.herokuapp.com/age?',
                ].join('&');

                //var formData = new FormData();
                //formData.append("file", dataURItoBlob(stream));

                var xhr = new XMLHttpRequest();
                xhr.open('POST', speechApiUrl, true);
                xhr.setRequestHeader('content-type', 'image/png');
                //xhr.setRequestHeader('Ocp-Apim-Subscription-Key', FACE_API_KEY);

                xhr.onreadystatechange = function () {//Call a function when the state changes.
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response).body.age);
                    } else {
                        resolve(xhr.status);
                    }
                }
                xhr.send(dataURItoBlob(stream));
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

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

})();