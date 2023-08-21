import { useState } from 'react';
import { getApiHeaders } from 'shared/gitlab';
import query from 'shared/query';

export function useRunPipeline({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const runPipeline = () => {
    setIsLoading(true);
    fetch('https://gitlab.dzh.hamburg/theraos/app/-/pipelines', {
      method: 'POST',
      headers: {
        ...getApiHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: query('gitlab.mr-pipeline.current-ref'),
        variables_attributes: [],
      }),
    })
      .then(() => onSuccess())
      .catch(() => onError())
      .finally(() => setIsLoading(false));
  };

  return { isLoading, runPipeline };
}
