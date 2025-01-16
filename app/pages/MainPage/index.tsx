import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Video from '~/components/Video';
import { ErrorBoundary } from 'react-error-boundary';


export const MainPage = ({ cards }: any) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

	const [activeCard, setActiveCard] = useState<number | null>(null);

	const [muted, setMuted] = useState(true);

	const updateCards = () => {
		const index = cards.findIndex((_: any, index: any) => {
			if (wrapperRef.current) {
				const element = cardRefs.current[index];
				if (element) {
					return (
						wrapperRef.current.scrollTop <= element.offsetTop &&
						wrapperRef.current.scrollTop + wrapperRef.current.offsetHeight >=
							element.offsetTop + element.offsetHeight
					);
				}
			}
		});
		setActiveCard(index >= 0 ? index : null);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(updateCards, []);

	return (
		<div className={styles.page}>
			<div className={styles.wrapper} ref={wrapperRef} onScroll={updateCards}>
				{cards.map((card: any, index: any) => (
					<div
						key={card.src}
						ref={(ref) => (cardRefs.current[index] = ref)}
						className={classNames(styles.card, activeCard === index && styles.cardActive)}
					>
						<Video
							muted={muted}
							onChangeMuted={(muted: any) => setMuted(muted)}
							active={activeCard === index}
							next={activeCard + 1 === index}
							className={styles.video}
							background={card.thumbnail}
							url={card.src}
							options={{
								fill: true,
								preload: 'auto',
								sources: [{ src: card.src, type: 'application/x-mpegURL' }]
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
