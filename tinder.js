var visits;
var jQuery = document.createElement('script');
var downloadedImage = document.createElement('img');
//var APIurl = "https://api.haystack.ai/api/image/analyze?apikey=bcc555e7f0a8f53f04f3f2abeae71611&output=json&model=attractiveness";
var APIurl = 'http://127.0.0.1:52790/index.html'
downloadedImage.setAttribute('id', 'downloadedImage');

jQuery.setAttribute('src', 'https://code.jquery.com/jquery-3.4.1.js');
document.head.appendChild(jQuery);
document.body.appendChild(downloadedImage);

//find the like button and click it
function hitLike() {
    $('button', 'div.CenterAlign')[4].click();
}

//find the dislike button and click it
function hitDislike() {
    $('button', 'div.CenterAlign')[2].click();
}

//decide whether to swipe based on rating from AI
function swipe(rate) {
    rate = rate || 0;
    if( rate >= 7 ) {
        hitLike();
    } else {
        hitDislike();
    }
}

//find out how attractive the person is by talking to the HACKED API
function performRate() {
    var index = 0;
    var score = 0;
    document.querySelectorAll('div').forEach(function(item) {
        if(item.clientWidth === 375 && item.clientHeight == 567 && item.style.backgroundImage){
            if(index == 1) {
                var picture = item.style.backgroundImage.replace('url(', '').replace(')','').replace(/\"/gi, "");
                
                console.log("PICTURE: ", picture);
                
                $.ajax( {
                    url: picture,
                    cache: false,
                    xhr: function() {
                        var xhr = new XMLHttpRequest();
                        xhr.responseType = 'blob'
                        return xhr;
                    },
                    
                    success: function(data) {
                        var img = document.getElementById('downloadedImage');
                        var url = window.URL || window.webkitURL;
                        img.src = url.createObjectURL(data);
                        
                        console.log("img-src: ", img.src);
                        
                        fetch(img.src).then(res => res.blob()).then(blob => {
                            const file = new File([blob], 'image.jpg', blob);
                            var formData = new FormData();
                            formData.append('image', file);
                            $.ajax({
                                type:"POST",
                                url: APIurl,
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function(data) {
                                    if(data.people.length != 0) {
                                        score = Math.round(data.people[0].attractiveness);
                                        console.log(score);
                                        swipe(score);
                                    } else{
                                        console.log("NO FACE IN PICTURE");
                                        swipe(0);
                                    }
                                }
                            });
                        })
                    },
                    error: function() {
                        console.log("ERROR");
                    }
                });
            }
            index++;
        }
    });
}

/*//The loop
visits = 0;

var loop = setTimeout(function() {
    if(visits >= 10) {
        clearTimeout(loop);
    }else{
        performRate();
        visits += 1;
    }
}, 8000);*/