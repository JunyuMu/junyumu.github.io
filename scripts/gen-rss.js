const { promises: fs } = require("fs");
const path = require("path");
const RSS = require("rss");
const matter = require("gray-matter");

async function generate() {
  const feed = new RSS({
    title: "Junyu's Blog",
    site_url: "https://junyu.dev",
    feed_url: "https://junyu.dev/feed.xml",
    language: "zh-cn",
  });

  const posts = await fs.readdir(path.join(__dirname, "..", "data", "posts"));

  await Promise.all(
    posts.map(async (name) => {
      const content = await fs.readFile(
        path.join(__dirname, "..", "data", "posts", name)
      );
      const frontmatter = matter(content);

      feed.item({
        guid: frontmatter.data.id,
        title: frontmatter.data.title,
        url: "/p/" + name.replace(/\.mdx?/, ""),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tags,
      });
    })
  );

  await fs.writeFile("./public/feed.xml", feed.xml({ indent: true }));
}

generate();
