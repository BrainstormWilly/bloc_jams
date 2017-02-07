

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
        updateSeekBarWhileSongPlays();
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
    currentVolume = volume;
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
    updateSeekBarWhileSongPlays();
};

var previousSong = function(){
    var idx = trackIndex(currentAlbum, currentSongFromAlbum);
    if( --idx < 0 ) idx = currentAlbum.songs.length-1;
    $(".song-item-number[data-song-number = '" + (idx+1) + "']").click();
    updateSeekBarWhileSongPlays();
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
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
}

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
        });
        
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});

    
};

var setCurrentTimeInPlayerBar = function(currentTime){
    $(".currently-playing .current-time").text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime){
    $(".currently-playing .total-time").text(filterTimeCode(totalTime));
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    var setControlValue = function($seekBar, seekBarFillRatio){
        if( $seekBar.parent().hasClass("volume") ){
            setVolume(100 * seekBarFillRatio);
        }else if( $seekBar.parent().hasClass("seek-control") && currentSongFromAlbum){
            seek(currentSongFromAlbum.duration * seekBarFillRatio);
        }
        updateSeekPercentage($seekBar, seekBarFillRatio);
    }
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        setControlValue($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            setControlValue($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
     });
    
    $seekBars.each(function(){
        if( $(this).parent().hasClass("volume") ){
            setControlValue($(this), currentVolume/100);
        }else if( $(this).parent().hasClass("seek-control") ){
            setControlValue($(this), 0);
        }
    })
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var filterTimeCode = function(seconds){
    var secs = "00";
    var mins = Math.floor(seconds / 60);
    if( mins>0 ){
        secs = Math.round(seconds % 60);
    }else{
        secs = Math.round(seconds);
    }
    if( secs<10 ){
        secs = "0" + secs;
    }
    return mins + ":" + secs;
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
    setupSeekBars();
    $playButton.click(togglePlayFromPlayerBar);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});

