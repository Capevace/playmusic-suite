import React from 'react';
import { List, ListItem, RaisedButton } from 'material-ui';

function disabledStyle(isDisabled) {
  return !!isDisabled
    ? {
        color: 'gray'
      }
    : {};
}

function PlaylistList({ playlists, onSelect }) {
  return (
    <List>
      {playlists.length === 0 && <span>You have no playlists</span>}
      {playlists.map((item, index) => (
        <ListItem
          key={index}
          onClick={() => onSelect(item.playlist)}
          disabled={item.downloading}
          style={disabledStyle(item.downloading)}
        >
          {item.playlist.name}
        </ListItem>
      ))}
    </List>
  );
}

export default PlaylistList;
