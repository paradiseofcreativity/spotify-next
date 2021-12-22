import { useRecoilState } from 'recoil';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import { millisToMinutes } from '../lib/time';

const toastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

function Song({ track, order }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const onPlaySong = () => {
    setCurrentTrackId(track?.id);
    setIsPlaying(true);

    spotifyApi
      .play({
        uris: [track?.uri],
      })
      .catch((err) => {
        toast.error(String(err), toastOptions);
        console.log('PLAY::err:', err);
      });
  };

  const isCurrentTrack = track.id === currentTrackId;

  return (
    <div
      onClick={onPlaySong}
      className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'
    >
      <div className='flex items-center space-x-4'>
        {isCurrentTrack && isPlaying ? (
          <img
            className='h-[15px] w-[15px]'
            src='/equaliser-animated-green.gif'
            alt='equaliser'
          />
        ) : (
          <p
            className={classNames('text-center', {
              'text-green-500': isCurrentTrack,
            })}
          >
            {order + 1}
          </p>
        )}
        <img
          className='h-10 w-10'
          src={track?.album?.images?.[0]?.url}
          alt='album'
        />
        <div>
          <p
            className={classNames('w-36 lg:w-64 truncate text-white', {
              'text-green-500': isCurrentTrack,
            })}
          >
            {track?.name}
          </p>
          <p className='w-40'>{track?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='hidden md:inline w-40'>{track?.album?.name}</p>
        <p>{millisToMinutes(track?.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
