const express = require("express");
const router = express.Router();

// Database helpers
const {
    get,
    insert,
    update,
    remove,
    getProjectActions,
} = require("../data/helpers/projectModel");

// Route handlers

// Get all the projects
router.get("/", async (req, res) => {
    try {
        const projects = await get();
        res.status(200).json(projects);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not get the projects" });
    }
});
// works

// Get a single project by project_id
router.get("/:id", validateProjectId, async (req, res) => {
    try {
        const project = await get(req.params.id);
        res.status(200).json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not get the project" });
    }
});
//works

// Get all actions on the project with that project_id
router.get("/:id/actions", validateProjectId, async (req, res) => {
    try {
        const project = await getProjectActions(req.params.id);
        res.status(200).json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not get the project" });
    }
});
//works

// Add a project
router.post("/", validateProject, async (req, res) => {
    try {
        const project = await insert(req.body);
        res.status(200).json(project);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: "Could not add the project" });
    }
});
//works

// Delete a project
router.delete("/:id", validateProjectId, async (req, res) => {
    try {
        await remove(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not delete the project" });
    }
});
//works

// Update a project
router.put("/:id", validateProjectId, validateProject, async (req, res) => {
    try {
        await update(req.params.id, { name: req.body.name, description: req.body.description }); // prevent unwanted changes to id, user_id
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Could not update the project" });
    }
});
//works


// custom middleware

// Validates the project id exists
// Returns error message response objects if it fails to find that project_id
async function validateProjectId(req, res, next) {
    try {
        const project = await get(Number(req.params.id));
        if (project) {
            req.project = project;
        } else {
            return res.status(400).json({ message: "Invalid project id" });
        }
        next();
    } catch {
        return res.status(500).json({ message: "Could not validate project id" });
    }
}

// Validates that req.body contains the required fields
// Returns error message response objects if it fails to find the require data on req.body
function validateProject(req, res, next) {
    if (req.body) {
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: "Missing required text and/or description field(s)" });
        }
    } else {
        return res.status(400).json({ message: "Missing project data" });
    }
    next();
}

module.exports = router;