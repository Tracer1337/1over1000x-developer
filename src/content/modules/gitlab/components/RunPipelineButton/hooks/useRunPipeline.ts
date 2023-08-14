import { getApiHeaders } from 'shared/gitlab';
import { useState } from 'react';

export function useRunPipeline({
  ref,
  onSuccess,
  onError,
}: {
  ref: string;
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
        ref,
        variables_attributes: [],
      }),
    })
      .then(() => onSuccess())
      .catch(() => onError())
      .finally(() => setIsLoading(false));
  };

  return { isLoading, runPipeline };
}
