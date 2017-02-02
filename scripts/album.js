

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
 
    var $row = $(template);
    var onHover = function(event){   
         $songItemNumberElement = $(this).find(".song-item-number");
         songItemNumber = parseInt( $songItemNumberElement.data('song-number') );
         if (songItemNumber !== currentlyPlayingSongNumber) {
             $songItemNumberElement.html(playButtonTemplate);
         }
    };
    
    var offHover = function(event){
         $songItemNumberElement = $(this).find(".song-item-number");
         songItemNumber = parseInt( $songItemNumberElement.data('song-number') );
         if (songItemNumber !== currentlyPlayingSongNumber) {
             $songItemNumberElement.html(songItemNumber);
         }
//        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    
    var clickHandler = function(){
        songItemNumber = parseInt( $(this).data('song-number') );
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentlyPlayingSongNumber = songItemNumber;
            currentSongFromAlbum = currentAlbum.songs[songItemNumber-1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSongFromAlbum = null;
            currentlyPlayingSongNumber = null;
        }
    };
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
    
     return $row;
};

var setCurrentAlbum = function(album) {
     currentAlbum = album;
    
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow)
     }
};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function(){
    var idx = trackIndex(currentAlbum, currentSongFromAlbum);
    if( ++idx >= currentAlbum.songs.length ) idx = 0;
    $(".song-item-number[data-song-number = '" + (idx+1) + "']").click();
};

var previousSong = function(){
    var idx = trackIndex(currentAlbum, currentSongFromAlbum);
    if( --idx < 0 ) idx = currentAlbum.songs.length-1;
    $(".song-item-number[data-song-number = '" + (idx+1) + "']").click();
};

var updatePlayerBarSong = function(){
    if( currentSongFromAlbum===null ){
        $(".currently_playing .song-name").empty();
        $(".currently_playing .artist-song-mobile").empty();
    }
    $(".currently_playing .song-name").text(currentSongFromAlbum.title);
    $(".currently_playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
$(document).ready(function(){
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
});

