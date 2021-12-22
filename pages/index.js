import { getSession } from 'next-auth/react'
import Meta from '../components/Meta'
import Player from '../components/Player'
import Playlist from '../components/Playlist'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Meta title="Spotify 2.0" />

      <main className="flex">
        <Sidebar />
        <Playlist />
      </main>

      <Player />
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  };
}
