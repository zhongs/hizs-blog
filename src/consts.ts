import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "HiZS",
  DESCRIPTION: "专注于前端技术分享，Vue/React 实战经验，以及独立开发者的被动收入探索。",
  EMAIL: "191492580@qq.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "前端开发与技术复盘",
  DESCRIPTION: "专注于前端技术分享，Vue/React 实战经验，以及独立开发者的被动收入探索。",
};

export const BLOG: Metadata = {
  TITLE: "文章",
  DESCRIPTION: "分享前端技术心得与实战经验。",
};

export const PROJECTS: Metadata = {
  TITLE: "项目",
  DESCRIPTION:
    "我的个人项目与独立开发产品。",
};

export const SOCIALS: Socials = [
  {
    NAME: "GitHub",
    HREF: "https://github.com/zhongs",
  },
];
