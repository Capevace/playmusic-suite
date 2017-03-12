import React from 'react';
import { Tabs, Tab, Badge } from 'material-ui';

function TabBar({ playlistTab, downloadsTab, downloadCount }) {
  console.log(downloadCount);
  return (
    <Tabs>
      <Tab label="Playlists">
        {playlistTab}
      </Tab>
      <Tab
        label={
          'Downloads' + (downloadCount > 0 ? ' (' + downloadCount + ')' : '')
        }
      >
        {downloadsTab}
      </Tab>
    </Tabs>
  );
}

export default TabBar;
