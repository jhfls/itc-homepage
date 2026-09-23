export interface Dept {
  label: string
  title: string
  desc: string
  href?: string
  linkText?: string
}

/** 身份视觉主题：渐变背景 + 滚动光束颜色 + 是否浅色字墨。 */
export interface RoleTheme {
  light?: boolean
  beam: string
  bg: string
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  creator: { light: true, beam: 'beam-creator', bg: 'bg-creator' },
  mentor: { beam: 'beam-mentor', bg: 'bg-mentor' },
  media: { beam: 'beam-media', bg: 'bg-media' },
  fellow: { beam: 'beam-fellow', bg: 'bg-fellow' },
  visitor: { beam: 'beam-fellow', bg: 'bg-visitor' },
};

export const ROLE_CRUMBS: Record<string, string[]> = {
  creator: ['ABOUT', 'ROLES', 'CREATOR'],
  mentor: ['ABOUT', 'ROLES', 'MENTOR'],
  media: ['ABOUT', 'ROLES', 'MEDIA'],
  fellow: ['ABOUT', 'ROLES', 'MENTOR'],
  visitor: ['HOME', 'ROLES', 'VISITOR'],
};

/** 身份卡片：content 元信息 + 代码主题合并后的形状。 */
export interface RoleCardModel {
  slug: string
  index: string
  code: string
  grade: string
  title: string
  subtitle: string
  desc: string
  light?: boolean
  beam: string
  bg: string
}

export const FOOT_LINKS = [
  { text: 'Creator', href: '/roles/creator' },
  { text: 'Mentor', href: '/roles/mentor' },
  { text: 'Media', href: '/roles/media' },
  { text: 'Mentor', href: '/roles/fellow' },
] as const;
