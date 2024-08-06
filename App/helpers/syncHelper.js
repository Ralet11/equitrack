import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerBackgroundFetch } from '../services/backgroundFetch';

export const SyncManager = () => {
  const horses = useSelector(state => state?.horses);
  const user = useSelector(state => state.user);
const dispatch = useDispatch();

  const horsesRef = useRef(horses);
  const userRef = useRef(user);

  useEffect(() => {
    horsesRef.current = horses;
  }, [horses]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    console.log("Iniciando sinc");
    const cleanup = registerBackgroundFetch(1000000, horsesRef, userRef, dispatch);

    return () => cleanup();
  }, [dispatch]);
  

  return null;
};