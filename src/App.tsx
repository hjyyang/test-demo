import React, { memo, useCallback, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./App.less";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
import videosrc from "./assets/intro.mp4";

type PlayerType = ReturnType<typeof videojs>;
const videoJsOptions = {
	autoplay: true,
	controls: true,
	responsive: true,
	fluid: true,
	loop: true,
	muted: true,
	sources: [
		{
			src: videosrc,
			type: "video/mp4",
		},
	],
};

const VideoJS = memo(() => {
	const videoRef = React.useRef(null);
	const playerRef = React.useRef<PlayerType | null>(null);

	const onReady = (player: PlayerType) => {
		playerRef.current = player;

		player.on("waiting", () => {
			console.log("player is waiting");
		});

		player.on("dispose", () => {
			console.log("player will dispose");
		});
	};

	React.useEffect(() => {
		if (!playerRef.current) {
			const videoElement = videoRef.current;
			if (!videoElement) return;
			const player = (playerRef.current = videojs(videoElement, videoJsOptions, () => {
				onReady && onReady(player);
			}));
		} else {
			const player = playerRef.current;
			player.autoplay(videoJsOptions.autoplay);
			player.src(videoJsOptions.sources);
		}
	}, [videoRef]);

	React.useEffect(() => {
		const player = playerRef.current;
		return () => {
			if (player) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [playerRef]);

	return (
		<div data-vjs-player>
			<video ref={videoRef} className="video-js vjs-big-play-centered" />
		</div>
	);
});
const contentP = [
	"When you want something, ",
	"all the universe conspires ",
	"in helping you to achieve it.",
	<strong>
		<i>
			<small>Paulo Coelho</small>
		</i>
	</strong>,
	<br></br>,
	<br></br>,
	"Feed is that conspiracy:",
	"the conspiracy of trust.",
	<br></br>,
	<br></br>,
	"Trust is the single",
	"most important ingredient ",
	"missing from digital relationships.",
	<br></br>,
	<br></br>,
	"Boston Consulting Group ",
	"and the World Economic Forum ",
	"forecast the digital economy ",
	"to be worth between ",
	<strong>1.5 and 2.5 trillion dollars</strong>,
	<strong>by 2016.</strong>,
	<br></br>,
	<br></br>,
	"The difference ",
	<>
		is
		<a href="http://www3.weforum.org/docs/WEF_IT_RethinkingPersonalData_Report_2012.pdf " target="_blank">
			trust
		</a>
		.
	</>,
	"The difference ",
	"between those numbers ",
	<br></br>,
	<br></br>,
	<>
		Feed is a digital mechanism of <strong>trust</strong>
	</>,
];
function App() {
	const container = useRef<HTMLDivElement | null>(null);
	const boxes = useRef<gsap.DOMTarget[]>([]);
	const handleTo = useCallback(() => {
		boxes.current = gsap.utils.toArray(".starwars-wrapper p");
		boxes.current.forEach((box, index) => {
			gsap.to(box, {
				opacity: 1 - index * 0.25,
				scrollTrigger: box,
				yPercent: index * 100,
				scale: 1 - index * 0.1,
			});
		});
	}, []);
	const main = useRef<HTMLDivElement | null>(null);
	useGSAP(
		() => {
			handleTo();
			let currentScrollPosition = 0;
			const handleScroll = (e: Observer) => {
				// 计算滚动的距离
				const scrollDistance = e.deltaY * -1;
				// 更新滚动位置
				currentScrollPosition += scrollDistance;
				if (currentScrollPosition > 0) {
					currentScrollPosition = 0;
					handleTo();
					return;
				}
				// console.log(currentScrollPosition, scrollDistance);
				boxes.current.forEach((box, index) => {
					const baseYPercent = index * 100;
					const newYPercent = baseYPercent + (currentScrollPosition / 68) * 100;
					gsap.to(box, {
						opacity: 1 - index * 0.25,
						scrollTrigger: box,
						yPercent: newYPercent,
						scale: 1 - index * 0.1,
					});
				});
			};
			ScrollTrigger.observe({
				target: ".starwars-container",
				type: "wheel",
				preventDefault: true,
				onUp: handleScroll,
				onDown: handleScroll,
			});
		},
		{ scope: main }
	);
	return (
		<div className="cineslider-container" ref={main}>
			<div id="homepage-introduction" className="cineslider-slide">
				<div className="border" data-position="top"></div>
				<div className="border" data-position="right"></div>
				<div className="border" data-position="left"></div>
				<div className="border" data-position="bottom"></div>
				<div className="intro-paragraph">
					<p>
						Feed is an intelligent property rights and payments platform, using intelligent software and
						digital security that goes well beyond 'military-grade' to give users true ownership of their
						data and IP.
					</p>
					<p>
						Feed facilitates trusted exchanges of users' progressively-perfecting data assets with
						businesses, researchers, and governments in a <b>trusted</b>, audited, and independently
						verifiable manner; on their own terms and conditions.
					</p>
				</div>
				<div className="videobg-container">
					<VideoJS />
				</div>
				<div className="starwars-container" ref={container}>
					<div className="starwars-wrapper">
						{contentP.map((item, index) => {
							return (
								<p
									key={index}
									// style={{
									// 	opacity: 1 - index * 0.25,
									// 	transform: `${index !== 0 ? `translate(0%, ${index}00%)` : ""} matrix(${
									// 		1 - index * 0.1
									// 	}, 0, 0, ${1 - index * 0.1}, 0, 0)`,
									// }}
								>
									{item}
								</p>
							);
						})}
					</div>
				</div>
			</div>
			<div id="homepage-technology" className="cineslider-slide"></div>
		</div>
	);
}

export default App;
