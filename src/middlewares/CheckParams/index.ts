import express from 'express';

const checkParams = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const params = req.params;

    for(let [_, v] of Object.entries(params)) {
        if(v === undefined || v === null || v === '' || v === 'undefined' || v === 'null') {
            res.status(200).send({success: false, code: 101});
            return;
        }
    }

    next();
};

export default checkParams;