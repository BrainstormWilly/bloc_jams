var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
};
 
var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
};

var setCurrentAlbum = function(album) {
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow)
     }
};

var findParentByClassName = function(el, cls){
    if( el===document ){
        return null;
    }
    if( el.className===cls ){
        return el;
    }
    
    return findParentByClassName(el.parentElement, cls)
};

var getSongItem = function(el){
    var songItemParent;
    switch(el.className){
        case "song-item-number" : 
        case "song-item-title" :
        case "song-item-duraton" : 
            songItemParent = findParentByClassName(el, "album-view-song-item");
            break;
        case "album-view-song-item" : songItemParent = el;
            break;
        default : return null;
    }
    return songItemParent.querySelector(".song-item-number");
};

var clickHandler = function(targetElement){
    var songItem = getSongItem(targetElement);
    if(songItem===null) return;
    if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     }else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }

};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; 
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;
 
 window.onload = function() {
     var songItemNumber, songItem;
     setCurrentAlbum(albumPicasso);
     songListContainer.addEventListener('mouseover', function(event) {
         songItem = getSongItem(event.target);
         if( songItem===null ) return;
         songItemNumber = songItem.getAttribute('data-song-number');
         if (songItemNumber !== currentlyPlayingSong) {
             songItem.innerHTML = playButtonTemplate;
         }
     });
     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             songItem = getSongItem(event.target);
             if( songItem===null ) return;
             songItemNumber = songItem.getAttribute('data-song-number');
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });
         songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
         });
     }
 };

