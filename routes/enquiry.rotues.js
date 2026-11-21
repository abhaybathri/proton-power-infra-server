import express from "express";

import {
  submitEnquiry
} from "../controller/enquiry.controller.js";

const router = express.Router();

router.post("/", submitEnquiry);

export default router;