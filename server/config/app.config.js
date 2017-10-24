const init = ( mongoIp, port, suffix ) => {
    suffix = suffix || '';
    const connectionString = `mongodb://${mongoIp}/UniversityData${suffix}`;
    const sessionStoreName = connectionString;
    const config = {
        port,
        connectionString,
        sessionStoreName,
    };
    return Promise.resolve( config );
};

module.exports = { init };
