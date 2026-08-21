import { Router } from "express";

import { TopicContentController } from "./topicContent.controller";

const TopicContentRoutes = Router();

// =========================================================
// CREATE
// =========================================================

TopicContentRoutes.post("/", TopicContentController.createTopicContent);

// =========================================================
// GET ONLY PUBLISHED CONTENT
// =========================================================

TopicContentRoutes.get(
  "/topic/:topicId/published",
  TopicContentController.getPublishedTopicContent,
);

// =========================================================
// GET ALL CONTENT
// Admin only / full content
// =========================================================

TopicContentRoutes.get(
  "/topic/:topicId",
  TopicContentController.getTopicContent,
);

// =========================================================
// UPDATE
// =========================================================

TopicContentRoutes.patch(
  "/topic/:topicId",
  TopicContentController.updateTopicContent,
);

// =========================================================
// CREATE OR UPDATE
// =========================================================

TopicContentRoutes.put(
  "/topic/:topicId",
  TopicContentController.upsertTopicContent,
);

// =========================================================
// DELETE
// =========================================================

TopicContentRoutes.delete(
  "/topic/:topicId",
  TopicContentController.deleteTopicContent,
);

export default TopicContentRoutes;
