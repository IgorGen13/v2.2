import { useEffect, useRef } from 'react';

type Callback = () => void;

export const useOnWindowScroll = (callback: Callback) => {
	const listener = useRef<Callback>();

	useEffect(() => {
		listener.current = callback;
	}, [callback]);

	useEffect(() => {
		const listenerWrapper = () => {
			listener.current?.();
		};
		window.addEventListener('scroll', listenerWrapper);
		return () => {
			window.removeEventListener('scroll', listenerWrapper);
		};
	}, []);
};
