import { SpotlightResult } from 'spotlight/components/Spotlight/results';
import GoogleResult from './GoogleResult';
import ChatGPTResult from './ChatGPTResult';
import GitlabIssueResult from './GitlabIssueResult';
import CommandResult from './CommandResult';
import { ResultComponent } from '../types';

export const resultComponents: {
  [K in SpotlightResult['type']]: ResultComponent<K>;
} = {
  'google': GoogleResult,
  'chatgpt': ChatGPTResult,
  'gitlab-issue': GitlabIssueResult,
  'command': CommandResult,
};
