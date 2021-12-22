import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import Songs from './Songs';
import useSpotify from '../hooks/useSpotify';
import Header from './Header';
import PlaylistInfo from './PlaylistInfo';

const colors = [
  'from-indigo-500',
  'from-red-500',
  'from-orange-500',
  'from-amber-500',
  'from-yellow-500',
  'from-lime-500',
  'from-green-500',
  'from-emerald-500',
  'from-teal-500',
  'from-cyan-500',
  'from-blue-500',
  'from-violet-500',
  'from-purple-500',
  'from-fuchsia-500',
  'from-pink-500',
  'from-rose-500',
];

function Playlist() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState();
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (playlistId && spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data?.body);
        })
        .catch((err) => {
          console.log('getPlaylist::err:', err);
          setPlaylist(null);
        });
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <Header session={session} />

      <PlaylistInfo playlist={playlist} color={color} />

      <Songs />
    </div>
  );
}

export default Playlist;
