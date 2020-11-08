import { useState, useEffect } from 'react';
import axios from 'axios';

import { GRAPHQL_ROUTE } from '../constants';
import { uniqueId } from '../utils';

const useFilamentMutation = (mutation, callback) => {
  const [state, setState] = useState(null);
  const useMutationId = uniqueId();

  // Run callback provided d `useFilamentMutation` is called
  useEffect(() => {
    if (state && callback) callback();
  }, [state]);

  // Run once
  useEffect(() => {
    setOfflineQueueInCache();
    setOfflineIntervalIdInCache();

    return () =>
      clearInterval(JSON.parse(sessionStorage.getItem('offlineIntervalId')));
  }, []);

  const setOfflineQueueInCache = () => {
    const offlineQueue = sessionStorage.getItem('offlineQueue');
    if (!offlineQueue) sessionStorage.setItem('offlineQueue', '[]');
  };

  const getOfflineQueue = () =>
    JSON.parse(sessionStorage.getItem('offlineQueue'));

  const setOfflineIntervalIdInCache = () => {
    let offlineIntervalId = sessionStorage.getItem('offlineIntervalId');

    if (!offlineIntervalId) {
      offlineIntervalId = setInterval(processOfflineQueue, 1000);
      sessionStorage.setItem(
        'offlineIntervalId',
        JSON.stringify(offlineIntervalId)
      );
    }
  };

  const processOfflineQueue = () => {
    if (!navigator.onLine) return;
    console.log('navigator.onLine', navigator.onLine);
    const offlineQueue = getOfflineQueue();
    console.log('offlineQueue', offlineQueue);

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
    sessionStorage.setItem('offlineQueue', JSON.stringify(notMatchedMutations));
    console.log('matchedMutations', matchedMutations);
    matchedMutations.forEach(async (currentMutation) => {
      const response = await axios.post(GRAPHQL_ROUTE, {
        query: currentMutation.mutation,
      });

      setState(response.data.data);
    });
  };

  const makeMutation = async (...args) => {
    // online
    if (navigator.onLine) {
      const response = await axios.post(GRAPHQL_ROUTE, {
        query: mutation(...args),
      });
      setState(response.data.data);
      return;
    }

    // offline
    const offlineQueue = getOfflineQueue();
    offlineQueue.push({ id: useMutationId, mutation: mutation(...args) });
    sessionStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
  };

  return [makeMutation, state];
};

export default useFilamentMutation;
