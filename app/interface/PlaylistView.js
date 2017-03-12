import React from 'react';

import PlaylistList from './PlaylistList';

function PlaylistView({ playlists, downloads, onPlaylistSelect }) {
  const preparedPlaylists = playlists.map(playlist => ({
    playlist,
    downloading: !!downloads[playlist.id]
  }));

  return (
    <div>
      <PlaylistList playlists={preparedPlaylists} onSelect={onPlaylistSelect} />
    </div>
  );
}

export default PlaylistView;
