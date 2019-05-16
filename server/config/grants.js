const AccessControl = require('accesscontrol');

let grantsObject = {
    admin: {
        User: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        }
    },
    user: {
        User: {
            'read:any': ['*'],
            'update:own': ['*', '!role'],
            'delete:own': ['*']
        }
    }
};

module.exports = new AccessControl(grantsObject);