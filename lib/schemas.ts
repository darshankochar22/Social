import { z } from "zod";

export const accountSchema = z.object({
	username: z.string().min(3).max(32),
	email: z.string().email(),
	avatarUrl: z.string().url().optional().nullable(),
	bio: z.string().max(280).optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type AccountInput = z.infer<typeof accountSchema>;

export const profileSchema = z.object({
	accountId: z.string(),
	displayName: z.string().min(1).max(64),
	avatarUrl: z.string().url().optional().nullable(),
	coverUrl: z.string().url().optional().nullable(),
	location: z.string().max(64).optional().nullable(),
	website: z.string().url().optional().nullable(),
	about: z.string().max(1000).optional().nullable(),
	socialLinks: z.array(z.object({ platform: z.string().max(32), url: z.string().url() })).optional().nullable(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const postSchema = z.object({
	accountId: z.string(),
	title: z.string().min(1).max(140),
	content: z.string().min(1),
	imageUrl: z.string().url().optional().nullable(),
	tags: z.array(z.string()).optional().default([]),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

export const reelSchema = z.object({
	accountId: z.string(),
	caption: z.string().max(2200).optional().nullable(),
	videoUrl: z.string().url(),
	thumbnailUrl: z.string().url().optional().nullable(),
	durationSec: z.number().int().min(0).max(600),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type ReelInput = z.infer<typeof reelSchema>;

export const commentSchema = z.object({
	targetType: z.enum(["post", "reel"]),
	targetId: z.string(),
	accountId: z.string(),
	text: z.string().min(1).max(1000),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

export const likeSchema = z.object({
	targetType: z.enum(["post", "reel"]),
	targetId: z.string(),
	accountId: z.string(),
	createdAt: z.date().optional(),
});

export type LikeInput = z.infer<typeof likeSchema>;
