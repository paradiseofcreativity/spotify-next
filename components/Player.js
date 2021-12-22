import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil';
import {
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import { debounce } from 'lodash';
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import { toast } from 'react-toastify';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import useSong from '../hooks/useSong';

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const song = useSong();

  const onPlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data?.body?.is_playing) {
          spotifyApi.pause().then(() => {
            setIsPlaying(false);
          }).catch((err) => {
            toast.error(String(err), toastOptions);
            console.log('SPOTIFYAPI.PAUSE::err:', err);
          });

        } else {
          spotifyApi.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            toast.error(String(err), toastOptions);
            console.log('SPOTIFYAPI.PLAY::err:', err);
          });
        }
      })
      .catch((err) => {
        toast.error(String(err), toastOptions);
        console.log('getMyCurrentPlaybackState::err:', err);
      });
  };

  const onVolume = (e) => {
    setVolume(Number(e.target.value));
  };

  const onVolumeDown = () => {
    if (volume > 0) {
      setVolume(volume - 10);
    }
  };

  const onVolumeUp = () => {
    if (volume < 100) {
      setVolume(volume + 10);
    }
  };

  const fetchCurrentSong = () => {
    if (!song) {
      spotifyApi
        .getMyCurrentPlayingTrack()
        .then((data) => {
          setCurrentTrackId(data?.body?.item?.id);
        })
        .catch((err) => {
          toast.error(String(err), toastOptions);
          console.log('getMyCurrentPlayingTrack::err:', err);
        });

      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => {
          setIsPlaying(data?.body?.is_playing);
        })
        .catch((err) => {
          toast.error(String(err), toastOptions);
          console.log('getMyCurrentPlaybackState::err:', err);
        });
    }
  };

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        toast.error(String(err), toastOptions);
        console.log('setVolume::err:', err);
      });
    }, 500),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const songPoster = song?.album?.images?.[0]?.url;

  return (
    <div className='sticky bottom-0'>
      <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div className='flex items-center space-x-4'>
          {songPoster && (
            <img
              className='hidden md:inline h-10 w-10'
              src={songPoster}
              alt='song'
            />
          )}
          <div>
            <h3 className='truncate'>{song?.name}</h3>
            <p>{song?.artists?.[0]?.name}</p>
          </div>
        </div>

        <div className='flex items-center justify-evenly'>
          <SwitchHorizontalIcon className='button' />
          <RewindIcon className='button' />

          {isPlaying ? (
            <PauseIcon onClick={onPlayPause} className='button w-10 h-10' />
          ) : (
            <PlayIcon onClick={onPlayPause} className='button w-10 h-10' />
          )}

          <FastForwardIcon className='button' />
          <ReplyIcon className='button' />
        </div>

        <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
          <VolumeDownIcon onClick={onVolumeDown} className='button' />
          <input
            className='w-14 md:w-28'
            type='range'
            value={volume}
            min={0}
            max={100}
            onChange={onVolume}
          />
          <VolumeUpIcon onClick={onVolumeUp} className='button' />
        </div>
      </div>
    </div>
  );
}

export default Player;
