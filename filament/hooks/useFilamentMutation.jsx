import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { GRAPHQL_ROUTE } from '../constants';
import { uniqueId } from '../utils';

const saveDataToCache = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));

const getDataFromCache = (key) => JSON.parse(sessionStorage.getItem(key));

const useFilamentMutation = (mutation, callback) => {
  const [state, setState] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const { current: mutationId } = useRef(uniqueId());

  const offlineQueueKey = mutationId + '_offline_queue';
  const intervalIdKey = mutationId + '_interval';

  // Run callback passed in by `useFilamentMutation`
  useEffect(() => {
    if (state && callback) callback();
  }, [state]);

  // Run once
  useEffect(() => {
    initializeOfflineQueue();
    startOfflineInterval();
    return () => clearInterval(intervalId);
  }, []);

  const initializeOfflineQueue = () => {
    const offlineQueue = getDataFromCache(offlineQueueKey);
    if (!offlineQueue) saveDataToCache(offlineQueueKey, []);
  };

  const startOfflineInterval = () => {
    let offlineIntervalId = getDataFromCache(intervalIdKey);
    if (offlineIntervalId) return;

    offlineIntervalId = setInterval(processOfflineQueue, 1000);
    saveDataToCache(intervalIdKey, offlineIntervalId);
    setIntervalId(offlineIntervalId);
  };

  const processOfflineQueue = async () => {
    const offlineQueue = getDataFromCache(offlineQueueKey);

    while (navigator.onLine && offlineQueue.length) {
      const mutation = offlineQueue.shift();
      const response = await axios.post(GRAPHQL_ROUTE, { query: mutation });
      setState(response.data.data);
    }

    saveDataToCache(offlineQueueKey, offlineQueue);
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
    const offlineQueue = getDataFromCache(offlineQueueKey);
    offlineQueue.push(mutation(...args));
    saveDataToCache(offlineQueueKey, offlineQueue);
  };

  return [makeMutation, state];
};

export default useFilamentMutation;
