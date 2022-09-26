const createError = require("http-errors");
const express = require('express');

const { settingsKeys, encryptionFields } = require('../config/config');
const models = require('../models/index');
const crypt = require('../utils/encryption');
const { getValueByKey } = require("../utils/settings");

const router = new express.Router();

router.get('/settings', async (req, res, next) => {
    try {
        const inputNames = {};

        for (let param of Object.values(settingsKeys)) {
            let settingsValue = await getValueByKey(param);

            if (settingsValue) {
                inputNames[param] = settingsValue;
            } else {
                inputNames[param] = '';
            }
        }

        let selectiveSubjects = await models.Schedule.find({selective: true}).lean();

        res.render('settings.hbs', {
            title: 'Settings',
            inputNames,
            selectiveSubjects
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.post('/settings', async (req, res, next) => {
    try {
        const arrExpectedParams = Object.keys(settingsKeys);

         for (let param of arrExpectedParams) {
            if (req.body.hasOwnProperty(param)) {
                let bodyValue = req.body[param];

                if (encryptionFields.includes(param)) {
                    bodyValue = crypt.encryption(bodyValue);
                }

                await models.Settings.findOneAndUpdate(
                    {
                        key: param
                    },
                    {
                        key: param,
                        value: bodyValue
                    },
                    {
                        upsert: true
                    }
                );
            }
        }

        res.redirect('/settings');
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.put('/settings/group', async (req, res, next) => {
    try {
        let { group } = req.query;
        let selected = req.query.selected === 'true';

        if (!group) {
            return res.status(404).json({
                message: 'Bad request',
            });
        }

        let arrGroups = await getValueByKey(settingsKeys.arrayGroups);
        arrGroups.forEach((item) => {
            if (item.group === group) {
                item.selected = selected;
            }
        });

        await models.Settings.updateOne({key: settingsKeys.arrayGroups}, {value: arrGroups});

        res.status(200).json({
            message: 'OK',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.put('/settings/subject', async (req, res, next) => {
    try {
        let { subject } = req.query;
        let selected = req.query.selected === 'true';

        if (!subject) {
            return res.status(404).json({
                message: 'Bad request',
            });
        }

        let arrSubjects = await getValueByKey(settingsKeys.arraySubjects);
        arrSubjects.forEach((item) => {
            if (item.subject === subject) {
                item.selected = selected;
            }
        });

        await models.Settings.updateOne({key: settingsKeys.arraySubjects}, {value: arrSubjects});

        res.status(200).json({
            message: 'OK',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;