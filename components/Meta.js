import Head from 'next/head';

function Meta({ title }) {
  return (
    <Head>
      <title>{title}</title>

      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta
        name='description'
        content='Spotify 2.0 with Next.js for the Education Purpose'
      />
      <meta name='keywords' content='paradise creativity' />
      <meta name='author' content='Parimal Nakrani' />
      <meta
        name='msapplication-TileImage'
        content='https://paradiseofcreativity.files.wordpress.com/2017/12/paradise-of-creativity-thumb.png?w=250'
      />

      {/* Open Graph Tags */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content='Spotify 2.0' />
      <meta
        property='og:description'
        content='Spotify 2.0 with Next.js for the Education Purpose by Parimal Nakrani'
      />
      <meta
        property='og:url'
        content='https://paradiseofcreativity.wordpress.com/'
      />
      <meta property='og:site_name' content='Paradise of Creativity' />
      <meta property='og:image' content='/paradise_of_creativity_og.jpg' />
      <meta property='og:image:width' content='200' />
      <meta property='og:image:height' content='200' />
      <meta property='og:locale' content='en_US' />

      {/* Twitter Tags */}
      <meta name='twitter:title' content='Spotify 2.0' />
      <meta
        name='twitter:description'
        content='Spotify 2.0 with Next.js for the Education Purpose'
      />
      <meta name='twitter:image' content='/paradise_of_creativity_og.jpg' />
      <meta name='twitter:image:alt' content='Paradise of Creativity' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@parimal_nakrani' />

      {/* App Favicon */}
      <link rel="icon" sizes="32x32" type="image/png" href="https://open.scdn.co/cdn/images/favicon32.8e66b099.png" />
      <link rel="icon" sizes="16x16" type="image/png" href="https://open.scdn.co/cdn/images/favicon16.c498a969.png" />
      <link rel="icon" href="https://open.scdn.co/cdn/images/favicon.5cb2bd30.ico" />
    </Head>
  );
}

export default Meta;
