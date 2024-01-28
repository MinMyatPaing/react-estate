import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({bla: "dsd"});
});

export default router;