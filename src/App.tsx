import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
		Feed is a digital mechanism of <strong>trust</strong>
	</>,
];

const ScrollText = memo(({ changePercent }: { changePercent: (percent: number, bottom: boolean) => void }) => {
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
	useGSAP(() => {
		handleTo();
		let currentScrollPosition = 0,
			oldScrollPosition = 0;
		const height = wrapper.current?.clientHeight || 0,
			lastNum = boxes.current.length - 1,
			maxScroll = -lastNum * height - lastNum * 40;
		const handleScroll = (e: Observer) => {
			// 计算滚动的距离
			const scrollDistance = -e.deltaY;
			// 更新滚动位置，0.3为降低滚轮滚动速度，模拟阻尼效果
			currentScrollPosition += scrollDistance * 0.3;
			//限制滚轮滚动值不能超过0
			if (currentScrollPosition > 0) currentScrollPosition = 0;
			let absCurrentScrollPosition = Math.abs(currentScrollPosition);
			//限制滚轮滚动值不超过容器的maxScroll
			if (absCurrentScrollPosition > -maxScroll) currentScrollPosition = maxScroll;
			//滚动比例
			const percent = Math.abs(currentScrollPosition / maxScroll);
			//当前滚轮滚动位置与上次滚动位置相同，不往下执行
			if (currentScrollPosition === oldScrollPosition) {
				if (percent === 1) changePercent(percent, true);
				return;
			}
			oldScrollPosition = currentScrollPosition;
			absCurrentScrollPosition = Math.abs(currentScrollPosition);
			changePercent(percent, false);
			//计算滚动比例
			boxes.current.forEach((box, index) => {
				const el = box as HTMLElement,
					//初始移动比例
					baseYPercent = index * 100;
				//每一行在滚轮滚动过40像素后再移动
				if (absCurrentScrollPosition < index * 40) {
					el.style.cssText = `opacity: ${1 - index * 0.25}; transform: translate(0%, ${
						index * 100
					}%) translate3d(0px, 0px, 0px) scale(${1 - index * 0.1}, ${1 - index * 0.1});`;
					return;
				}
				//每行移动比例
				const percent = (currentScrollPosition + index * 40) / height;
				//每行当前需要移动比例
				let newYPercent = baseYPercent + percent * 100;
				//如小于-400，则最小为-400
				if (newYPercent < -400) newYPercent = -400;
				//如大于初始比例，则最大为初始比例
				if (newYPercent > baseYPercent) newYPercent = baseYPercent;
				//初始透明度
				const baseOpacity = 1 - index * 0.25,
					opacityPercent = percent / 4;
				let newOpacity = 0;
				if (index * -0.25 > opacityPercent) {
					newOpacity = 2 - (baseOpacity - opacityPercent);
				} else {
					newOpacity = baseOpacity - opacityPercent;
				}
				newOpacity = Math.max(0, Math.min(1, newOpacity));
				//缩放
				const baseScale = 1 - index * 0.1;
				let newScale = baseScale - percent / 10;
				if (newScale > 1.4) newScale = 1.4;
				//最后一行
				if (index === boxes.current.length - 1 && newScale > 1) {
					newScale = 1;
					newOpacity = 1;
					newYPercent = 0;
				}
				el.style.cssText = `opacity: ${newOpacity}; transform: translate(0%, ${newYPercent}%) translate3d(0px, 0px, 0px) scale(${newScale}, ${newScale});`;
			});
		};
		ScrollTrigger.observe({
			target: ".starwars-container",
			type: "wheel,touch",
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
const Header = ({ percent }: { percent: number }) => {
	return (
		<header>
			<a href="#/" className="logo"></a>
			<div className="navigation" style={{ display: "block" }}>
				<div className="group" data-page-id="homepage-page">
					<ul>
						<li>
							<a href="#homepage-introduction" className="active">
								Introduction
								<div className="progress-border">
									<div className="progress-line" style={{ width: percent * 100 + "%" }}></div>
								</div>
							</a>
						</li>
						<li>
							<a href="#homepage-technology">The Technology</a>
						</li>
						<li>
							<a href="#homepage-tech-spotlight">Tech Spotlight</a>
						</li>
						<li>
							<a href="#homepage-why-music">Why Music?</a>
						</li>
					</ul>
				</div>
			</div>
			<a href="#" className="toggle-button">
				<span className="lines"></span>
			</a>
		</header>
	);
};
function App() {
	const [scrollInfo, setScrollInfo] = useState({ percent: 0, bottom: false });
	const newPercent = useRef(0);
	const lock = useRef(false);
	const changePercent = useCallback((percent: number, bottom: boolean) => {
		setScrollInfo({ percent, bottom });
		newPercent.current = percent;
		if (percent > 0.05) {
			if (!lock.current) {
				lock.current = true;
				gsap.fromTo(
					".intro-paragraph",
					{ opacity: 1, display: "block" },
					{ opacity: 0, display: "none", duration: 1.5 }
				);
			}
		} else {
			if (lock.current) {
				lock.current = false;
				gsap.fromTo(
					".intro-paragraph",
					{ opacity: 0, display: "none" },
					{ opacity: 1, display: "block", duration: 1.5 }
				);
			}
		}
	}, []);
	useEffect(() => {
		if (scrollInfo.bottom) {
			//文本滚动触底
		}
	}, [scrollInfo.bottom]);
	useGSAP(() => {
		let animating = false,
			slide = gsap.utils.toArray<gsap.DOMTarget>(".cineslider-slide"),
			currentIndex = -1,
			pageIndex = 0,
			shifter = gsap.utils.toArray<gsap.DOMTarget>(".cineslider-shifter"),
			tl = gsap.timeline({
				defaults: { duration: 1.8, ease: "power1.inOut" },
				onComplete: () => {
					animating = false;
				},
			});
		slide.forEach((item, index) => {
			if (index !== pageIndex) gsap.set(item, { display: "none" });
		});
		const tl2 = gsap.timeline({
				defaults: { duration: 1.2, ease: "power1.inOut" },
			}),
			tl3 = gsap.timeline({
				defaults: { duration: 1.8, ease: "power1.inOut" },
			});
		function gotoSection(index: number, direction: 1 | -1) {
			if (index < -1 || index > slide.length - 2) return;
			if (newPercent.current === 1) {
				animating = true;
				if (direction === 1) {
					//向下
					tl2.fromTo(
						shifter[0],
						{ display: "block", zIndex: 1, yPercent: 100 },
						{ display: "block", zIndex: 1, yPercent: -100 }
					);
					tl3.fromTo(
						shifter[1],
						{ display: "block", zIndex: 1, yPercent: 100 },
						{ display: "block", zIndex: 1, yPercent: -100 }
					);
					tl.fromTo(
						slide[index + 1],
						{ display: "block", zIndex: 1, yPercent: 100 },
						{ display: "block", zIndex: 1, yPercent: 0 }
					).set(slide[index], { display: "none" });
				} else {
					//向上
					tl3.fromTo(
						shifter[0],
						{ display: "block", zIndex: 1, yPercent: -100 },
						{ display: "block", zIndex: 1, yPercent: 100 }
					);
					tl2.fromTo(
						shifter[1],
						{ display: "block", zIndex: 1, yPercent: -100 },
						{ display: "block", zIndex: 1, yPercent: 100 }
					);
					tl.fromTo(
						slide[index + 1],
						{ display: "block", zIndex: 2, yPercent: -100 },
						{ display: "block", zIndex: 2, yPercent: 0 }
					)
						.set(slide[index + 2], { display: "none" })
						.set(slide[index + 1], { zIndex: 1 });
				}
				currentIndex = index;
			}
		}
		ScrollTrigger.observe({
			target: ".main-container",
			type: "wheel,touch",
			preventDefault: true,
			onUp: () => !animating && gotoSection(currentIndex - 1, -1),
			onDown: () => !animating && gotoSection(currentIndex + 1, 1),
		});
	});
	return (
		<>
			<Header percent={scrollInfo.percent} />
			<div className="main-container">
				<div className="cineslider-container">
					<div id="homepage-introduction" className="cineslider-slide">
						<div className="border" data-position="top"></div>
						<div className="border" data-position="right"></div>
						<div className="border" data-position="left"></div>
						<div className="border" data-position="bottom"></div>
						<div className="intro-paragraph" style={{ display: "block" }}>
							<p>
								Feed is an intelligent property rights and payments platform, using intelligent software
								and digital security that goes well beyond 'military-grade' to give users true ownership
								of their data and IP.
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
						<ScrollText changePercent={changePercent} />
					</div>
					<div id="homepage-technology" className="cineslider-slide"></div>
					<div className="cineslider-shifter" style={{ backgroundColor: "rgb(230, 230, 230)" }}></div>
					<div className="cineslider-shifter" style={{ backgroundColor: "rgb(53, 1, 127)" }}></div>
				</div>
			</div>
		</>
	);
}

export default App;
