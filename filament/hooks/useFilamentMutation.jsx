import { useState, useEffect } from 'react';
import axios from 'axios';

import { FILAMENT_ROUTE } from '../constants';

const uniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

const useFilamentMutation = (mutation) => {
  const [state, setState] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const useMutationId = uniqueId();

  // Run once
  useEffect(() => {
    const offlineQueue = sessionStorage.getItem('offlineQueue');
    let offlineIntervalId = sessionStorage.getItem('offlineIntervalId');

    if (!offlineQueue)
      sessionStorage.setItem('offlineQueue', JSON.stringify([]));
    else setOfflineQueue(JSON.parse(offlineQueue));

    if (!offlineIntervalId) {
      offlineIntervalId = setInterval(() => {
        if (!navigator.onLine) return;

        const { matchedMutations, notMatchedMutations } = offlineQueue.reduce(
          (result, currentMutation) => {
            if (currentMutation.id === useMutationId) {
              result.matchedMutations.push(currentMutation);
            } else {
              result.notMatchedMutations.push(currentMutation);
            }
            return result;
          },
          { matchedMutations: [], notMatchedMutations: [] }
        );

        // Save non-relevant mutations back to cache
        sessionStorage.setItem(
          'offlineQueue',
          JSON.stringify(notMatchedMutations)
        );

        matchedMutations.forEach(async (currentMutation) => {
          const response = await axios.post(FILAMENT_ROUTE, {
            query: currentMutation,
          });

          setState(response.data.data);
        });
      }, 1000);

      sessionStorage.setItem(
        'offlineIntervalId',
        JSON.stringify(offlineIntervalId)
      );
    }

    return () => clearInterval(offlineIntervalId);
  }, []);

  const makeMutation = async () => {
    // online
    if (navigator.onLine) {
      const response = await axios.post(FILAMENT_ROUTE, { query: mutation });
      setState(response.data.data);
      return;
    }

    // offline
    offlineQueue.push({ id: useMutationId, mutation });
  };

  return [makeMutation, state];
};

export default useFilamentMutation;
