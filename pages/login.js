import { getProviders, signIn } from 'next-auth/react';
import Meta from '../components/Meta';

function Login({ providers }) {
  // sign in with spotify
  const onLogin = (provider) => () => {
    signIn(provider.id, { callbackUrl: process.env.NEXTAUTH_URL });
  };

  return (
    <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
      <Meta title='Login | Spotify 2.0' />

      <img className='w-52 mb-5' src='https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg' alt='spotify logo' />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className='bg-[#18D860] text-white p-5 rounded-full'
            onClick={onLogin(provider)}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
