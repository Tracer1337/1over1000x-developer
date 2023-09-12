import { Box, Stack, Typography } from '@mui/material';
import CreateTabGroupButton from './components/CreateTabGroupButton';
import TabGroupList from './components/TabGroupList';
import { useEffect, useState } from 'react';
import TabGroupActions from './components/TabGroupActions';
import { openTabGroup, removeTabGroup } from 'shared/tab';
import { StorageKeys, TabGroup, useStorageValue } from 'shared/storage';

export function TabView() {
  const [selection, setSelection] = useState<TabGroup | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => setExpand(false), [selection]);

  const [tabGroups] = useStorageValue(StorageKeys.TAB_GROUPS);

  const handleRemove = () => {
    if (tabGroups && selection && confirm('These tabs will be removed')) {
      removeTabGroup(tabGroups.indexOf(selection)).then(() =>
        setSelection(null),
      );
    }
  };

  if (!tabGroups) {
    return null;
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{ opacity: 0.67, fontWeight: 'bold', mb: 2 }}
      >
        Saved Tabs
      </Typography>
      <Stack gap={1}>
        {selection === null ? (
          <CreateTabGroupButton />
        ) : (
          <Box sx={{ mt: '-3px' }}>
            <TabGroupActions
              selection={selection}
              expand={expand}
              onExpand={setExpand}
              onRemove={handleRemove}
              onOpenTabs={() => openTabGroup(selection)}
            />
          </Box>
        )}
        <Box sx={{ mx: -3, maxHeight: '236px', overflowY: 'auto' }}>
          <TabGroupList
            tabGroups={tabGroups}
            selection={selection}
            onSelect={setSelection}
            expand={expand}
          />
        </Box>
      </Stack>
    </>
  );
}
