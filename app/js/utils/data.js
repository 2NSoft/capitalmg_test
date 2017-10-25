/* globals $ */

$.put = (url, data, type = 'application/json') => {
     return $.ajax({
       url: url,
       type: 'PUT',
       data: JSON.stringify(data),
       contentType: type,
     });
   };


const getUserConfirmData = () => {
    return Promise.all( [
            $.get('/api/v1/users?notconfirmed=true'),
            $.get('/api/v1/roles'),
        ])
        .then( ([users, roles]) => {
            return Promise.resolve( { users, roles } );
        } );
};

const updateUserRole = (data) => {
    return $.put('/api/v1/users', data);
};

module.exports = {
    getUserConfirmData,

    updateUserRole,
};
