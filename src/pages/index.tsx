import React, { FC, useMemo } from "react";
import { PostCard } from "@components/PostCard";
import { Layout } from "@components/Layout";
import { getPosts } from "@utils/graphql";
import useSWR from "swr";

// Unified date parsing function
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  const now = new Date();

  // Handle "Today at hh:mm AM/PM"
  let match = dateStr.match(/Today at (\d{1,2}):(\d{2}) (AM|PM)/i);
  if (match) {
    let [, hourStr, minuteStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
  }

  // Handle "Yesterday at hh:mm AM/PM"
  match = dateStr.match(/Yesterday at (\d{1,2}):(\d{2}) (AM|PM)/i);
  if (match) {
    let [, hourStr, minuteStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      hour,
      minute
    );
  }

  // Try ISO or standard date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Simplified, clearer emoji per month
function getEmojiForMonth(monthYear: string) {
  const month = monthYear.split(" ")[0].toLowerCase();

  const monthEmojiMap: Record<string, string> = {
    january: "🎴",
    february: "🫀",
    march: "🌸",
    april: "📕",
    may: "☀️",
    june: "💐",
    july: "☁️",
    august: "💖",
    september: "🍁",
    october: "🌼",
    november: "🍂",
    december: "❄️",
  };

  return monthEmojiMap[month] || "✨";
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

      // Ignore posts from the 'giscus' bot
      if (post.author?.login === "giscus") {
        return acc;
      }

      const date = parseDateString(post.createdAt);

      if (!date) {
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
    return Object.keys(groupedPosts).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
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
