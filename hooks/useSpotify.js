import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import spotifyApi from '../lib/spotify';

function useSpotify() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            // if refresh token attempt fails, send user to login page
            if (session.error === 'RefreshAccessTokenError') {
                signIn();
            }

            spotifyApi.setAccessToken(session.user?.accessToken);
        }
    }, [session])

    return spotifyApi;
}

export default useSpotify

