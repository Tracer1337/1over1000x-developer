import { Box, Stack } from '@mui/material';
import CreateTabGroupButton from './components/CreateTabGroupButton';
import TabGroupList from './components/TabGroupList';
import { StorageKeys, useStorageValue } from 'shared/storage';

export function TabView() {
  const [tabGroups] = useStorageValue(StorageKeys.TAB_GROUPS);

  if (!tabGroups) {
    return null;
  }

  return (
    <Stack gap={1}>
      <CreateTabGroupButton />
      <Box sx={{ mx: -3, maxHeight: '236px', overflowY: 'auto' }}>
        <TabGroupList tabGroups={tabGroups} />
      </Box>
    </Stack>
  );
}
