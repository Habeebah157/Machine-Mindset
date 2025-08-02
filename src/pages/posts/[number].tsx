import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getPostData } from "@utils/graphql";
import { Layout } from "@components/Layout";
import { CONFIG } from "@utils/config";
import Giscus from "@giscus/react";
import hljs from "highlight.js";
import useSWR from "swr";

const PostPage: FC = () => {
	const location = useLocation();
	const number = location.pathname.split("/")[2];

	const { data: post, error } = useSWR(`/posts/${number}`, async () => {
		const post = await getPostData(parseInt(number));
		return post;
	});

	const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		const codeBlocks = document.querySelectorAll(".highlight");
		for (const element of codeBlocks) {
			const content = element.getAttribute("data-snippet-clipboard-copy-content") as string;
			const highlighted = hljs.highlightAuto(content).value;
			element.innerHTML = `<pre>${highlighted}</pre>`;
		}
	}, [post]);

	useEffect(() => {
		if (!post?.bodyHTML) return;

		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = post.bodyHTML;
		const textContent = tempDiv.textContent || tempDiv.innerText || "";

		const speech = new SpeechSynthesisUtterance(textContent);
		speech.lang = "en-US";
		speech.rate = 1;
		speech.pitch = 1;
		setUtterance(speech);
	}, [post]);

	const handlePlay = () => {
		if (utterance) {
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(utterance);
		}
	};

	const handlePause = () => {
		window.speechSynthesis.pause();
	};

	const handleResume = () => {
		window.speechSynthesis.resume();
	};

	const handleStop = () => {
		window.speechSynthesis.cancel();
	};

	return (
		<Layout title={post?.title || "Post"} loading={!post && !error}>
			{error ? (
				"error"
			) : post ? (
				<div className="container mx-auto pb-10">

					<div className="mx-auto flex items-center justify-center mb-4">
						Author:
						<a
							target="_blank"
							href={`https://github.com/${post.author.login}`}
							className="flex cursor-pointer items-center text-blue-500 hover:text-blue-600 hover:underline"
						>
							<img
								src={post.author.avatarUrl}
								className="mx-2 h-10 w-10 rounded-full"
								alt={`${post.author.login} avatar`}
							/>
							{post.author.login}
						</a>
					</div>

					<div className="flex gap-4 justify-center my-6">
						<button
							onClick={handlePlay}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							🔊 Play
						</button>
						<button
							onClick={handlePause}
							className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
						>
							⏸ Pause
						</button>
						<button
							onClick={handleResume}
							className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
						>
							▶ Resume
						</button>
						<button
							onClick={handleStop}
							className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
						>
							🛑 Stop
						</button>
					</div>

					<div
						className="prose prose-invert mx-auto p-4 md:p-0"
						dangerouslySetInnerHTML={{ __html: post.bodyHTML }}
					/>

					{/* Comments */}
					<Giscus
						repo="Habeebah157/Machine-Mindset"
						repoId="R_kgDOPOg91Q"
						category="Announcements"
						categoryId="DIC_kwDOPOg91c4CtHl3"
						mapping="pathname"
						strict="0"
						reactionsEnabled="1"
						emitMetadata="0"
						inputPosition="bottom"
						theme="preferred_color_scheme"
						lang="en"
					/>
				</div>
			) : null}
		</Layout>
	);
};

export default PostPage;
