const express = require('express');

const Projects = require('../data/helpers/projectModel');
const {
    get,
    insert,
    update,
    remove,

} = require("../data/helpers/actionModel");

const router = express.Router();

// middleware
router.use(express.json());

// endpoints

// Get all the actions
router.get("/", async (req, res) => {
    try {
        const actions = await get();
        res.status(200).json(actions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not get the actions" });
    }
});
// works

// get actions by action id

router.get("/:id", validateProjectId, async (req, res) => {
    try {
        const action = await get(req.params.id);
        res.status(200).json(action);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not get the action" });
    }
});
//works


// post to create new action
router.post("/:id", validateProjectId, async (req, res) => {
    const newPost = { ...req.body, project_id: req.params.id };
    try {
        const action = await insert(newPost);
        res.status(201).json(action);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: "Could not add the action" });
    }
});
//working


// put to modify an action by its action id
router.put("/:id", validateProjectId, async (req, res) => {
    try {
        await update(req.params.id, { ...req.body, id: req.params.id });
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not update the project" });
    }
});
// works

//delete an action by id

router.delete("/:id", async (req, res) => {
    try {
        const result = await remove(req.params.id);
        res
            .status(200)
            .json({ status: `${result} has been successfully deleted` });
    } catch {
        res.status(500).json({ error: "Could not delete project action" });
    }
});
//works

// custom middleware
function validateProjectId(req, res, next) {

    const { id } = req.params;
    Projects.get(id)
        .then(project => {
            if (!project) {
                res.status(400).json({ error: "We could not create an action for that project." });
            }
            else {
                next();
            }
        })
}

module.exports = router;