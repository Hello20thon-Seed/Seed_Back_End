import express from 'express';

const checkBody = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const body = req.body;

    for(let [_, v] of Object.entries(body)) {
        if(v === undefined || v === null || v === '' || v === 'undefined' || v === 'null') {
            res.status(200).send({success: false, code: 101});
            return;
        }
    }

    next();
};

export default checkBody;