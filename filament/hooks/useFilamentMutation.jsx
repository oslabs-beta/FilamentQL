import { useState, useEffect } from 'react';
import axios from 'axios';

import { GRAPHQL_ROUTE_FROM_CLIENT } from '../constants';

const uniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

const useFilamentMutation = (mutation, callback) => {
  const [state, setState] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const useMutationId = uniqueId();

  // Run callback provided when `useFilamentMutation` is called
  useEffect(() => {
    if (state && callback) callback();
  }, [state]);

  // Run once
  useEffect(() => {
    let offlineQueue = sessionStorage.getItem('offlineQueue');
    let offlineIntervalId = sessionStorage.getItem('offlineIntervalId');

    if (!offlineQueue) {
      sessionStorage.setItem('offlineQueue', '[]');
      offlineQueue = [];
    } else setOfflineQueue(JSON.parse(offlineQueue));

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

  const makeMutation = async (...args) => {
    // online
    if (navigator.onLine) {
      const response = await axios.post(GRAPHQL_ROUTE_FROM_CLIENT, {
        query: mutation(...args),
      });
      setState(response.data.data);
      return;
    }

    // offline
    offlineQueue.push({ id: useMutationId, mutation });
  };

  return [makeMutation, state];
};

export default useFilamentMutation;
