import express from "express";

import { ResultController } from "./result.controller";

const ResultRoutes = express.Router();

ResultRoutes.get("/:sessionId", ResultController.getResult);

export default ResultRoutes;
