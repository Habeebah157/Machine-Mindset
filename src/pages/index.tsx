import type { FC } from "react";
import { PostCard } from "@components/PostCard";
import { Layout } from "@components/Layout";
import { getPosts } from "@utils/graphql";
import { chunk } from "@utils/chunk";
import useSWR from "swr";

const HomePage: FC = () => {
	const { data: posts, error } = useSWR("/posts", async () => {
		const posts = await getPosts();
		return posts;
	});

	return (
  <Layout title="Home" loading={!posts && !error}>
    <div className=" px-6 mx-10">
      {error ? (
        "error"
      ) : (
        posts &&
        chunk(posts, 2).map((postList, idx) => (
          <div
            key={idx}
            className="my-5 w-full items-center justify-center lg:flex lg:flex-col mx-5"
          >
            {postList.map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>
        ))
      )}
    </div>
  </Layout>
);
};

export default HomePage;
