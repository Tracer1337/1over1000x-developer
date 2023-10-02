import { Box, Stack, Typography } from '@mui/material';
import CreateTabGroupButton from './components/CreateTabGroupButton';
import TabGroupList from './components/TabGroupList';
import { StorageKeys, useStorageValue } from 'shared/storage';

export function TabView() {
  const [tabGroups] = useStorageValue(StorageKeys.TAB_GROUPS);

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
        <CreateTabGroupButton />
        <Box sx={{ mx: -3, maxHeight: '236px', overflowY: 'auto' }}>
          <TabGroupList tabGroups={tabGroups} />
        </Box>
      </Stack>
    </>
  );
}
