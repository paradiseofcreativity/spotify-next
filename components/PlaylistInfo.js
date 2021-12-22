import { Fragment } from 'react';

function PlaylistInfo({ playlist, color }) {
  return (
    <section
      className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
    >
      {playlist && (
        <Fragment>
          <img
            className='object-cover h-44 w-44 shadow-2xl'
            src={playlist.images?.[0]?.url}
            alt='playlist thumb'
          />
          <div>
            <p>PLAYLIST</p>
            <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>
              {playlist.name}
            </h1>
          </div>
        </Fragment>
      )}
    </section>
  );
}

export default PlaylistInfo;
