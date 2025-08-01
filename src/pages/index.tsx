import React, { FC, useMemo } from "react";
import { PostCard } from "@components/PostCard";
import { Layout } from "@components/Layout";
import { getPosts } from "@utils/graphql";
import useSWR from "swr";

function getEmojiForMonth(month: string) {
  const monthEmojis = [
    "❄️", "🌸", "☀️", "🍂", "💖", "☁️", "✨", "🔥", "🍁",
  ];
  const hash = month
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return monthEmojis[hash % monthEmojis.length];
}

const HomePage: FC = () => {
  const { data: posts, error } = useSWR("/posts", async () => {
    const posts = await getPosts();
    return posts;
  });

  const groupedPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return {};

    return posts.reduce((acc: Record<string, typeof posts>, post) => {
      if (!post.createdAt) return acc;

      const date = new Date(post.createdAt);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date on post:", post);
        return acc;
      }

      const monthYear = date.toLocaleString("en-US", { month: "long", year: "numeric" });

      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(post);

      return acc;
    }, {});
  }, [posts]);

  const sortedMonths = useMemo(() => {
    return Object.keys(groupedPosts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [groupedPosts]);

  return (
    <Layout title="Home" loading={!posts && !error}>
      <div className="px-6 mx-10">
        {error ? (
          <p>Error loading posts.</p>
        ) : !posts ? (
          <p>Loading...</p>
        ) : (
          <>
            {sortedMonths.map((month) => (
              <section key={month} className="my-10">
                <h2 className="mb-6 text-3xl font-extrabold border-b-2 border-gray-300 pb-2 text-white">
                  {getEmojiForMonth(month)} {month}
                </h2>

                <div className="space-y-6">
                  {groupedPosts[month].map((post) => (
                    <PostCard key={post.number ?? post.id} {...post} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
