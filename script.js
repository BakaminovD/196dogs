function range() {
    var
    val = $('.volume').val();
    $('.volume').css({'background':'-webkit-linear-gradient(left, red 0%, red '+val+'%, white '+val+'%, white 0%)'});
    $('.volume').css({'background':'-moz-linear-gradient(left, red 0%, red '+val+'%, white '+val+'%, white 0%)'})
}

$(document).ready(function() {
    var
    id_song, Song, i, mute = false, volume = 1,
    songs = [
        muz_one = [0, 'Пролог', '74sp/1.mp3', '85.237542'], 
        muz_two = [1, 'Ежели бы мне бы...', '74sp/2.mp3', '77.562875'],
        muz_three = [2, 'Девяткино', '74sp/3.mp3', '119.045333'],
        muz_four = [3, 'Полрайона', '74sp/4.mp3', '127.064917'],
        muz_five = [4, 'Пастораль', '74sp/5.mp3', '181.060042'],
        muz_six = [5, 'Пачка', '74sp/6.mp3', '97.05025'],
        muz_seven = [6, 'Проститутка', '74sp/7.mp3', '96.057583'],
        muz_eight = [7, 'Содом', '74sp/8.mp3', '112.58775'], 
        muz_nine = [8, '1000 лет', '74sp/9.mp3', '80.0445'], 
        muz_ten = [9, 'Эпилог', '74sp/10.mp3', '59.068208'] 
    ];
/*  Song = new Audio(songs[0][2]);
    Song.addEventListener('loadedmetadata', function(){
        console.log(this.duration);
    });
    Song = new Audio(songs[1][2]);
    Song.addEventListener('loadedmetadata', function(){   
        console.log(this.duration);
    });*/
    for(i=0; i<songs.length; i++){
        $('.wrp').append('<div class="song" id="'+songs[i][0]+'"><div class="play-pause_song"></div><div class="nameSong_song">'+songs[i][1]+'</div><div class="duration_song">'+parseInt(songs[i][3]/60)+':'+parseInt(songs[i][3]%60)+'</div></div>')
    }
    
    function playNewSong(id) {
        var
        curtime, cur = -100;
        $('.nameSong').text(songs[id][1]);
        $('.play-pause').attr('id', id);
        id_song = id;
        Song = new Audio(songs[id][2]);
        $('.play-pause').css({'background-position':'-3px -39px'});
        $('.song#'+id+' .play-pause_song').css({'background-position':'-2px -19px'});
        Song.play();
        Song.volume = volume;
        //$('.volume').val(100); // КОСЯК ТУТ
        Song.addEventListener('timeupdate', function() {
            curtime = Song.currentTime;
            cur = -((songs[id_song][3]-curtime)*100)/songs[id_song][3];
            $('.time').text(parseInt(curtime/60)+':'+parseInt(curtime%60));
            $('.progress').css({'left':cur+'%'});
        });
    };

    function playPauseSong(id) {
        if (Song) {
            if (id == id_song) {
                if (Song.paused) {
                    Song.play();
                    Song.volume = volume;
                    $('.play-pause').css({'background-position':'-3px -39px'});
                    $('.song#'+id+' .play-pause_song').css({'background-position':'-2px -19px'});
                }
                else {
                    Song.pause();
                    $('.play-pause').css({'background-position':'-5px 0px'});
                    $('.song#'+id+' .play-pause_song').css({'background-position':'-2px 0px'});
                }
            }
            else {
                Song.pause();
                $('.play-pause_song').css({'background-position':'-5px 0px'});
                $('.song#'+id+' .play-pause_song').css({'background-position':'-2px 0px'});
                playNewSong(id);
            }
        }
        else {
            playNewSong(id);
        }
    }

    $('.song, .play-pause').on('click', function() {
        var
        id = $(this).attr('id');
        $('.play-pause_song').css({'background-position':'-2px 0px'});
        playPauseSong(id);
        id++;
        $('.sledBtn#sled').attr('data-id', id);
        id--; id--;
        $('.sledBtn#pred').attr('data-id', id);
    });
    
    $('.sledBtn').on('click', function() {
        var
        id = $(this).attr('data-id');
        if (id != -1) {
            $('.play-pause_song').css({'background-position':'-5px 0px'});
            playPauseSong(id);
            id++;
            $('.sledBtn#sled').attr('data-id', id);
            id--; id--;
            $('.sledBtn#pred').attr('data-id', id);
        }
    });

    $('.mute').on('click', function() {
        if (Song) {
            if (mute == false) {
                mute = true;
                $('.mute').css({'color':'white'});
                $('.volume').val(0);
                $('.volume').css({'background':'-webkit-linear-gradient(left, red 0%, red 0%, white 0%, white 100%)'});
                $('.volume').css({'background':'-moz-linear-gradient(left, red 0%, red 0%, white 0%, white 100%)'})
            }
            else {
                mute = false;
                $('.mute').css({'color':'red'});
                $('.volume').val(100);
                $('.volume').css({'background':'-webkit-linear-gradient(left, red 0%, red 100%, white 0%, white 0%)'});
                $('.volume').css({'background':'-moz-linear-gradient(left, red 0%, red 100%, white 0%, white 0%)'})
            }
            Song.muted = mute;
        }
    });

    $('.volume').on('change', function() {
        var
        val = $(this).val();
        console.log(val)
        volume = val/100;
        if (Song) {
            //Song.volume = volume;
            if (val == 0) {
                mute = true;
                $('.mute').css({'color':'white'});
                Song.volume = volume;
            }
            else {
                mute = false;
                $('.mute').css({'color':'red'});
                Song.volume = volume;
            }      
        }
    });

    $('.range').on('mouseenter', function() {
        if (Song) {
            var
            id = $('.play-pause').attr('id'),
            offset = $(this).offset(),
            dur = songs[id][3],
            w = $(this).width();
            $('.setTime').show();
            $('.range').on('mousemove', function(e) {
                var
                x = e.pageX - offset.left,
                xproc= (x * 100) / w,
                sec = (xproc * dur) / 100;
                $('.setTime').css({'left':x-10});
                $('.setTime').text(parseInt(sec/60)+':'+parseInt(sec%60));
                $('.range').on('click', function() {
                    xproc = xproc - 100;
                    $('.progress').css({'left':xproc+'%'});
                    Song.currentTime = sec;
                })
            });
        }
    });

    $('.range').on('mouseout', function() {
        $('.setTime').hide();
    });
});

