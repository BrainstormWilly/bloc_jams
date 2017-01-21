var albums = []

albums[0] = {
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
 
albums[1] = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/03.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

albums[2] = {
     title: 'Paradise Valley',
     artist: 'John Mayer',
     label: 'Columbia Records',
     year: '2013',
     albumArtUrl: 'assets/images/album_covers/paradise_valley_cover.jpg',
     songs: [
         { title: 'Wildfire', duration: '4:13' },
         { title: 'Dear Marie', duration: '3:43' },
         { title: 'Waitin\' On The Day', duration: '4:33'},
         { title: 'Paper Doll', duration: '4:17' },
         { title: 'Call Me The Breeze', duration: '3:25'},
         { title: 'Who You Love', duration: '4:10'},
         { title: 'I Will Be Found', duration: '4:01'},
         { title: 'You\'re No One \'Til Someone Let\'s You Down', duration: '2:45'}
     ]
 };

var album_index = 0;

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

var setCurrentAlbum = function(album) {
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     albumSongList.innerHTML = '';
 
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

var toggleCurrentAlbum = function(){
    setCurrentAlbum(albums[album_index]);
    if( ++album_index == albums.length ) album_index = 0;
}


document.querySelector(".album-cover-art").addEventListener("click", function onAlbumCoverClick(e){
    toggleCurrentAlbum();
});
 
 window.onload = function() {
     toggleCurrentAlbum();
 };