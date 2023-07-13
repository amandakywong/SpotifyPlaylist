require('dotenv').config()
const fs = require("fs");
const SpotifyWebApi = require("spotify-web-api-node");
const token = process.env.SPOTIFY_TOKEN;

console.log(token)


const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

(async () => {
    try {
      const data = await spotifyApi.getUserPlaylists({ offset: 0, limit: 40 });
      const playlists = {};
      for (const playlist of data.body.items) {
        playlists[playlist.name] = playlist.id;
      }
    const discoverWeeklyPlaylistId = playlists['Discover Weekly'];
    const savedWeeklyPlaylistId = playlists['Saved Weekly'];

    if (!discoverWeeklyPlaylistId) {
      console.log('Discover Weekly not found.');
      return;
    }
    if (!savedWeeklyPlaylistId){
      console.log('Saved Weekly Playlist not found.')
      return;
    }

    const tracksData = await spotifyApi.getPlaylistTracks(discoverWeeklyPlaylistId,{
        offset: 0,
        limit: 100,
        fields: "items",
    });
  
      const songUris = tracksData.body.items.map((trackObj) => trackObj.track.uri);

      await spotifyApi.addTracksToPlaylist(savedWeeklyPlaylistId, songUris);
  
      console.log('Songs added to the Saved Weekly Playlist.');
    } catch (error) {
      console.log('An error occurred:', error);
    }
})();
