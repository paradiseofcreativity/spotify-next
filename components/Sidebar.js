import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from '@heroicons/react/outline';
import { HeartIcon } from '@heroicons/react/solid';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(async () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data?.body?.items);
        })
        .catch((err) => {
          toast.error(String(err), toastOptions);
          console.log('getUserPlaylists::err:', err);
        });
    }
  }, [session, spotifyApi]);

  const onPlaylist = (playlist) => () => {
    setPlaylistId(playlist.id);
  };

  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
      <div className='space-y-4'>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5' />
          <p>Your Library</p>
        </button>

        <hr className='border-t-[0.1px] border-gray-900' />

        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-2 text-blue-500 hover:text-white'>
          <HeartIcon className='h-5 w-5' />
          <p>Liked Songs</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5' />
          <p>Your Episodes</p>
        </button>

        <hr className='border-t-[0.1px] border-gray-900' />

        {playlists?.map((playlist) => (
          <p
            key={playlist.id}
            onClick={onPlaylist(playlist)}
            className={classNames('cursor-pointer hover:text-white', {
              'text-white': playlistId === playlist.id,
            })}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
