const AccessControl = require('accesscontrol');

let grantsObject = {
    admin: {
        user: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        }
    },
    user: {
        user: {
            'read:any': ['*'],
            'update:own': ['*', '!role'],
            'delete:own': ['*']
        }
    }
};

module.exports = new AccessControl(grantsObject);