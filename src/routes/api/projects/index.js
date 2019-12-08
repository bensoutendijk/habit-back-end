import express from 'express';
import mongoose from 'mongoose';
import auth from '../../auth';

const router = express.Router();
const LocalUser = mongoose.model('LocalUser');
const OAuthUser = mongoose.model('OAuthUser');
const Project = mongoose.model('Project');

router.get('/', auth.required, async (req, res) => {
    const { localAuth: { _id } } = req;

    const { services } = await LocalUser.findById(_id);
    const users = await OAuthUser.find({ _id: { $in: services } });
    
    try {
        const projects = await Project.find({
            serviceid: { $in: users.map(user => user._id) },
        });

        return res.status(200).send(projects);
    } catch (error) {
        return res.send({
            projects: 'Error finding projects',
            message: error.message,
        });
    }

});

router.post('/', auth.required, async (req, res) => {
    const { body: project } = req;

    try {
        const existingProject = await Project.find({
            serviceid: project.serviceid,
            repoid: project.repoid,
        });
        if (existingProject) {
            return res.send(existingProject);
        }
    } catch (error) {
        return res.send({
            projects: 'Error finding project',
        });
    }

    const finalProject = new Project(project);

    try {
        await finalProject.save();
        return res.send([finalProject]);
    } catch (error) {
        return res.send({
            projects: 'Could not save project',
        });
    }
});

export default router;
