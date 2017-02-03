

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
        songItemNumber = $(this).data('song-number');
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songItemNumber) {
            $(this).html(pauseButtonTemplate);
            $playButton.html(playerBarPauseButton);
            setSong(songItemNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songItemNumber) {
            if( currentSoundFile.isPaused() ){
                $(this).html(pauseButtonTemplate);
                $playButton.html(playerBarPauseButton);  
                currentSoundFile.play();
            }else{
                $(this).html(playButtonTemplate);
                $playButton.html(playerBarPlayButton);  
                currentSoundFile.pause();
            }
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

var setSong = function(songItemNumber){
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songItemNumber);
    currentSongFromAlbum = currentAlbum.songs[songItemNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
};

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
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

var togglePlayFromPlayerBar = function(){
    idx = currentlyPlayingSongNumber || 1;
    $(".song-item-number[data-song-number = '" + idx + "']").click();
}

var updatePlayerBarSong = function(){
    if( currentSongFromAlbum===null ){
        $(".currently_playing .song-name").empty();
        $(".currently_playing .artist-song-mobile").empty();
    }
    $(".currently_playing .song-name").text(currentSongFromAlbum.title);
    $(".currently_playing .artist-song-mobile").text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $playButton.html(playerBarPauseButton);
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playButton = $('.main-controls .play-pause');
 
$(document).ready(function(){
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playButton.click(togglePlayFromPlayerBar);
});

