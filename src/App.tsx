import React, { memo, useCallback, useLayoutEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./App.less";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);
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
	<>
		<br />
		<br />
	</>,
	<>
		<br />
		<br />
	</>,
	"Feed is that conspiracy:",
	"the conspiracy of trust.",
	<>
		<br />
		<br />
	</>,
	<>
		<br />
		<br />
	</>,
	"Trust is the single",
	"most important ingredient ",
	"missing from digital relationships.",
	<>
		<br />
		<br />
	</>,
	<>
		<br />
		<br />
	</>,
	"Boston Consulting Group ",
	"and the World Economic Forum ",
	"forecast the digital economy ",
	"to be worth between ",
	<strong>1.5 and 2.5 trillion dollars</strong>,
	<strong>by 2016.</strong>,
	<>
		<br />
		<br />
	</>,
	<>
		<br />
		<br />
	</>,
	"The difference ",
	"between those numbers ",
	<>
		{`is `}
		<a href="http://www3.weforum.org/docs/WEF_IT_RethinkingPersonalData_Report_2012.pdf " target="_blank">
			trust
		</a>
		.
	</>,
	<>
		<br />
		<br />
	</>,
	<>
		<br />
		<br />
	</>,
	<>
		Feed is a digital mechanism of
		<strong>trust</strong>
	</>,
];

const ScrollText = memo(() => {
	const container = useRef<HTMLDivElement | null>(null);
	const wrapper = useRef<HTMLDivElement | null>(null);
	const boxes = useRef<gsap.DOMTarget[]>([]);
	const handleTo = useCallback(() => {
		boxes.current = gsap.utils.toArray(".starwars-wrapper p");
		boxes.current.forEach((box, index) => {
			(box as HTMLElement).style.cssText = `opacity: ${1 - index * 0.25}; transform: translate(0%, ${
				index * 100
			}%) translate3d(0px, 0px, 0px) scale(${1 - index * 0.1}, ${1 - index * 0.1});`;
		});
	}, []);
	const scrollHeight = useRef(0);
	const getSize = () => {
		scrollHeight.current = container.current?.scrollHeight || 0;
	};
	useLayoutEffect(() => {
		window.addEventListener("resize", getSize);
		return () => {
			window.removeEventListener("resize", getSize);
		};
	}, []);
	useGSAP(() => {
		handleTo();
		getSize();
		let currentScrollPosition = 0;
		const height = wrapper.current?.clientHeight || 0;
		const handleScroll = (e: Observer) => {
			const absCurrentScrollPosition = Math.abs(currentScrollPosition);
			if (absCurrentScrollPosition > scrollHeight.current) currentScrollPosition = -scrollHeight.current;
			// 计算滚动的距离
			const scrollDistance = e.deltaY;
			// 更新滚动位置
			currentScrollPosition += scrollDistance * -0.4;
			if (currentScrollPosition > 0) currentScrollPosition = 0;
			// console.log(currentScrollPosition);
			//计算滚动比例
			boxes.current.forEach((box, index) => {
				if (absCurrentScrollPosition < index * 40) {
					(box as HTMLElement).style.cssText = `opacity: ${1 - index * 0.25}; transform: translate(0%, ${
						index * 100
					}%) translate3d(0px, 0px, 0px) scale(${1 - index * 0.1}, ${1 - index * 0.1});`;
					return;
				}
				const el = box as HTMLElement,
					baseYPercent = index * 100;
				const percent = (currentScrollPosition + index * 40) / height;
				let newYPercent = baseYPercent + percent * 100;
				if (newYPercent < -400) newYPercent = -400;
				if (newYPercent > baseYPercent) newYPercent = baseYPercent;
				//透明度
				const baseOpacity = 1 - index * 0.25,
					opacityPercent = percent / 4;
				let newOpacity = 0;
				if (index * -0.25 > opacityPercent) {
					newOpacity = 2 - (baseOpacity - opacityPercent);
				} else {
					newOpacity = baseOpacity - opacityPercent;
				}
				newOpacity = Math.max(0, Math.min(1, newOpacity));
				//scale
				const baseScale = 1 - index * 0.1;
				let newScale = baseScale - percent / 10;
				if (newScale > 1.4) newScale = 1.4;
				if (index === boxes.current.length - 1) {
					//最后一行
					if (newScale > 1) {
						newScale = 1;
						newOpacity = 1;
						newYPercent = 0;
					}
				}
				el.style.cssText = `opacity: ${newOpacity}; transform: translate(0%, ${newYPercent}%) translate3d(0px, 0px, 0px) scale(${newScale}, ${newScale});`;
			});
		};
		ScrollTrigger.observe({
			target: ".starwars-container",
			type: "wheel",
			preventDefault: true,
			onUp: handleScroll,
			onDown: handleScroll,
		});
	});
	return (
		<div className="starwars-container" ref={container}>
			<div className="starwars-wrapper" ref={wrapper}>
				{contentP.map((item, index) => {
					return <p key={index}>{item}</p>;
				})}
			</div>
		</div>
	);
});
function App() {
	return (
		<div className="cineslider-container">
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
				<ScrollText />
			</div>
			<div id="homepage-technology" className="cineslider-slide"></div>
		</div>
	);
}

export default App;
