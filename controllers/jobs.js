const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    //we are not looking for all the jobs, we are looking for the jbs which are associated with that particular user
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getJob = async (req, res) => {
    //we can access the job id in the params object
    const { user: { userId }, params: { id: jobId }} = req
    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })
    if (!job){
        throw new NotFoundError(`No job id found with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
    const { body: {company, position}, user: { userId }, params: { id: jobId }} = req
    if (company === '' || position === ''){
        throw new BadRequestError('Company or position fields cannot be empty')
    }
    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true,runValidators:true})
}
const deleteJob = async (req, res) => {
    //one of them is coming from auth middleware and the other is coming from params
    const {user: {userId}, params: {id: jobId}} = req
    const job = await Job.findOneAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if (!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
