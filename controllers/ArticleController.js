const test = (req, res) => {
    return res.status(200).json({
        message: "I'm a test action in the articles controller"
    });
}

const course = (req, res) => {
    return res.status(200).json([{
        course: "Backend master",
        athor: "Jose Lopez"
    },
    {
        course: "Frontend master",
        athor: "Jose Lopez"
    }]);
}

const save = (req, res) => {
    let params = req.body;

    return res.status(200).json({
        message: "Save action",
        params
    })
}

module.exports = {
    test,
    course,
    save
}