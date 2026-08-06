"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const chapter_model_1 = require("../Chapters/chapter.model");
const topic_model_1 = require("../Topics/topic.model");
/* =========================================================
   TOPIC COUNT
   Number of topics inside a chapter
========================================================= */
const incrementTopicCount = async (chapterId, count = 1, session) => {
    await chapter_model_1.Chapter.findByIdAndUpdate(chapterId, {
        $inc: {
            totalTopics: count,
        },
    }, {
        session,
    });
};
const decrementTopicCount = async (chapterId, count = 1, session) => {
    await chapter_model_1.Chapter.findByIdAndUpdate(chapterId, {
        $inc: {
            totalTopics: -count,
        },
    }, {
        session,
    });
};
/* =========================================================
   CHAPTER QUESTION COUNT
========================================================= */
const incrementQuestionCount = async (chapterId, count = 1, session) => {
    await chapter_model_1.Chapter.findByIdAndUpdate(chapterId, {
        $inc: {
            totalQuestions: count,
        },
    }, {
        session,
    });
};
const decrementQuestionCount = async (chapterId, count = 1, session) => {
    await chapter_model_1.Chapter.findByIdAndUpdate(chapterId, {
        $inc: {
            totalQuestions: -count,
        },
    }, {
        session,
    });
};
/* =========================================================
   TOPIC QUESTION COUNT
========================================================= */
const incrementTopicQuestionCount = async (topicId, count = 1, session) => {
    await topic_model_1.Topic.findByIdAndUpdate(topicId, {
        $inc: {
            totalQuestions: count,
        },
    }, {
        session,
    });
};
const decrementTopicQuestionCount = async (topicId, count = 1, session) => {
    await topic_model_1.Topic.findByIdAndUpdate(topicId, {
        $inc: {
            totalQuestions: -count,
        },
    }, {
        session,
    });
};
exports.StatisticsService = {
    incrementTopicCount,
    decrementTopicCount,
    incrementQuestionCount,
    decrementQuestionCount,
    incrementTopicQuestionCount,
    decrementTopicQuestionCount,
};
//# sourceMappingURL=statistics.service.js.map